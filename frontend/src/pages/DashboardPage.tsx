import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Truck, Wrench, AlertTriangle, Plus, Trash2 } from 'lucide-react';
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

  // New equipment form
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('');
  const [eqDescription, setEqDescription] = useState('');
  const [eqDailyPrice, setEqDailyPrice] = useState('');
  const [eqCity, setEqCity] = useState('');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    // Load bookings
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]') as Booking[];
    const mockUserBookings = mockBookings.filter(b => b.clientId === user.id || b.ustaId === user.id);
    const localBookings = stored.filter(b => b.clientId === user.id || b.ustaId === user.id);
    setBookings([...localBookings, ...mockUserBookings]);

    // Load equipment
    const storedEq = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    setMyEquipment(storedEq.filter(e => e.ownerId === user.id));

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
    setMyEquipment(prev => [...prev, newEq]);
    setShowAddEquipment(false);
    setEqName(''); setEqCategory(''); setEqDescription(''); setEqDailyPrice(''); setEqCity('');
  };

  const handleDeleteEquipment = (eqId: string) => {
    const all = JSON.parse(localStorage.getItem('ustafind_equipment') || '[]') as Equipment[];
    const filtered = all.filter(e => e.id !== eqId);
    localStorage.setItem('ustafind_equipment', JSON.stringify(filtered));
    setMyEquipment(prev => prev.filter(e => e.id !== eqId));
  };

  const handleBookingAction = (bookingId: string, action: 'confirmed' | 'cancelled') => {
    const stored = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]') as Booking[];
    const updated = stored.map(b => b.id === bookingId ? { ...b, status: action } : b);
    localStorage.setItem('ustafind_bookings', JSON.stringify(updated));
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: action } : b));
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Kutilmoqda</Badge>;
      case 'confirmed': return <Badge variant="info">Tasdiqlangan</Badge>;
      case 'completed': return <Badge variant="success">Bajarilgan</Badge>;
      case 'cancelled': return <Badge variant="danger">Bekor qilingan</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'bookings', label: 'Buyurtmalarim', icon: <Calendar className="w-4 h-4" /> },
    { id: 'equipment', label: 'Texnika arendasi', icon: <Truck className="w-4 h-4" /> },
  ];

  if (user.role === 'usta_approved') {
    tabs.push({ id: 'services', label: 'Xizmatlarim', icon: <Wrench className="w-4 h-4" /> });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pending Banner */}
      {user.role === 'usta_pending' && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              Sizning usta sifatidagi arizangiz ko'rib chiqilmoqda. Admin tasdiqlashini kuting.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">Shaxsiy kabinet</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-64 shrink-0">
            <nav className="space-y-1 bg-white rounded-2xl p-2 shadow-md border border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-dark text-white shadow'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Profil ma'lumotlari</h2>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                    {editingProfile ? 'Bekor qilish' : 'Tahrirlash'}
                  </Button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name={user.name} size="xl" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                    <Badge variant={user.role === 'admin' ? 'info' : user.role === 'usta_approved' ? 'success' : user.role === 'usta_pending' ? 'warning' : 'neutral'} className="mt-1">
                      {user.role === 'admin' ? 'Admin' : user.role === 'usta_approved' ? 'Usta' : user.role === 'usta_pending' ? 'Usta (kutilmoqda)' : 'Mijoz'}
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
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Telefon</span>
                      <span className="text-sm font-medium text-gray-900">{user.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Shahar</span>
                      <span className="text-sm font-medium text-gray-900">{user.city || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Ro'yxatdan o'tgan</span>
                      <span className="text-sm font-medium text-gray-900">{user.registeredAt}</span>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Mening buyurtmalarim</h2>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} hover={false}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-gray-900">{booking.serviceType}</h4>
                          <p className="text-sm text-gray-500">
                            {booking.clientId === user.id ? `Usta: ${booking.ustaName}` : `Mijoz: ${booking.clientName}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">📅 {booking.date} soat {booking.time} • 📍 {booking.address}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-brand-dark">{formatPrice(booking.totalPrice)}</span>
                          {statusBadge(booking.status)}
                        </div>
                      </div>
                      {user.role === 'usta_approved' && booking.ustaId === user.id && booking.status === 'pending' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                          <Button size="sm" onClick={() => handleBookingAction(booking.id, 'confirmed')}>Tasdiqlash</Button>
                          <Button size="sm" variant="danger" onClick={() => handleBookingAction(booking.id, 'cancelled')}>Bekor qilish</Button>
                        </div>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card hover={false} className="text-center !py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Hali buyurtmalar yo'q</p>
                  </Card>
                )}
              </div>
            )}

            {/* Equipment Tab */}
            {activeTab === 'equipment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Texnikamni arendaga berish</h2>
                  <Button size="sm" onClick={() => setShowAddEquipment(true)}>
                    <Plus className="w-4 h-4" /> Yangi qo'shish
                  </Button>
                </div>
                {myEquipment.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myEquipment.map((eq) => (
                      <Card key={eq.id} hover={false}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{eq.name}</h4>
                            <p className="text-sm text-gray-500">{eq.category} • {eq.city}</p>
                            <p className="text-lg font-bold text-brand-dark mt-2">{formatPrice(eq.dailyPrice)} <span className="text-xs text-gray-400 font-normal">/ kuniga</span></p>
                          </div>
                          <button onClick={() => handleDeleteEquipment(eq.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card hover={false} className="text-center !py-12">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Hali texnika qo'shilmagan</p>
                    <Button variant="outline" onClick={() => setShowAddEquipment(true)}>
                      <Plus className="w-4 h-4" /> Birinchi texnikangizni qo'shing
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Services Tab (only for approved usta) */}
            {activeTab === 'services' && user.role === 'usta_approved' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Xizmatlarim va bandlovlar</h2>
                <Card hover={false}>
                  <p className="text-gray-500">
                    Bu bo'limda siz ko'rsatadigan xizmat turlari, narxlaringiz va kelgan buyurtmalar ro'yxatini boshqarishingiz mumkin.
                  </p>
                  <div className="mt-4 space-y-3">
                    {bookings.filter(b => b.ustaId === user.id).length > 0 ? (
                      bookings.filter(b => b.ustaId === user.id).map(b => (
                        <div key={b.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{b.serviceType}</h4>
                            <p className="text-sm text-gray-500">Mijoz: {b.clientName} • {b.date}</p>
                          </div>
                          {statusBadge(b.status)}
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-gray-400">Hali buyurtmalar kelmagan</p>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Equipment Modal */}
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
            Qo'shish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
