import { useEffect, useState } from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
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

  const filtered = bookings.filter((b) => !statusFilter || b.status === statusFilter);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Kutilmoqda</Badge>;
      case 'confirmed':
        return <Badge variant="info">Tasdiqlangan</Badge>;
      case 'completed':
        return <Badge variant="success">Bajarilgan</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Bekor qilingan</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6 tracking-tight">Barcha bandlovlar</h1>

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
          className="!py-2.5 !w-48 !min-h-[44px]"
        />
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="hidden lg:block">
            <Card hover={false} padding="none">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Xizmat</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Mijoz</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Usta</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Sana</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Narx</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b border-gray-light hover:bg-brand-light/5 transition-colors duration-300">
                      <td className="px-6 py-4 text-sm font-medium text-brand-dark">{b.serviceType}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{b.clientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{b.ustaName}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">
                        {b.date} {b.time}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-dark">{formatPrice(b.totalPrice)}</td>
                      <td className="px-6 py-4">{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="lg:hidden space-y-3">
            {filtered.map((b) => (
              <Card key={b.id} hover={false}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-brand-dark">{b.serviceType}</h4>
                  {statusBadge(b.status)}
                </div>
                <p className="text-sm text-gray-muted">
                  {b.clientName} → {b.ustaName}
                </p>
                <p className="text-xs text-gray-muted mt-1">
                  {b.date} {b.time}
                </p>
                <p className="text-sm font-bold text-brand-dark mt-2">{formatPrice(b.totalPrice)}</p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <CalendarBlank className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">Bandlovlar topilmadi</h3>
        </Card>
      )}

      <p className="text-sm text-gray-muted mt-4">Jami: {filtered.length} ta bandlov</p>
    </div>
  );
}
