import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="UstaFind" className="h-8 w-auto brightness-0 invert" />
              <span className="text-xl font-extrabold text-white">UstaFind</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ishonchli ustalarni topish va band qilish platformasi. Qurilish, ta'mirlash va texnika arendasi — barchasi bir joyda.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-brand transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-brand transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sahifalar */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sahifalar</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm hover:text-brand-light transition-colors">Bosh sahifa</Link></li>
              <li><Link to="/ustalar" className="text-sm hover:text-brand-light transition-colors">Ustalar</Link></li>
              <li><Link to="/texnika" className="text-sm hover:text-brand-light transition-colors">Texnika arendasi</Link></li>
              <li><Link to="/auth" className="text-sm hover:text-brand-light transition-colors">Kirish</Link></li>
            </ul>
          </div>

          {/* Ma'lumot */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ma'lumot</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-brand-light transition-colors">Biz haqimizda</a></li>
              <li><a href="#" className="text-sm hover:text-brand-light transition-colors">Foydalanish shartlari</a></li>
              <li><a href="#" className="text-sm hover:text-brand-light transition-colors">Maxfiylik siyosati</a></li>
              <li><a href="#" className="text-sm hover:text-brand-light transition-colors">Yordam</a></li>
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h4 className="text-white font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-brand-light" />
                +998 71 123 45 67
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-brand-light" />
                info@ustafind.uz
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-brand-light shrink-0 mt-0.5" />
                Toshkent shahri, Amir Temur ko'chasi, 100
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} UstaFind.uz — Barcha huquqlar himoyalangan.
          </p>
          <p className="text-sm text-gray-500">
            O'zbekiston uchun ❤️ bilan yaratilgan
          </p>
        </div>
      </div>
    </footer>
  );
}
