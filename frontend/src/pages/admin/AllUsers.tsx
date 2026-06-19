import { useEffect, useState } from 'react';
import { MagnifyingGlass, Users } from '@phosphor-icons/react';
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
    getAllUsers()
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="info">Admin</Badge>;
      case 'usta_approved':
        return <Badge variant="success">Usta</Badge>;
      case 'usta_pending':
        return <Badge variant="warning">Kutilmoqda</Badge>;
      default:
        return <Badge variant="neutral">Mijoz</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6 tracking-tight">Barcha foydalanuvchilar</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-muted" weight="bold" />
          <input
            type="text"
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg border-[1.5px] border-gray-light bg-white text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-light/40 transition-all duration-300"
            aria-label="Foydalanuvchi qidirish"
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
          className="!py-2.5 !w-44 !min-h-[44px]"
        />
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="hidden md:block">
            <Card hover={false} padding="none">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Foydalanuvchi</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Rol</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Ro&apos;yxatdan o&apos;tgan</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className="border-b border-gray-light hover:bg-brand-light/5 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="font-medium text-brand-dark text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{user.email}</td>
                      <td className="px-6 py-4">{roleBadge(user.role)}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{user.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((user) => (
              <Card key={user.id} hover={false}>
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-dark truncate">{user.name}</p>
                    <p className="text-sm text-gray-muted truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {roleBadge(user.role)}
                      <span className="text-xs text-gray-muted">{user.registeredAt}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Users className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">Foydalanuvchilar topilmadi</h3>
          <p className="text-gray-muted">Qidiruv yoki filtrlarni o&apos;zgartiring</p>
        </Card>
      )}

      <p className="text-sm text-gray-muted mt-4">Jami: {filtered.length} ta foydalanuvchi</p>
    </div>
  );
}
