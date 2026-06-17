import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Avatar from '../components/ui/Avatar';
import { getUstaById, formatPrice } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {!user ? 'Avval tizimga kiring' : 'Usta topilmadi'}
          </h2>
          <Link to={!user ? '/auth' : '/ustalar'}><Button>Davom etish</Button></Link>
        </div>
      </div>
    );
  }

  const selectedServiceObj = usta.services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !address) return;
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card hover={false} className="max-w-md w-full text-center !p-10">
          <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Buyurtma tasdiqlandi!</h2>
          <p className="text-gray-500 mb-2">
            Siz <strong>{usta.name}</strong> dan "{selectedServiceObj?.name}" xizmatini band qildingiz.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            📅 {selectedDate} soat {selectedTime}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Shaxsiy kabinetga o'tish
            </Button>
            <Button onClick={() => navigate('/ustalar')} variant="outline" className="w-full">
              Boshqa ustalarni ko'rish
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-dark to-brand py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/ustalar/${usta.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Profilga qaytish
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Band qilish</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <Card hover={false}>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  Xizmat turini tanlang
                </h3>
                <div className="space-y-2">
                  {usta.services.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedService === service.id
                          ? 'border-brand bg-brand-light/10'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-4 h-4 text-brand accent-brand"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          {service.duration && <p className="text-xs text-gray-400">{service.duration}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-brand-dark">{formatPrice(service.price)}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Date & Time */}
              <Card hover={false}>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand" />
                  Sana va vaqt tanlang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Sana"
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />Vaqt
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Address & Notes */}
              <Card hover={false}>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand" />
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

          {/* Sidebar */}
          <div>
            <div className="sticky top-20">
              <Card hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={usta.name} size="md" />
                  <div>
                    <h4 className="font-bold text-gray-900">{usta.name}</h4>
                    <p className="text-sm text-gray-500">{usta.category}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {selectedServiceObj && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Xizmat</span>
                      <span className="font-medium text-gray-900">{selectedServiceObj.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sana</span>
                      <span className="font-medium text-gray-900">{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vaqt</span>
                      <span className="font-medium text-gray-900">{selectedTime}</span>
                    </div>
                  )}
                  {selectedServiceObj && (
                    <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-900">Jami</span>
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
