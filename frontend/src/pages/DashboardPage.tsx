import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CalendarBlank,
  Truck,
  Wrench,
  Warning,
  Plus,
  Trash,
} from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { mockBookings, formatPrice } from '../services/mockData';
import type { Booking, Equipment } from '../types';

type DashboardTab = 'profile' | 'bookings' | 'equipment' | 'services';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myEquipment, setMyEquipment] = useState<Equipment[]>([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', city: '', bio: '' });

  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('');
  const [eqDescription, setEqDescription] = useState('');
  const [eqDailyPrice, setEqDailyPrice] = useState('');
  const [eqCity, setEqCity] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]') as Booking[];
    const mockUserBookings = mockBookings.filter((b) => b.clientId === user.id || b.ustaId === user.id);
    const localBookings = stored.filter((b) => b.clientId === user.id || b.ustaId === user.id);
    setBookings([...localBookings, ...mockUserBookings]);

    const storedEq = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    setMyEquipment(storedEq.filter((e) => e.ownerId === user.id));

    setProfileForm({
      name: user.name || '',
      phone: user.phone || '',
      city: user.city || '',
      bio: user.bio || '',
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleProfileSave = async () => {
    await updateUser(profileForm);
    setEditingProfile(false);
  };

  const handleAddEquipment = () => {
    if (!eqName || !eqCategory || !eqDailyPrice || !eqCity) return;
    const newEq: Equipment = {
      id: 'eq-user-' + Date.now(),
      ownerId: user.id,
      ownerName: user.name,
      name: eqName,
      category: eqCategory,
      description: eqDescription,
      specs: {},
      dailyPrice: parseInt(eqDailyPrice),
      city: eqCity,
      images: [],
      available: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const all = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]');
    all.push(newEq);
    localStorage.setItem('ustafind_equipment', JSON.stringify(all));
    setMyEquipment((prev) => [...prev, newEq]);
    setShowAddEquipment(false);
    setEqName('');
    setEqCategory('');
    setEqDescription('');
    setEqDailyPrice('');
    setEqCity('');
  };

  const handleDeleteEquipment = (eqId: string) => {
    const all = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    const filtered = all.filter((e) => e.id !== eqId);
    localStorage.setItem('ustafind_equipment', JSON.stringify(filtered));
    setMyEquipment((prev) => prev.filter((e) => e.id !== eqId));
  };

  const handleBookingAction = (bookingId: string, action: 'confirmed' | 'cancelled') => {
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]') as Booking[];
    const updated = stored.map((b) => (b.id === bookingId ? { ...b, status: action } : b));
    localStorage.setItem('ustafind_bookings', JSON.stringify(updated));
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: action } : b)));
  };

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

  const tabs: { id: DashboardTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'bookings', label: 'Buyurtmalarim', icon: CalendarBlank },
    { id: 'equipment', label: 'Texnika', icon: Truck },
  ];

  if (user.role === 'usta_approved') {
    tabs.push({ id: 'services', label: 'Xizmatlarim', icon: Wrench });
  }

  return (
    <div className="min-h-screen bg-gray-light">
      {user.role === 'usta_pending' && (
        <div className="bg-rating/10 border-b border-rating/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Warning className="w-5 h-5 text-rating shrink-0" weight="fill" />
            <p className="text-sm text-brand-dark">
              Sizning usta sifatidagi arizangiz ko&apos;rib chiqilmoqda. Admin tasdiqlashini kuting.
            </p>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 bg-brand-dark shrink-0 p-4">
          <div className="mb-6 px-3">
            <h2 className="text-lg font-bold text-white">Shaxsiy kabinet</h2>
            <p className="text-xs text-white/60 mt-1 truncate">{user.email}</p>
          </div>
          <nav className="space-y-1" aria-label="Dashboard navigatsiya">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px] ${
                    active
                      ? 'bg-brand-light/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-brand-light before:rounded-full'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" weight={active ? 'fill' : 'regular'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 min-w-0">
          {activeTab === 'profile' && (
            <Card hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-brand-dark">Profil ma&apos;lumotlari</h2>
                <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? 'Bekor qilish' : 'Tahrirlash'}
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={user.name} size="xl" />
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">{user.name}</h3>
                  <p className="text-gray-muted">{user.email}</p>
                  <Badge
                    variant={
                      user.role === 'admin'
                        ? 'info'
                        : user.role === 'usta_approved'
                          ? 'success'
                          : user.role === 'usta_pending'
                            ? 'warning'
                            : 'neutral'
                    }
                    className="mt-1"
                  >
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'usta_approved'
                        ? 'Usta'
                        : user.role === 'usta_pending'
                          ? 'Usta (kutilmoqda)'
                          : 'Mijoz'}
                  </Badge>
                </div>
              </div>
              {editingProfile ? (
                <div className="space-y-4">
                  <Input label="Ism" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  <Input label="Telefon" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  <Input label="Shahar" value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} />
                  <Textarea label="Haqingizda" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
                  <Button onClick={handleProfileSave}>Saqlash</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Telefon', value: user.phone || '—' },
                    { label: 'Shahar', value: user.city || '—' },
                    { label: "Ro'yxatdan o'tgan", value: user.registeredAt },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-2 border-b border-gray-light">
                      <span className="text-sm text-gray-muted">{row.label}</span>
                      <span className="text-sm font-medium text-brand-dark">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-brand-dark">Mening buyurtmalarim</h2>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <Card key={booking.id} hover={false}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-brand-dark">{booking.serviceType}</h4>
                        <p className="text-sm text-gray-muted">
                          {booking.clientId === user.id ? `Usta: ${booking.ustaName}` : `Mijoz: ${booking.clientName}`}
                        </p>
                        <p className="text-xs text-gray-muted mt-1">
                          {booking.date} soat {booking.time} • {booking.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-dark">{formatPrice(booking.totalPrice)}</span>
                        {statusBadge(booking.status)}
                      </div>
                    </div>
                    {user.role === 'usta_approved' && booking.ustaId === user.id && booking.status === 'pending' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-light">
                        <Button size="sm" onClick={() => handleBookingAction(booking.id, 'confirmed')}>
                          Tasdiqlash
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleBookingAction(booking.id, 'cancelled')}>
                          Bekor qilish
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card hover={false} className="text-center !py-12">
                  <CalendarBlank className="w-12 h-12 text-gray-light mx-auto mb-3" weight="thin" />
                  <p className="text-gray-muted">Hali buyurtmalar yo&apos;q</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-brand-dark">Texnikamni arendaga berish</h2>
                <Button size="sm" onClick={() => setShowAddEquipment(true)} icon={<Plus className="w-4 h-4" weight="bold" />}>
                  Yangi qo&apos;shish
                </Button>
              </div>
              {myEquipment.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myEquipment.map((eq) => (
                    <Card key={eq.id} hover={false}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-brand-dark">{eq.name}</h4>
                          <p className="text-sm text-gray-muted">
                            {eq.category} • {eq.city}
                          </p>
                          <p className="text-lg font-bold text-brand-dark mt-2">
                            {formatPrice(eq.dailyPrice)}{' '}
                            <span className="text-xs text-gray-muted font-normal">/ kuniga</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEquipment(eq.id)}
                          className="p-2 min-w-[44px] min-h-[44px] text-danger hover:bg-danger/10 rounded-lg transition-colors duration-300"
                          aria-label="O'chirish"
                        >
                          <Trash className="w-4 h-4" weight="bold" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card hover={false} className="text-center !py-12">
                  <Truck className="w-12 h-12 text-gray-light mx-auto mb-3" weight="thin" />
                  <p className="text-gray-muted mb-4">Hali texnika qo&apos;shilmagan</p>
                  <Button variant="outline" onClick={() => setShowAddEquipment(true)} icon={<Plus className="w-4 h-4" weight="bold" />}>
                    Birinchi texnikangizni qo&apos;shing
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'services' && user.role === 'usta_approved' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-brand-dark">Xizmatlarim va bandlovlar</h2>
              <Card hover={false}>
                <p className="text-gray-muted leading-relaxed">
                  Bu bo&apos;limda siz ko&apos;rsatadigan xizmat turlari, narxlaringiz va kelgan buyurtmalar ro&apos;yxatini
                  boshqarishingiz mumkin.
                </p>
                <div className="mt-4 space-y-3">
                  {bookings.filter((b) => b.ustaId === user.id).length > 0 ? (
                    bookings
                      .filter((b) => b.ustaId === user.id)
                      .map((b) => (
                        <div key={b.id} className="p-4 bg-gray-light rounded-xl flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-brand-dark">{b.serviceType}</h4>
                            <p className="text-sm text-gray-muted">
                              Mijoz: {b.clientName} • {b.date}
                            </p>
                          </div>
                          {statusBadge(b.status)}
                        </div>
                      ))
                  ) : (
                    <p className="text-center py-8 text-gray-muted">Hali buyurtmalar kelmagan</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-dark border-t border-white/10 px-2 py-2 flex justify-around"
        aria-label="Dashboard mobil navigatsiya"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 p-2 min-w-[44px] min-h-[44px] rounded-xl transition-colors duration-300 ${
                active ? 'text-brand-light' : 'text-white/60'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5" weight={active ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      <Modal isOpen={showAddEquipment} onClose={() => setShowAddEquipment(false)} title="Yangi texnika qo'shish" size="lg">
        <div className="space-y-4">
          <Input label="Texnika nomi" placeholder="Masalan: Mini ekskavator" value={eqName} onChange={(e) => setEqName(e.target.value)} />
          <Select
            label="Kategoriya"
            placeholder="Tanlang"
            value={eqCategory}
            onChange={(e) => setEqCategory(e.target.value)}
            options={[
              { value: 'Qazish texnikasi', label: 'Qazish texnikasi' },
              { value: 'Beton uskunalari', label: 'Beton uskunalari' },
              { value: "Ko'tarish texnikasi", label: "Ko'tarish texnikasi" },
              { value: 'Energetik uskunalar', label: 'Energetik uskunalar' },
              { value: 'Qurilish asboblari', label: 'Qurilish asboblari' },
              { value: 'Payvandlash uskunalari', label: 'Payvandlash uskunalari' },
              { value: 'Boshqa', label: 'Boshqa' },
            ]}
          />
          <Textarea label="Tavsif" placeholder="Texnika haqida qisqacha..." value={eqDescription} onChange={(e) => setEqDescription(e.target.value)} />
          <Input label="Kunlik narx (so'm)" type="number" placeholder="300000" value={eqDailyPrice} onChange={(e) => setEqDailyPrice(e.target.value)} />
          <Input label="Shahar" placeholder="Toshkent" value={eqCity} onChange={(e) => setEqCity(e.target.value)} />
          <Button onClick={handleAddEquipment} className="w-full" disabled={!eqName || !eqCategory || !eqDailyPrice || !eqCity}>
            Qo&apos;shish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
