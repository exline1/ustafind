import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle2, Clock, Briefcase, Phone, Calendar, ArrowLeft, Image } from 'lucide-react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getUstaById, formatPrice } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export default function UstaProfilePage() {
  const { id } = useParams<{ id: string }>();
  const usta = getUstaById(id || '');
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!usta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Usta topilmadi</h2>
          <p className="text-gray-500 mb-6">Kechirasiz, bu usta mavjud emas</p>
          <Link to="/ustalar"><Button>Ustalar ro'yxatiga qaytish</Button></Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/ustalar/${usta.id}/booking`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-dark to-brand py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/ustalar" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Ustalar ro'yxati
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card hover={false}>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar name={usta.name} size="xl" />
                  {usta.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand rounded-full flex items-center justify-center ring-2 ring-white">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-gray-900">{usta.name}</h1>
                    {usta.isVerified && <Badge variant="success">Tasdiqlangan</Badge>}
                  </div>
                  <p className="text-lg text-brand-dark font-semibold mb-2">{usta.category}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{usta.city}{usta.district && `, ${usta.district}`}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{usta.experience} yil tajriba</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{usta.completedJobs} ta ish bajarilgan</span>
                  </div>
                  <div className="mt-3">
                    <Rating value={usta.rating} showValue count={usta.reviewCount} />
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card hover={false}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Usta haqida</h2>
              <p className="text-gray-600 leading-relaxed">{usta.bio}</p>
              {usta.skills && usta.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {usta.skills.map((skill, i) => (
                    <span key={i} className="text-sm bg-brand-light/15 text-brand-dark px-3 py-1.5 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            {/* Services */}
            <Card hover={false}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Xizmatlar va narxlar</h2>
              <div className="space-y-3">
                {usta.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      {service.description && <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>}
                      {service.duration && <p className="text-xs text-gray-400 mt-1">⏱ {service.duration}</p>}
                    </div>
                    <span className="text-lg font-bold text-brand-dark whitespace-nowrap ml-4">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Gallery */}
            <Card hover={false}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ishlar galereyasi</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center group hover:bg-gray-200 transition-colors">
                    <Image className="w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card hover={false}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Mijozlar sharhlari ({usta.reviews.length})
              </h2>
              {usta.reviews.length > 0 ? (
                <div className="space-y-4">
                  {usta.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={review.clientName} size="sm" />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{review.clientName}</h4>
                            <p className="text-xs text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <Rating value={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Hali sharhlar yo'q</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card hover={false}>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Narxlar</p>
                  <p className="text-2xl font-extrabold text-brand-dark mb-1">
                    {formatPrice(usta.services[0]?.price || 0)}
                  </p>
                  <p className="text-xs text-gray-400 mb-6">dan boshlab</p>
                  <Button onClick={handleBooking} className="w-full" size="lg">
                    <Calendar className="w-5 h-5" />
                    Band qilish
                  </Button>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    Bog'lanish
                  </button>
                </div>
              </Card>

              <Card hover={false} className="!p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{usta.rating}</p>
                    <p className="text-xs text-gray-500">Reyting</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{usta.completedJobs}</p>
                    <p className="text-xs text-gray-500">Bajarilgan</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{usta.reviewCount}</p>
                    <p className="text-xs text-gray-500">Sharhlar</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">{usta.experience}</p>
                    <p className="text-xs text-gray-500">Yil tajriba</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
