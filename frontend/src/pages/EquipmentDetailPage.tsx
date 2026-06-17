import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, CheckCircle, Calendar, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getEquipmentById, formatPrice } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const equipment = getEquipmentById(id || '');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Texnika topilmadi</h2>
          <Link to="/texnika"><Button>Ro'yxatga qaytish</Button></Link>
        </div>
      </div>
    );
  }

  const handleRental = () => {
    if (!user) { navigate('/auth'); return; }
    setShowRentalModal(true);
  };

  const handleConfirmRental = () => {
    if (!startDate || !endDate) return;
    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const rental = {
      id: 'er-' + Date.now(),
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      renterId: user!.id,
      renterName: user!.name,
      ownerId: equipment.ownerId,
      startDate,
      endDate,
      totalPrice: days * equipment.dailyPrice,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const rentals = JSON.parse(localStorage.getItem('ustafind_rentals') || '[]');
    rentals.push(rental);
    localStorage.setItem('ustafind_rentals', JSON.stringify(rentals));
    setShowRentalModal(false);
    setShowSuccess(true);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-dark to-brand py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/texnika" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Texnika ro'yxati
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card hover={false}>
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
                <Truck className="w-24 h-24 text-gray-300" />
              </div>
            </Card>

            {/* Info */}
            <Card hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="info">{equipment.category}</Badge>
                {equipment.available && <Badge variant="success">Mavjud</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{equipment.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{equipment.description}</p>

              <h3 className="font-bold text-gray-900 mb-3">Texnik xususiyatlari</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(equipment.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Location */}
            <Card hover={false}>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand" /> Joylashuv
              </h3>
              <p className="text-gray-600">{equipment.city}{equipment.district && `, ${equipment.district}`}</p>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-4">
              <Card hover={false}>
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-brand-dark">{formatPrice(equipment.dailyPrice)}</span>
                  </div>
                  <p className="text-sm text-gray-400">kuniga</p>
                  {equipment.weeklyPrice && (
                    <p className="text-sm text-gray-500 mt-1">Haftalik: <strong>{formatPrice(equipment.weeklyPrice)}</strong></p>
                  )}
                </div>
                <Button onClick={handleRental} className="w-full" size="lg" disabled={!equipment.available}>
                  <Calendar className="w-5 h-5" />
                  Arendaga olish
                </Button>
              </Card>

              <Card hover={false}>
                <h3 className="font-bold text-gray-900 mb-3">Egasi haqida</h3>
                <div className="flex items-center gap-3">
                  <Avatar name={equipment.ownerName} size="md" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{equipment.ownerName}</h4>
                    {equipment.ownerRating && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {equipment.ownerRating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Modal */}
      <Modal isOpen={showRentalModal} onClose={() => setShowRentalModal(false)} title="Arendaga olish" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <strong>{equipment.name}</strong> ni arendaga olish uchun sana oralig'ini tanlang.
          </p>
          <Input label="Boshlanish sanasi" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Tugash sanasi" type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {startDate && endDate && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Kunlar soni</span>
                <span className="font-medium">{Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))} kun</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="font-semibold">Jami narx</span>
                <span className="font-bold text-brand-dark text-lg">
                  {formatPrice(Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) * equipment.dailyPrice)}
                </span>
              </div>
            </div>
          )}
          <Button onClick={handleConfirmRental} className="w-full" disabled={!startDate || !endDate}>
            Tasdiqlash
          </Button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/dashboard'); }} size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Arenda tasdiqlandi!</h3>
          <p className="text-gray-500 text-sm mb-6">Buyurtmangiz qabul qilindi. Texnika egasi siz bilan bog'lanadi.</p>
          <Button onClick={() => { setShowSuccess(false); navigate('/dashboard'); }} className="w-full">Kabinetga o'tish</Button>
        </div>
      </Modal>
    </div>
  );
}
