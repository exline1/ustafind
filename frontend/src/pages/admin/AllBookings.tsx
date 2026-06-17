import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { mockBookings, formatPrice } from '../../services/mockData';
import type { Booking } from '../../types';

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]');
    setBookings([...mockBookings, ...stored]);
  }, []);

  const filtered = bookings.filter(b => !statusFilter || b.status === statusFilter);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Kutilmoqda</Badge>;
      case 'confirmed': return <Badge variant="info">Tasdiqlangan</Badge>;
      case 'completed': return <Badge variant="success">Bajarilgan</Badge>;
      case 'cancelled': return <Badge variant="danger">Bekor qilingan</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Barcha bandlovlar</h1>

      <div className="mb-6">
        <Select
          options={[
            { value: 'pending', label: 'Kutilmoqda' },
            { value: 'confirmed', label: 'Tasdiqlangan' },
            { value: 'completed', label: 'Bajarilgan' },
            { value: 'cancelled', label: 'Bekor qilingan' },
          ]}
          placeholder="Barcha statuslar"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="!py-2.5 !w-48"
        />
      </div>

      {filtered.length > 0 ? (
        <Card hover={false} padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Xizmat</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Mijoz</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Usta</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sana</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Narx</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.serviceType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.ustaName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.date} {b.time}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(b.totalPrice)}</td>
                    <td className="px-6 py-4">{statusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bandlovlar topilmadi</h3>
        </Card>
      )}

      <p className="text-sm text-gray-400 mt-4">Jami: {filtered.length} ta bandlov</p>
    </div>
  );
}
