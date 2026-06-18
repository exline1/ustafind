import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarBlank, Star, CheckCircle } from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import UnsplashImage from '../components/ui/UnsplashImage';
import { getEquipmentById, formatPrice } from '../services/mockData';
import { getEquipmentImage } from '../services/unsplashService';
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
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Texnika topilmadi</h2>
          <Link to="/texnika">
            <Button>Ro&apos;yxatga qaytish</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleRental = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowRentalModal(true);
  };

  const handleConfirmRental = () => {
    if (!startDate || !endDate) return;
    const days = Math.max(
      1,
      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    );
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
  const rentalDays =
    startDate && endDate
      ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="bg-gradient-brand-hero py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/texnika"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" weight="bold" /> Texnika ro&apos;yxati
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card hover={false} className="!p-0 overflow-hidden">
              <UnsplashImage
                src={getEquipmentImage(equipment.id, equipment.name)}
                alt={equipment.name}
                className="rounded-2xl"
                aspectClass="h-64 md:h-96"
              />
            </Card>

            <Card hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="info">{equipment.category}</Badge>
                {equipment.available && <Badge variant="success">Mavjud</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 tracking-tight">{equipment.name}</h1>
              <p className="text-gray-muted leading-relaxed mb-6">{equipment.description}</p>

              <h3 className="font-semibold text-brand-dark mb-3">Texnik xususiyatlari</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(equipment.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-light rounded-xl">
                    <span className="text-sm text-gray-muted">{key}</span>
                    <span className="text-sm font-semibold text-brand-dark">{val}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card hover={false}>
              <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand" weight="fill" /> Joylashuv
              </h3>
              <p className="text-gray-muted">
                {equipment.city}
                {equipment.district && `, ${equipment.district}`}
              </p>
            </Card>
          </div>

          <div>
            <div className="sticky top-24 space-y-4">
              <Card hover={false} className="shadow-lg">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-brand-dark">{formatPrice(equipment.dailyPrice)}</span>
                  <p className="text-sm text-gray-muted">kuniga</p>
                  {equipment.weeklyPrice && (
                    <p className="text-sm text-gray-muted mt-1">
                      Haftalik: <strong className="text-brand-dark">{formatPrice(equipment.weeklyPrice)}</strong>
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleRental}
                  className="w-full"
                  size="lg"
                  disabled={!equipment.available}
                  icon={<CalendarBlank className="w-5 h-5" weight="fill" />}
                >
                  Arendaga olish
                </Button>
              </Card>

              <Card hover={false}>
                <h3 className="font-semibold text-brand-dark mb-3">Egasi haqida</h3>
                <div className="flex items-center gap-3">
                  <Avatar name={equipment.ownerName} size="md" />
                  <div>
                    <h4 className="font-semibold text-brand-dark">{equipment.ownerName}</h4>
                    {equipment.ownerRating && (
                      <div className="flex items-center gap-1 text-sm text-gray-muted">
                        <Star className="w-4 h-4 text-rating" weight="fill" />
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

      <Modal isOpen={showRentalModal} onClose={() => setShowRentalModal(false)} title="Arendaga olish" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-muted leading-relaxed">
            <strong className="text-brand-dark">{equipment.name}</strong> ni arendaga olish uchun sana oralig&apos;ini
            tanlang.
          </p>
          <Input label="Boshlanish sanasi" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Tugash sanasi" type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {rentalDays > 0 && (
            <div className="p-4 bg-gray-light rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-muted">Kunlar soni</span>
                <span className="font-medium text-brand-dark">{rentalDays} kun</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white">
                <span className="font-semibold text-brand-dark">Jami narx</span>
                <span className="font-bold text-brand-dark text-lg">{formatPrice(rentalDays * equipment.dailyPrice)}</span>
              </div>
            </div>
          )}
          <Button onClick={handleConfirmRental} className="w-full" disabled={!startDate || !endDate}>
            Tasdiqlash
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/dashboard'); }} size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-brand" weight="fill" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2">Arenda tasdiqlandi!</h3>
          <p className="text-gray-muted text-sm mb-6 leading-relaxed">
            Buyurtmangiz qabul qilindi. Texnika egasi siz bilan bog&apos;lanadi.
          </p>
          <Button onClick={() => { setShowSuccess(false); navigate('/dashboard'); }} className="w-full">
            Kabinetga o&apos;tish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
