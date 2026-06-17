import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Wrench, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'usta_pending' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { selectRole } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await selectRole(selectedRole);
      if (selectedRole === 'client') {
        navigate('/dashboard');
      } else {
        setShowSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Arizangiz qabul qilindi!</h2>
          <p className="text-gray-500 mb-8">
            Sizning usta sifatidagi arizangiz admin tomonidan ko'rib chiqilmoqda. Tasdiqlangach, xizmatlaringizni taklif qilishni boshlashingiz mumkin.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Shaxsiy kabinetga o'tish
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Platformada qanday rolda davom etmoqchisiz?
          </h1>
          <p className="text-gray-500">O'zingizga mos rolni tanlang va boshlang</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Mijoz */}
          <button
            onClick={() => setSelectedRole('client')}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 group ${
              selectedRole === 'client'
                ? 'border-brand bg-brand-light/10 shadow-lg shadow-brand/10'
                : 'border-gray-200 bg-white hover:border-brand/30 hover:shadow-md'
            }`}
          >
            {selectedRole === 'client' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
              selectedRole === 'client'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-500 group-hover:bg-brand-light/20 group-hover:text-brand-dark'
            }`}>
              <UserCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mijozman</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Usta qidirib, band qilib, xizmatdan foydalanaman. Texnika arendaga olishim ham mumkin.
            </p>
          </button>

          {/* Usta */}
          <button
            onClick={() => setSelectedRole('usta_pending')}
            className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 group ${
              selectedRole === 'usta_pending'
                ? 'border-brand bg-brand-light/10 shadow-lg shadow-brand/10'
                : 'border-gray-200 bg-white hover:border-brand/30 hover:shadow-md'
            }`}
          >
            {selectedRole === 'usta_pending' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
              selectedRole === 'usta_pending'
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-500 group-hover:bg-brand-light/20 group-hover:text-brand-dark'
            }`}>
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ustaman</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Xizmat ko'rsataman va/yoki texnikamni arendaga beraman. Professional mutaxassisman.
            </p>
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          loading={loading}
          size="lg"
          className="w-full"
        >
          Davom etish
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
