-- ==========================================
-- UstaFind.uz — Supabase Database Schema
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clean start: Drop existing tables if they exist
drop table if exists public.equipment_rentals cascade;
drop table if exists public.equipments cascade;
drop table if exists public.bookings cascade;
drop table if exists public.reviews cascade;
drop table if exists public.services cascade;
drop table if exists public.profiles cascade;

-- 1. PROFILES TABLE (linked to auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text unique not null,
    phone text,
    avatar_url text,
    role text not null default 'client' check (role in ('client', 'usta_pending', 'usta_approved', 'admin')),
    registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
    bio text,
    city text,
    district text,
    experience integer default 0,
    skills text[] default '{}',
    price_range text,
    portfolio text[] default '{}',
    is_verified boolean default false not null,
    category text,
    rating numeric(3,2) default 0.00 check (rating >= 0.00 and rating <= 5.00),
    review_count integer default 0,
    completed_jobs integer default 0,
    gallery text[] default '{}'
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- 2. SERVICES TABLE (Ustalar xizmatlari)
create table public.services (
    id uuid default uuid_generate_v4() primary key,
    usta_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    price numeric not null check (price >= 0),
    description text,
    duration text, -- masalan: "1-2 soat"
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for services
alter table public.services enable row level security;

-- 3. REVIEWS TABLE (Mijozlar sharhlari)
create table public.reviews (
    id uuid default uuid_generate_v4() primary key,
    usta_id uuid references public.profiles(id) on delete cascade not null,
    client_id uuid references public.profiles(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Har bir mijoz bir ustaga faqat bitta sharh qoldirishi mumkin (ixtiyoriy, lekin yaxshi amaliyot)
    unique(usta_id, client_id)
);

-- Enable RLS for reviews
alter table public.reviews enable row level security;

-- 4. BOOKINGS TABLE (Usta buyurtmalari)
create table public.bookings (
    id uuid default uuid_generate_v4() primary key,
    client_id uuid references public.profiles(id) on delete cascade not null,
    usta_id uuid references public.profiles(id) on delete cascade not null,
    service_type text not null,
    date date not null,
    time text not null,
    address text not null,
    notes text,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
    total_price numeric not null check (total_price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for bookings
alter table public.bookings enable row level security;

-- 5. EQUIPMENTS TABLE (Ijaraga beriladigan texnikalar)
create table public.equipments (
    id uuid default uuid_generate_v4() primary key,
    owner_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    category text not null,
    description text not null,
    specs jsonb default '{}'::jsonb not null,
    daily_price numeric not null check (daily_price >= 0),
    weekly_price numeric check (weekly_price >= 0),
    city text not null,
    district text,
    images text[] default '{}' not null,
    available boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for equipments
alter table public.equipments enable row level security;

-- 6. EQUIPMENT_RENTALS TABLE (Texnika ijarasi buyurtmalari)
create table public.equipment_rentals (
    id uuid default uuid_generate_v4() primary key,
    equipment_id uuid references public.equipments(id) on delete cascade not null,
    renter_id uuid references public.profiles(id) on delete cascade not null,
    start_date date not null,
    end_date date not null,
    total_price numeric not null check (total_price >= 0),
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for equipment_rentals
alter table public.equipment_rentals enable row level security;

-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, email, role, is_verified)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        'client',
        false
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Trigger to update Usta's rating and review count when a review is added/updated/deleted
create or replace function public.calculate_usta_rating()
returns trigger as $$
declare
    target_usta_id uuid;
    avg_rating numeric(3,2);
    cnt integer;
begin
    if (TG_OP = 'DELETE') then
        target_usta_id := old.usta_id;
    else
        target_usta_id := new.usta_id;
    end if;

    select coalesce(avg(rating), 0.00), count(*)
    into avg_rating, cnt
    from public.reviews
    where usta_id = target_usta_id;

    update public.profiles
    set rating = avg_rating,
        review_count = cnt
    where id = target_usta_id;

    return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_review_change
    after insert or update or delete on public.reviews
    for each row execute procedure public.calculate_usta_rating();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles policies
create policy "Public profiles are viewable by everyone" 
    on public.profiles for select using (true);

create policy "Users can update their own profile" 
    on public.profiles for update using (auth.uid() = id);

-- Services policies
create policy "Services are viewable by everyone" 
    on public.services for select using (true);

create policy "Ustas can manage their own services" 
    on public.services for all using (auth.uid() = usta_id);

-- Reviews policies
create policy "Reviews are viewable by everyone" 
    on public.reviews for select using (true);

create policy "Authenticated users can create reviews" 
    on public.reviews for insert with check (auth.role() = 'authenticated' and auth.uid() = client_id);

create policy "Users can update their own reviews" 
    on public.reviews for update using (auth.uid() = client_id);

create policy "Users can delete their own reviews" 
    on public.reviews for delete using (auth.uid() = client_id);

-- Bookings policies
create policy "Users can view their own bookings (as client or usta)" 
    on public.bookings for select using (auth.uid() = client_id or auth.uid() = usta_id);

create policy "Clients can create bookings" 
    on public.bookings for insert with check (auth.role() = 'authenticated' and auth.uid() = client_id);

create policy "Involved parties can update bookings" 
    on public.bookings for update using (auth.uid() = client_id or auth.uid() = usta_id);

-- Equipments policies
create policy "Equipments are viewable by everyone" 
    on public.equipments for select using (true);

create policy "Owners can manage their equipment" 
    on public.equipments for all using (auth.uid() = owner_id);

-- Equipment rentals policies
create policy "Involved parties can view rentals" 
    on public.equipment_rentals for select 
    using (
        auth.uid() = renter_id or 
        auth.uid() in (select owner_id from public.equipments where id = equipment_id)
    );

create policy "Authenticated users can rent equipment" 
    on public.equipment_rentals for insert with check (auth.role() = 'authenticated' and auth.uid() = renter_id);

create policy "Involved parties can update rentals" 
    on public.equipment_rentals for update 
    using (
        auth.uid() = renter_id or 
        auth.uid() in (select owner_id from public.equipments where id = equipment_id)
    );

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_category on public.profiles(category);
create index if not exists idx_services_usta_id on public.services(usta_id);
create index if not exists idx_reviews_usta_id on public.reviews(usta_id);
create index if not exists idx_bookings_client_id on public.bookings(client_id);
create index if not exists idx_bookings_usta_id on public.bookings(usta_id);
create index if not exists idx_equipments_owner_id on public.equipments(owner_id);
create index if not exists idx_equipment_rentals_equipment_id on public.equipment_rentals(equipment_id);
create index if not exists idx_equipment_rentals_renter_id on public.equipment_rentals(renter_id);
