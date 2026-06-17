import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { getAllUsers } from '../../services/authService';
import { approveUsta, rejectUsta } from '../../services/authService';
import type { User } from '../../types';

export default function PendingRequests() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const users = getAllUsers();
    setPendingUsers(users.filter(u => u.role === 'usta_pending'));
  }, []);

  const handleApprove = async (userId: string) => {
    setLoading(userId);
    await approveUsta(userId);
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setLoading(null);
  };

  const handleReject = async (userId: string) => {
    setLoading(userId);
    await rejectUsta(userId);
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setLoading(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Ustalar arizalari</h1>

      {pendingUsers.length > 0 ? (
        <Card hover={false} padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Foydalanuvchi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ariza sanasi</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.registeredAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                          loading={loading === user.id}
                          className="!px-3"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Tasdiqlash
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(user.id)}
                          loading={loading === user.id}
                          className="!px-3"
                        >
                          <XCircle className="w-4 h-4" />
                          Rad etish
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Hozircha kutilayotgan arizalar yo'q</h3>
          <p className="text-gray-500">Yangi usta arizalari kelganda shu yerda ko'rinadi</p>
        </Card>
      )}
    </div>
  );
}
