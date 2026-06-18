import { useEffect, useState } from 'react';
import { Trash, Wrench } from '@phosphor-icons/react';
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
    const stored = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    const updated = stored.filter((e) => e.id !== eqId);
    localStorage.setItem('ustafind_equipment', JSON.stringify(updated));
    setEquipment((prev) => prev.filter((e) => e.id !== eqId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6 tracking-tight">Texnika e&apos;lonlari boshqaruvi</h1>

      {equipment.length > 0 ? (
        <>
          <div className="hidden lg:block">
            <Card hover={false} padding="none">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light">
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Nomi</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Kategoriya</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Egasi</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Shahar</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Kunlik narx</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-muted uppercase">Holati</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-muted uppercase">Harakatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((eq) => (
                    <tr key={eq.id} className="border-b border-gray-light hover:bg-brand-light/5 transition-colors duration-300">
                      <td className="px-6 py-4 text-sm font-medium text-brand-dark">{eq.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{eq.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{eq.ownerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-muted">{eq.city}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-dark">{formatPrice(eq.dailyPrice)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={eq.available ? 'success' : 'danger'}>{eq.available ? 'Mavjud' : 'Band'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {eq.id.startsWith('eq-user-') && (
                          <Button size="sm" variant="danger" onClick={() => handleDelete(eq.id)} icon={<Trash className="w-4 h-4" weight="bold" />} aria-label="O'chirish">
                            O&apos;chirish
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div className="lg:hidden space-y-3">
            {equipment.map((eq) => (
              <Card key={eq.id} hover={false}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-brand-dark">{eq.name}</h4>
                    <p className="text-sm text-gray-muted">{eq.category} • {eq.city}</p>
                    <p className="text-sm text-gray-muted">{eq.ownerName}</p>
                    <p className="text-sm font-bold text-brand-dark mt-1">{formatPrice(eq.dailyPrice)} / kun</p>
                    <Badge variant={eq.available ? 'success' : 'danger'} className="mt-2">
                      {eq.available ? 'Mavjud' : 'Band'}
                    </Badge>
                  </div>
                  {eq.id.startsWith('eq-user-') && (
                    <Button size="sm" variant="danger" onClick={() => handleDelete(eq.id)} icon={<Trash className="w-4 h-4" weight="bold" />}>
                      O&apos;chirish
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card hover={false} className="text-center !py-16">
          <Wrench className="w-16 h-16 text-gray-light mx-auto mb-4" weight="thin" />
          <h3 className="text-xl font-bold text-brand-dark mb-2">Texnika e&apos;lonlari yo&apos;q</h3>
        </Card>
      )}

      <p className="text-sm text-gray-muted mt-4">Jami: {equipment.length} ta e&apos;lon</p>
    </div>
  );
}
