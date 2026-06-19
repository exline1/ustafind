import { Link } from 'react-router-dom';
import {
  MagnifyingGlass,
  ShieldCheck,
  CalendarCheck,
  Truck,
  Star,
  UserCheck,
  Clock,
  ChatCircle,
  ArrowRight,
  Drop,
  Lightning,
  Buildings,
  PaintBrush,
  Armchair,
  GridFour,
  PaintBucket,
  Hammer,
  Wind,
  Wrench,
  Users,
  ClipboardText,
} from '@phosphor-icons/react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import UnsplashImage from '../components/ui/UnsplashImage';
import { mockTestimonials, categories, formatPrice } from '../services/mockData';
import { getHeroImage, getUstaImage, getEquipmentImage } from '../services/unsplashService';
import { useEffect, useState, useRef } from 'react';

import { apiRequest } from '../services/api';

const categoryIcons: Record<string, React.ReactNode> = {
  Droplets: <Drop className="w-7 h-7" weight="fill" />,
  Zap: <Lightning className="w-7 h-7" weight="fill" />,
  Building2: <Buildings className="w-7 h-7" weight="fill" />,
  Paintbrush: <PaintBrush className="w-7 h-7" weight="fill" />,
  Armchair: <Armchair className="w-7 h-7" weight="fill" />,
  LayoutGrid: <GridFour className="w-7 h-7" weight="fill" />,
  PaintBucket: <PaintBucket className="w-7 h-7" weight="fill" />,
  Hammer: <Hammer className="w-7 h-7" weight="fill" />,
  Wind: <Wind className="w-7 h-7" weight="fill" />,
  Wrench: <Wrench className="w-7 h-7" weight="fill" />,
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
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
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-extrabold text-white">
      {count}
      {suffix}
      {!suffix && '+'}
    </div>
  );
}

export default function LandingPage() {
  const [ustalar, setUstalar] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiRequest('/ustalar').catch(() => []),
      apiRequest('/equipments').catch(() => []),
    ]).then(([ustasData, equipmentsData]) => {
      setUstalar(ustasData);
      setEquipment(equipmentsData);
    });
  }, []);

  const featuredUstalar = ustalar.slice(0, 4);
  const featuredEquipment = equipment.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen clip-hero-diagonal bg-gradient-brand-hero overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Ishonchli ustalarni toping — tez va oson
              </h1>
              <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
                UstaFind — O&apos;zbekiston bo&apos;ylab malakali ustalar, qurilish xizmatlari va texnika
                arendasini bir joyda jamlaydigan ishonchli platforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/ustalar">
                  <Button size="lg" variant="white" className="w-full sm:w-auto" icon={<MagnifyingGlass className="w-5 h-5" weight="bold" />}>
                    Usta toping
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto !border-white/50 !text-white hover:!bg-white/10">
                    Usta bo&apos;lib ro&apos;yxatdan o&apos;ting
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <UnsplashImage
                src={getHeroImage()}
                alt="Professional usta ish jarayonida"
                className="rounded-3xl shadow-md rotate-2"
                aspectClass="h-[420px]"
              />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Users, value: 500, label: '500+ usta' },
              { icon: ClipboardText, value: 1000, label: '1000+ buyurtma' },
              { icon: Star, value: 4, suffix: '.8', label: '4.8 reyting' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-6 h-6 text-white" weight="fill" />
                </div>
                <div>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gradient-brand-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 tracking-tight">
              Platforma nima qila oladi?
            </h2>
            <p className="text-gray-muted max-w-2xl mx-auto leading-relaxed">
              Barcha xizmatlar bir joyda — qulaylik va ishonchlilik kafolati bilan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: 'Tasdiqlangan ustalar', desc: 'Har bir usta admin tomonidan tekshirilgan va tasdiqlangan' },
              { icon: CalendarCheck, title: 'Onlayn band qilish', desc: 'Istagan vaqtda ustani band qiling — tez va qulay' },
              { icon: Truck, title: 'Texnika arendasi', desc: 'Qurilish texnikasi va jihozlarini oson arendaga oling' },
              { icon: Star, title: 'Reyting va sharhlar', desc: 'Real sharhlar orqali eng yaxshi ustani tanlang' },
            ].map((feature, i) => (
              <Card key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-brand rounded-2xl flex items-center justify-center text-white group-hover:shadow-md transition-all duration-300 ease-in-out">
                  <feature.icon className="w-8 h-8" weight="fill" />
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-muted leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 tracking-tight">Qanday ishlaydi?</h2>
            <p className="text-gray-muted max-w-2xl mx-auto leading-relaxed">
              Uch oddiy qadamda — ro&apos;yxatdan o&apos;ting, ustani tanlang va xizmatdan foydalaning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { step: '01', icon: UserCheck, title: "Ro'yxatdan o'ting", desc: "Hisobingizni yarating va mijoz yoki usta sifatida rol tanlang" },
              { step: '02', icon: Clock, title: 'Ustani tanlang va band qiling', desc: "Kategoriya, shahar va reytingga ko'ra ustani toping va vaqt band qiling" },
              { step: '03', icon: ChatCircle, title: 'Xizmatdan foydalaning', desc: 'Xizmat yakunlangach, usta haqida sharh qoldiring' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <span className="text-6xl md:text-7xl font-extrabold text-brand-light/40 absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                  {item.step}
                </span>
                <div className="relative pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-light/20 mb-5">
                    <item.icon className="w-8 h-8 text-brand-dark" weight="fill" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-muted leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-brand-light/50" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR USTALAR */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2 tracking-tight">Mashhur ustalar</h2>
              <p className="text-gray-muted">Eng yuqori reytingli va ishonchli mutaxassislar</p>
            </div>
            <Link
              to="/ustalar"
              className="flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors duration-300"
            >
              Barchasini ko&apos;rish <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
            {featuredUstalar.map((usta) => (
              <Link key={usta.id} to={`/ustalar/${usta.id}`} className="snap-start shrink-0 w-[280px] md:w-auto">
                <Card className="group cursor-pointer h-full !p-0 overflow-hidden">
                  <UnsplashImage
                    src={getUstaImage(usta.id)}
                    alt={`${usta.name} — ${usta.category}`}
                    className="rounded-t-2xl rounded-b-none"
                    aspectClass="h-[200px]"
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand transition-colors duration-300">{usta.name}</h3>
                      {usta.isVerified && <Badge variant="success">Tasdiqlangan</Badge>}
                    </div>
                    <p className="text-sm text-gray-muted mb-1">{usta.category}</p>
                    <p className="text-xs text-gray-muted mb-3">{usta.city}</p>
                    <Rating value={usta.rating} size="sm" showValue count={usta.reviewCount} />
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-gradient-brand group-hover:!text-white group-hover:!border-transparent transition-all duration-300">
                      Band qilish
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 tracking-tight">Xizmat kategoriyalari</h2>
            <p className="text-gray-muted max-w-2xl mx-auto leading-relaxed">
              Kerakli xizmat turini tanlang — biz sizga eng yaxshi ustalarni topamiz
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/ustalar?category=${cat.id}`} className="group">
                <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-transparent hover:border-brand transition-all duration-300 ease-in-out hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto mb-3 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand group-hover:text-brand-dark group-hover:bg-brand-light/40 transition-all duration-300">
                    {categoryIcons[cat.icon] || <Wrench className="w-7 h-7" weight="fill" />}
                  </div>
                  <h4 className="text-sm font-semibold text-brand-dark">{cat.name}</h4>
                  <p className="text-xs text-gray-muted mt-1">{cat.count} ta usta</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="py-20 bg-gradient-section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Texnika arendasi</h2>
              <p className="text-white/70">Qurilish texnikasi va jihozlarini arzon narxda arendaga oling</p>
            </div>
            <Link to="/texnika" className="flex items-center gap-2 text-brand-light font-semibold hover:text-white transition-colors duration-300">
              Barchasini ko&apos;rish <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map((eq) => (
              <Link key={eq.id} to={`/texnika/${eq.id}`}>
                <div className="glass-card-dark rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
                  <UnsplashImage
                    src={getEquipmentImage(eq.id, eq.name)}
                    alt={eq.name}
                    className="rounded-t-2xl"
                    aspectClass="h-48"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-1 group-hover:text-brand-light transition-colors duration-300">{eq.name}</h3>
                    <p className="text-sm text-white/70 mb-3">{eq.category} • {eq.city}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-brand-light">{formatPrice(eq.dailyPrice)}</span>
                      <span className="text-xs text-white/60">/ kuniga</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 tracking-tight">Mijozlar fikri</h2>
            <p className="text-gray-muted">Platformamiz foydalanuvchilarining haqiqiy izohlari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t) => (
              <div key={t.id} className="bg-gray-light rounded-2xl p-6 border-l-4 border-brand">
                <Rating value={t.rating} size="sm" />
                <p className="mt-4 text-sm text-gray-muted leading-relaxed mb-4">&ldquo;{t.comment}&rdquo;</p>
                <div>
                  <h4 className="font-semibold text-brand-dark">{t.name}</h4>
                  <p className="text-xs text-gray-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Hozir boshlang!</h2>
          <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
            Ishonchli ustalar bilan bog&apos;laning yoki o&apos;z xizmatlaringizni taklif qiling. UstaFind bilan hamma narsa oson!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="white" className="w-full sm:w-auto">
                Ro&apos;yxatdan o&apos;tish
              </Button>
            </Link>
            <Link to="/ustalar">
              <Button size="lg" variant="outline" className="w-full sm:w-auto !border-white !text-white hover:!bg-white/10">
                Ustalar ko&apos;rish
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
