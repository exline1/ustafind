import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { getAllUsers, approveUsta, rejectUsta } from '../../services/authService';
import type { User } from '../../types';

export default function PendingRequests() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const users = getAllUsers();
    setPendingUsers(users.filter((u) => u.role === 'usta_pending'));
  }, []);

  const handleApprove = async (userId: string) => {
    setLoading(userId);
    await approveUsta(userId);
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    setLoading(null);
  };

  const handleReject = async (userId: string) => {
    setLoading(userId);
    await rejectUsta(userId);
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    setLoading(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6 tracking-tight">Ustalar arizalari</h1>

      {pendingUsers.length > 0 ? (
        <>
          <div className="hidden md:block">
            <Card hover={false} padding="none">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Foydalanuvchi</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Ariza sanasi</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-muted uppercase">Harakatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-light hover:bg-brand-light/5 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="font-medium text-brand-dark text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{user.registeredAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => handleApprove(user.id)} loading={loading === user.id} icon={<CheckCircle className="w-4 h-4" weight="fill" />}>
                            Tasdiqlash
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(user.id)} loading={loading === user.id} icon={<XCircle className="w-4 h-4" weight="fill" />}>
                            Rad etish
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="md:hidden space-y-4">
            {pendingUsers.map((user) => (
              <Card key={user.id} hover={false}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={user.name} size="md" />
                  <div>
                    <p className="font-semibold text-brand-dark">{user.name}</p>
                    <p className="text-sm text-gray-muted">{user.email}</p>
                    <p className="text-xs text-gray-muted">{user.registeredAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleApprove(user.id)} loading={loading === user.id}>
                    Tasdiqlash
                  </Button>
                  <Button size="sm" variant="danger" className="flex-1" onClick={() => handleReject(user.id)} loading={loading === user.id}>
                    Rad etish
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Clock className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">Hozircha kutilayotgan arizalar yo&apos;q</h3>
          <p className="text-gray-muted">Yangi usta arizalari kelganda shu yerda ko&apos;rinadi</p>
        </Card>
      )}
    </div>
  );
}
