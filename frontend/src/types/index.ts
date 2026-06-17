// ==========================================
// UstaFind.uz — Barcha TypeScript tiplari
// ==========================================

export type UserRole = 'client' | 'usta_pending' | 'usta_approved' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  registeredAt: string;
  bio?: string;
  city?: string;
  district?: string;
  experience?: number; // yillar
  skills?: string[];
  priceRange?: string;
  portfolio?: string[];
  isVerified?: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: string; // masalan: "2-3 soat"
}

export interface Review {
  id: string;
  ustaId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Usta extends User {
  role: 'usta_approved' | 'usta_pending';
  category: string;
  services: Service[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  completedJobs: number;
  gallery: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  ustaId: string;
  ustaName: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerRating?: number;
  name: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  dailyPrice: number;
  weeklyPrice?: number;
  city: string;
  district?: string;
  images: string[];
  available: boolean;
  createdAt: string;
}

export interface EquipmentRental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon nomi
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  role: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}
