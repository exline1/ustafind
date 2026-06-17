import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Users, Calendar, Wrench } from 'lucide-react';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/arizalar', label: 'Ustalar arizalari', icon: UserCheck },
  { to: '/admin/foydalanuvchilar', label: 'Barcha foydalanuvchilar', icon: Users },
  { to: '/admin/bandlovlar', label: 'Barcha bandlovlar', icon: Calendar },
  { to: '/admin/texnikalar', label: 'Texnika e\'lonlari', icon: Wrench },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4 hidden lg:block">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3">Admin Panel</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
