import { Link } from 'react-router-dom';
import {
  Search, ShieldCheck, CalendarCheck, Truck, Star,
  UserCheck, Clock, MessageSquare, ArrowRight, CheckCircle2,
  Droplets, Zap, Building2, Paintbrush, Armchair, LayoutGrid, PaintBucket, Hammer, Wind, Wrench,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';
import Avatar from '../components/ui/Avatar';
import { mockUstalar, mockEquipment, mockTestimonials, categories, formatPrice } from '../services/mockData';
import { useEffect, useState, useRef } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Paintbrush: <Paintbrush className="w-6 h-6" />,
  Armchair: <Armchair className="w-6 h-6" />,
  LayoutGrid: <LayoutGrid className="w-6 h-6" />,
  PaintBucket: <PaintBucket className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <div ref={ref} className="text-4xl md:text-5xl font-extrabold text-white">{count}+{suffix && <span className="text-brand-light">{suffix}</span>}</div>;
}

export default function LandingPage() {
  const featuredUstalar = mockUstalar.slice(0, 4);
  const featuredEquipment = mockEquipment.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light/40">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-brand-light rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Ishonchli ustalarni toping —{' '}
              <span className="text-brand-light">tez va oson</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              UstaFind — O'zbekiston bo'ylab malakali ustalar, qurilish xizmatlari va texnika arendasini bir joyda jamlaydigan ishonchli platforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ustalar">
                <Button size="lg" className="w-full sm:w-auto bg-white !text-brand-dark hover:bg-gray-100 hover:!from-white hover:!to-white">
                  <Search className="w-5 h-5" />
                  Usta toping
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto !border-white/40 !text-white hover:!bg-white/10">
                  Usta bo'lib ro'yxatdan o'ting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Platforma nima qila oladi?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Barcha xizmatlar bir joyda — qulaylik va ishonchlilik kafolati bilan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: 'Tasdiqlangan ustalar', desc: 'Har bir usta admin tomonidan tekshirilgan va tasdiqlangan' },
              { icon: <CalendarCheck className="w-8 h-8" />, title: 'Onlayn band qilish', desc: 'Istagan vaqtda ustani band qiling — tez va qulay' },
              { icon: <Truck className="w-8 h-8" />, title: 'Texnika arendasi', desc: 'Qurilish texnikasi va jihozlarini oson arendaga oling' },
              { icon: <Star className="w-8 h-8" />, title: 'Reyting va sharhlar', desc: 'Real sharhlar orqali eng yaxshi ustani tanlang' },
            ].map((feature, i) => (
              <Card key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-light/20 rounded-2xl flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== QANDAY ISHLAYDI ====== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Qanday ishlaydi?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Uch oddiy qadamda — ro'yxatdan o'ting, ustani tanlang va xizmatdan foydalaning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <UserCheck className="w-8 h-8" />, title: "Ro'yxatdan o'ting", desc: "Hisobingizni yarating va mijoz yoki usta sifatida rol tanlang" },
              { step: '02', icon: <Clock className="w-8 h-8" />, title: "Ustani tanlang va band qiling", desc: "Kategoriya, shahar va reytingga ko'ra ustani toping va vaqt band qiling" },
              { step: '03', icon: <MessageSquare className="w-8 h-8" />, title: "Xizmatdan foydalaning", desc: "Xizmat yakunlangach, usta haqida sharh qoldiring" },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-light/30 to-brand/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-dark">
                    {item.icon}
                  </div>
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl font-extrabold text-gray-100 -z-10 select-none">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MASHHUR USTALAR ====== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Mashhur ustalar</h2>
              <p className="text-gray-500">Eng yuqori reytingli va ishonchli mutaxassislar</p>
            </div>
            <Link to="/ustalar" className="flex items-center gap-2 text-brand-dark font-semibold hover:gap-3 transition-all">
              Barchasini ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUstalar.map((usta) => (
              <Link key={usta.id} to={`/ustalar/${usta.id}`}>
                <Card className="group cursor-pointer">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar name={usta.name} size="xl" />
                      {usta.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-dark transition-colors">{usta.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{usta.category}</p>
                    <p className="text-xs text-gray-400 mb-3">{usta.city} • {usta.experience} yil tajriba</p>
                    <Rating value={usta.rating} size="sm" showValue count={usta.reviewCount} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== KATEGORIYALAR ====== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Xizmat kategoriyalari</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Kerakli xizmat turini tanlang — biz sizga eng yaxshi ustalarni topamiz</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/ustalar?category=${cat.id}`}
                className="group"
              >
                <Card className="text-center !p-5">
                  <div className="w-12 h-12 mx-auto mb-3 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all duration-300">
                    {iconMap[cat.icon] || <Wrench className="w-6 h-6" />}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{cat.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{cat.count} ta usta</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEXNIKA ARENDASI ====== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Texnika arendasi</h2>
              <p className="text-gray-500">Qurilish texnikasi va jihozlarini arzon narxda arendaga oling</p>
            </div>
            <Link to="/texnika" className="flex items-center gap-2 text-brand-dark font-semibold hover:gap-3 transition-all">
              Barchasini ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map((eq) => (
              <Link key={eq.id} to={`/texnika/${eq.id}`}>
                <Card className="group cursor-pointer">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl mb-4 flex items-center justify-center">
                    <Truck className="w-16 h-16 text-gray-300 group-hover:text-brand transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-dark transition-colors">{eq.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{eq.category} • {eq.city}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-dark">{formatPrice(eq.dailyPrice)}</span>
                    <span className="text-xs text-gray-400">/ kuniga</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATISTIKA ====== */}
      <section className="py-20 bg-gradient-to-r from-brand-dark via-brand to-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 500, label: "Tasdiqlangan usta" },
              { value: 1000, label: "Bajarilgan buyurtma" },
              { value: 200, label: "Texnika e'lonlari" },
              { value: 4, label: "O'rtacha reyting", suffix: '.8' },
            ].map((stat, i) => (
              <div key={i}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-white/70 mt-2 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Mijozlar fikri</h2>
            <p className="text-gray-500">Platformamiz foydalanuvchilarining haqiqiy izohlari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t) => (
              <Card key={t.id}>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <Rating value={t.rating} size="sm" />
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">"{t.comment}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-20 bg-gradient-to-br from-brand-dark to-brand">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Hozir boshlang!</h2>
          <p className="text-lg text-white/80 mb-8">
            Ishonchli ustalar bilan bog'laning yoki o'z xizmatlaringizni taklif qiling. UstaFind bilan hamma narsa oson!
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white !text-brand-dark hover:bg-gray-100 hover:!from-white hover:!to-white">
              Ro'yxatdan o'tish
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
