import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { getAllUsers } from '../../services/authService';
import type { User } from '../../types';

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="info">Admin</Badge>;
      case 'usta_approved': return <Badge variant="success">Usta</Badge>;
      case 'usta_pending': return <Badge variant="warning">Kutilmoqda</Badge>;
      default: return <Badge variant="neutral">Mijoz</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Barcha foydalanuvchilar</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <Select
          options={[
            { value: 'client', label: 'Mijoz' },
            { value: 'usta_pending', label: 'Kutilmoqda' },
            { value: 'usta_approved', label: 'Usta' },
            { value: 'admin', label: 'Admin' },
          ]}
          placeholder="Barcha rollar"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="!py-2.5 !w-44"
        />
      </div>

      {filtered.length > 0 ? (
        <Card hover={false} padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Foydalanuvchi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Rol</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Ro'yxatdan o'tgan</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.registeredAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Foydalanuvchilar topilmadi</h3>
          <p className="text-gray-500">Qidiruv yoki filtrlarni o'zgartiring</p>
        </Card>
      )}

      <p className="text-sm text-gray-400 mt-4">Jami: {filtered.length} ta foydalanuvchi</p>
    </div>
  );
}
