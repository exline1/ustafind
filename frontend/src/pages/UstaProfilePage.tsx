import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Clock, Briefcase, Phone, CalendarBlank, ArrowLeft } from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import UnsplashImage from '../components/ui/UnsplashImage';
import { formatPrice } from '../services/mockData';
import { getUstaImage, getGalleryImages } from '../services/unsplashService';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function UstaProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [usta, setUsta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiRequest(`/ustalar/${id}`)
        .then((data) => {
          setUsta(data);
          getGalleryImages(6, data.id).then(setGalleryUrls);
        })
        .catch((err) => console.error('Error fetching usta profile:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!usta) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Usta topilmadi</h2>
          <p className="text-gray-muted mb-6">Kechirasiz, bu usta mavjud emas</p>
          <Link to="/ustalar">
            <Button>Ustalar ro&apos;yxatiga qaytish</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) navigate('/auth');
    else navigate(`/ustalar/${usta.id}/booking`);
  };

  return (
    <div className="min-h-screen bg-gray-light">
      <div className="bg-gradient-brand-hero pt-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/ustalar"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" weight="bold" /> Ustalar ro&apos;yxati
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative shrink-0">
              <UnsplashImage
                src={getUstaImage(usta.id)}
                alt={usta.name}
                className="rounded-full border-4 border-white shadow-md w-28 h-28 md:w-36 md:h-36"
                aspectClass="w-28 h-28 md:w-36 md:h-36"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{usta.name}</h1>
                {usta.isVerified && <Badge variant="success">Tasdiqlangan</Badge>}
              </div>
              <p className="text-lg text-white/80 font-medium mb-2">{usta.category}</p>
              <Rating value={usta.rating} showValue count={usta.reviewCount} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card hover={false}>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-muted mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand" weight="fill" />
                  {usta.city}
                  {usta.district && `, ${usta.district}`}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-brand" weight="fill" />
                  {usta.experience} yil tajriba
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand" weight="fill" />
                  {usta.completedJobs} ta ish bajarilgan
                </span>
              </div>
              <h2 className="text-lg font-semibold text-brand-dark mb-3">Usta haqida</h2>
              <p className="text-gray-muted leading-relaxed">{usta.bio}</p>
              {usta.skills && usta.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {usta.skills.map((skill, i) => (
                    <Badge key={i} variant="category" size="md">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card hover={false}>
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Xizmatlar va narxlar</h2>
              <div className="space-y-3">
                {usta.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 bg-gray-light rounded-xl hover:bg-brand-light/10 transition-colors duration-300"
                  >
                    <div>
                      <h4 className="font-semibold text-brand-dark">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-gray-muted mt-0.5">{service.description}</p>
                      )}
                      {service.duration && (
                        <p className="text-xs text-gray-muted mt-1">{service.duration}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-brand-dark whitespace-nowrap ml-4">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card hover={false}>
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Ishlar galereyasi</h2>
              <div className="masonry-gallery">
                {galleryUrls.map((url, i) => (
                  <div key={i} className="overflow-hidden rounded-xl group">
                    <img
                      src={url}
                      alt={`${usta.name} ishi ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-xl hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card hover={false}>
              <h2 className="text-lg font-semibold text-brand-dark mb-4">
                Mijozlar sharhlari ({usta.reviews.length})
              </h2>
              {usta.reviews.length > 0 ? (
                <div className="space-y-4">
                  {usta.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-light">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={review.clientName} size="sm" />
                          <div>
                            <h4 className="font-semibold text-brand-dark text-sm">{review.clientName}</h4>
                            <p className="text-xs text-gray-muted">{review.date}</p>
                          </div>
                        </div>
                        <Rating value={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-muted ml-11 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-muted text-center py-8">Hali sharhlar yo&apos;q</p>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card hover={false} className="shadow-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-muted mb-1">Narxlar</p>
                  <p className="text-2xl font-bold text-brand-dark mb-1">
                    {formatPrice(usta.services[0]?.price || 0)}
                  </p>
                  <p className="text-xs text-gray-muted mb-6">dan boshlab</p>
                  <Button onClick={handleBooking} className="w-full" size="lg" icon={<CalendarBlank className="w-5 h-5" weight="fill" />}>
                    Band qilish
                  </Button>
                  <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] border-[1.5px] border-brand-dark rounded-xl text-sm font-semibold text-brand-dark hover:bg-brand-light/10 transition-all duration-300">
                    <Phone className="w-4 h-4" weight="fill" />
                    Bog&apos;lanish
                  </button>
                </div>
              </Card>

              <Card hover={false} className="!p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { value: usta.rating, label: 'Reyting' },
                    { value: usta.completedJobs, label: 'Bajarilgan' },
                    { value: usta.reviewCount, label: 'Sharhlar' },
                    { value: usta.experience, label: 'Yil tajriba' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                      <p className="text-xs text-gray-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
