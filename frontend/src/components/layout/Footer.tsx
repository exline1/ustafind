import { Link } from 'react-router-dom';
import { Phone, EnvelopeSimple, MapPin, PaperPlaneTilt, InstagramLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <span className="text-xl font-extrabold text-white tracking-tight">UstaFind</span>
            <p className="text-sm text-white/70 leading-relaxed">
              Ishonchli ustalarni topish va band qilish platformasi. Qurilish, ta&apos;mirlash va texnika
              arendasi — barchasi bir joyda.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 rounded-lg hover:text-brand-light hover:bg-white/20 transition-colors duration-300"
                aria-label="Telegram"
              >
                <PaperPlaneTilt className="w-5 h-5" weight="fill" />
              </a>
              <a
                href="#"
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/10 rounded-lg hover:text-brand-light hover:bg-white/20 transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramLogo className="w-5 h-5" weight="fill" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sahifalar</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/ustalar" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Ustalar
                </Link>
              </li>
              <li>
                <Link to="/texnika" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Texnika arendasi
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Kirish
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ma&apos;lumot</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Foydalanish shartlari
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Maxfiylik siyosati
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 hover:text-brand-light transition-colors duration-300">
                  Yordam
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 text-brand-light shrink-0" weight="fill" />
                +998 71 123 45 67
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <EnvelopeSimple className="w-4 h-4 text-brand-light shrink-0" weight="fill" />
                info@ustafind.uz
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-brand-light shrink-0 mt-0.5" weight="fill" />
                Toshkent shahri, Amir Temur ko&apos;chasi, 100
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} UstaFind.uz — Barcha huquqlar himoyalangan.
          </p>
          <p className="text-sm text-white/70">O&apos;zbekiston uchun ❤️ bilan yaratilgan</p>
        </div>
      </div>
    </footer>
  );
}
