import { useEffect, useState } from 'react';
import { Users, UserCheck, CalendarBlank, Wrench, TrendUp } from '@phosphor-icons/react';
import Card from '../../components/ui/Card';
import { getAllUsers } from '../../services/authService';
import { mockBookings, mockEquipment } from '../../services/mockData';
import type { User, Booking } from '../../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => console.error('Error fetching admin users:', err));
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]');
    setBookings([...mockBookings, ...stored]);
  }, []);

  const pendingCount = users.filter((u) => u.role === 'usta_pending').length;
  const approvedUstaCount = users.filter((u) => u.role === 'usta_approved').length;
  const allEquipment = [...mockEquipment, ...JSON.parse(localStorage.getItem('ustafind_equipment') || '[]')];

  const stats = [
    { icon: Users, label: 'Jami foydalanuvchilar', value: users.length },
    { icon: UserCheck, label: 'Kutilayotgan arizalar', value: pendingCount },
    { icon: TrendUp, label: 'Faol ustalar', value: approvedUstaCount },
    { icon: CalendarBlank, label: 'Jami bandlovlar', value: bookings.length },
    { icon: Wrench, label: "Texnika e'lonlari", value: allEquipment.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6 tracking-tight">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} hover={false} className="!p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-dark/10 flex items-center justify-center text-brand-dark">
                  <Icon className="w-6 h-6" weight="fill" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                  <p className="text-xs text-gray-muted">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <h3 className="font-semibold text-brand-dark mb-4">So&apos;nggi foydalanuvchilar</h3>
          {users.length > 0 ? (
            <div className="space-y-3">
              {users
                .slice(-5)
                .reverse()
                .map((u) => (
                  <div key={u.id} className="flex items-center justify-between py-2 hover:bg-brand-light/5 rounded-lg px-2 transition-colors duration-300">
                    <div>
                      <p className="font-medium text-brand-dark text-sm">{u.name}</p>
                      <p className="text-xs text-gray-muted">{u.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        u.role === 'admin'
                          ? 'bg-brand/10 text-brand-dark'
                          : u.role === 'usta_approved'
                            ? 'bg-brand-light/30 text-brand-dark'
                            : u.role === 'usta_pending'
                              ? 'bg-rating/15 text-rating'
                              : 'bg-gray-light text-gray-muted'
                      }`}
                    >
                      {u.role === 'admin'
                        ? 'Admin'
                        : u.role === 'usta_approved'
                          ? 'Usta'
                          : u.role === 'usta_pending'
                            ? 'Kutilmoqda'
                            : 'Mijoz'}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-muted text-sm">Hali foydalanuvchilar yo&apos;q</p>
          )}
        </Card>

        <Card hover={false}>
          <h3 className="font-semibold text-brand-dark mb-4">So&apos;nggi bandlovlar</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings
                .slice(-5)
                .reverse()
                .map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-2 hover:bg-brand-light/5 rounded-lg px-2 transition-colors duration-300">
                    <div>
                      <p className="font-medium text-brand-dark text-sm">{b.serviceType}</p>
                      <p className="text-xs text-gray-muted">
                        {b.clientName} → {b.ustaName}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        b.status === 'completed'
                          ? 'bg-brand-light/30 text-brand-dark'
                          : b.status === 'confirmed'
                            ? 'bg-brand/10 text-brand-dark'
                            : b.status === 'pending'
                              ? 'bg-rating/15 text-rating'
                              : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {b.status === 'completed'
                        ? 'Bajarilgan'
                        : b.status === 'confirmed'
                          ? 'Tasdiqlangan'
                          : b.status === 'pending'
                            ? 'Kutilmoqda'
                            : 'Bekor'}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-muted text-sm">Hali bandlovlar yo&apos;q</p>
          )}
        </Card>
      </div>
    </div>
  );
}
