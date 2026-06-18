import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CalendarBlank, Clock, MapPin, FileText, CheckCircle } from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Avatar from '../components/ui/Avatar';
import { getUstaById, formatPrice } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const steps = ['Xizmat', 'Sana va vaqt', 'Manzil'];

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const usta = getUstaById(id || '');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!usta || !user) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">
            {!user ? 'Avval tizimga kiring' : 'Usta topilmadi'}
          </h2>
          <Link to={!user ? '/auth' : '/ustalar'}>
            <Button>Davom etish</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedServiceObj = usta.services.find((s) => s.id === selectedService);
  const activeStep = !selectedService ? 0 : !selectedDate || !selectedTime ? 1 : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !address) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const booking: Booking = {
      id: 'b-' + Date.now(),
      clientId: user.id,
      clientName: user.name,
      ustaId: usta.id,
      ustaName: usta.name,
      serviceType: selectedServiceObj?.name || '',
      date: selectedDate,
      time: selectedTime,
      address,
      notes,
      status: 'pending',
      totalPrice: selectedServiceObj?.price || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const bookings = JSON.parse(localStorage.getItem('ustafind_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('ustafind_bookings', JSON.stringify(bookings));
    setLoading(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
        <Card hover={false} className="max-w-md w-full text-center !p-10">
          <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand" weight="fill" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-3 tracking-tight">Buyurtma tasdiqlandi!</h2>
          <p className="text-gray-muted mb-2 leading-relaxed">
            Siz <strong>{usta.name}</strong> dan &ldquo;{selectedServiceObj?.name}&rdquo; xizmatini band qildingiz.
          </p>
          <p className="text-sm text-gray-muted mb-8">
            {selectedDate} soat {selectedTime}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Shaxsiy kabinetga o&apos;tish
            </Button>
            <Button onClick={() => navigate('/ustalar')} variant="outline" className="w-full">
              Boshqa ustalarni ko&apos;rish
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="bg-gradient-brand-hero py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/ustalar/${usta.id}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" weight="bold" /> Profilga qaytish
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Band qilish</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                  i <= activeStep ? 'bg-brand text-white' : 'bg-gray-light text-gray-muted'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= activeStep ? 'text-brand-dark font-medium' : 'text-gray-muted'}`}>
                {step}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < activeStep ? 'bg-brand' : 'bg-gray-light'}`} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card hover={false}>
                <h3 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" weight="fill" />
                  Xizmat turini tanlang
                </h3>
                <div className="space-y-2">
                  {usta.services.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 min-h-[44px] ${
                        selectedService === service.id
                          ? 'border-brand bg-brand-light/10'
                          : 'border-gray-light hover:border-brand/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-4 h-4 accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-brand-dark">{service.name}</p>
                          {service.duration && <p className="text-xs text-gray-muted">{service.duration}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-brand-dark">{formatPrice(service.price)}</span>
                    </label>
                  ))}
                </div>
              </Card>

              <Card hover={false}>
                <h3 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <CalendarBlank className="w-5 h-5 text-brand" weight="fill" />
                  Sana va vaqt tanlang
                </h3>
                <div className="mb-4">
                  <Input label="Sana" type="date" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    <Clock className="w-4 h-4 inline mr-1" weight="fill" />
                    Vaqt
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedTime === time
                            ? 'bg-brand text-white shadow-sm'
                            : 'bg-white text-brand-dark border border-gray-light hover:border-brand'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card hover={false}>
                <h3 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand" weight="fill" />
                  Manzil va izoh
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Manzil"
                    placeholder="Shahar, tuman, ko'cha, uy raqami"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Textarea
                    label="Qo'shimcha izoh (ixtiyoriy)"
                    placeholder="Usta uchun qo'shimcha ma'lumot..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!selectedService || !selectedDate || !selectedTime || !address}
              >
                Buyurtmani tasdiqlash
              </Button>
            </form>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <Card hover={false} className="bg-gray-light">
                <h3 className="font-semibold text-brand-dark mb-4">Buyurtma xulosasi</h3>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-light">
                  <Avatar name={usta.name} size="md" />
                  <div>
                    <h4 className="font-bold text-brand-dark">{usta.name}</h4>
                    <p className="text-sm text-gray-muted">{usta.category}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedServiceObj && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-muted">Xizmat</span>
                      <span className="font-medium text-brand-dark">{selectedServiceObj.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-muted">Sana</span>
                      <span className="font-medium text-brand-dark">{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-muted">Vaqt</span>
                      <span className="font-medium text-brand-dark">{selectedTime}</span>
                    </div>
                  )}
                  {selectedServiceObj && (
                    <div className="flex justify-between text-sm pt-3 border-t border-white">
                      <span className="font-semibold text-brand-dark">Jami</span>
                      <span className="font-bold text-brand-dark text-lg">{formatPrice(selectedServiceObj.price)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
