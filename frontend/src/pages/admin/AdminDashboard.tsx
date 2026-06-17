import { useEffect, useState } from 'react';
import { Users, UserCheck, Calendar, Wrench, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAllUsers } from '../../services/authService';
import { mockBookings, mockEquipment } from '../../services/mockData';
import type { User, Booking } from '../../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setUsers(getAllUsers());
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]');
    setBookings([...mockBookings, ...stored]);
  }, []);

  const pendingCount = users.filter(u => u.role === 'usta_pending').length;
  const approvedUstaCount = users.filter(u => u.role === 'usta_approved').length;
  const allEquipment = [...mockEquipment, ...JSON.parse(localStorage.getItem('ustafind_equipment') || '[]')];

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Jami foydalanuvchilar', value: users.length, color: 'bg-blue-100 text-blue-600' },
    { icon: <UserCheck className="w-6 h-6" />, label: 'Kutilayotgan arizalar', value: pendingCount, color: 'bg-yellow-100 text-yellow-600' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Faol ustalar', value: approvedUstaCount, color: 'bg-green-100 text-green-600' },
    { icon: <Calendar className="w-6 h-6" />, label: 'Jami bandlovlar', value: bookings.length, color: 'bg-purple-100 text-purple-600' },
    { icon: <Wrench className="w-6 h-6" />, label: "Texnika e'lonlari", value: allEquipment.length, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} hover={false} className="!p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <h3 className="font-bold text-gray-900 mb-4">So'nggi foydalanuvchilar</h3>
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.slice(-5).reverse().map(u => (
                <div key={u.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'usta_approved' ? 'bg-green-100 text-green-700' :
                    u.role === 'usta_pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : u.role === 'usta_approved' ? 'Usta' : u.role === 'usta_pending' ? 'Kutilmoqda' : 'Mijoz'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Hali foydalanuvchilar yo'q</p>
          )}
        </Card>

        <Card hover={false}>
          <h3 className="font-bold text-gray-900 mb-4">So'nggi bandlovlar</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(-5).reverse().map(b => (
                <div key={b.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.serviceType}</p>
                    <p className="text-xs text-gray-500">{b.clientName} → {b.ustaName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === 'completed' ? 'bg-green-100 text-green-700' :
                    b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {b.status === 'completed' ? 'Bajarilgan' : b.status === 'confirmed' ? 'Tasdiqlangan' : b.status === 'pending' ? 'Kutilmoqda' : 'Bekor'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Hali bandlovlar yo'q</p>
          )}
        </Card>
      </div>
    </div>
  );
}
