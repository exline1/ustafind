import { useEffect, useState } from 'react';
import { Trash2, Wrench } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { mockEquipment, formatPrice } from '../../services/mockData';
import type { Equipment } from '../../types';

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]');
    setEquipment([...mockEquipment, ...stored]);
  }, []);

  const handleDelete = (eqId: string) => {
    // Only delete user-added equipment from localStorage
    const stored = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    const updated = stored.filter(e => e.id !== eqId);
    localStorage.setItem('ustafind_equipment', JSON.stringify(updated));
    setEquipment(prev => prev.filter(e => e.id !== eqId));
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Texnika e'lonlari boshqaruvi</h1>

      {equipment.length > 0 ? (
        <Card hover={false} padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nomi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kategoriya</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Egasi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Shahar</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kunlik narx</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Holati</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{eq.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{eq.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{eq.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{eq.city}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(eq.dailyPrice)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={eq.available ? 'success' : 'danger'}>
                        {eq.available ? 'Mavjud' : 'Band'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {eq.id.startsWith('eq-user-') && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(eq.id)}
                          className="!px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Texnika e'lonlari yo'q</h3>
        </Card>
      )}

      <p className="text-sm text-gray-400 mt-4">Jami: {equipment.length} ta e'lon</p>
    </div>
  );
}
