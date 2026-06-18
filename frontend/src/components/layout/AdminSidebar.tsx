import { Link, useLocation } from 'react-router-dom';
import {
  SquaresFour,
  UserCheck,
  Users,
  CalendarBlank,
  Wrench,
} from '@phosphor-icons/react';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: SquaresFour },
  { to: '/admin/arizalar', label: 'Ustalar arizalari', icon: UserCheck },
  { to: '/admin/foydalanuvchilar', label: 'Barcha foydalanuvchilar', icon: Users },
  { to: '/admin/bandlovlar', label: 'Barcha bandlovlar', icon: CalendarBlank },
  { to: '/admin/texnikalar', label: "Texnika e'lonlari", icon: Wrench },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-brand-dark min-h-[calc(100vh-4.5rem)] p-4 hidden md:block shrink-0">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider px-3">Admin Panel</h2>
        </div>
        <nav className="space-y-1" aria-label="Admin navigatsiya">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out min-h-[44px] ${
                  active
                    ? 'bg-brand-light/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-brand-light before:rounded-full'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" weight={active ? 'fill' : 'regular'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-dark border-t border-white/10 px-2 py-2 flex justify-around"
        aria-label="Admin mobil navigatsiya"
      >
        {menuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 p-2 min-w-[44px] min-h-[44px] rounded-xl transition-colors duration-300 ${
                active ? 'text-brand-light' : 'text-white/60 hover:text-white'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" weight={active ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
