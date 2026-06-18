import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Wrench, ArrowRight, CheckCircle } from '@phosphor-icons/react';
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
      <div className="min-h-screen bg-gradient-brand-hero flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-md p-10 text-center border border-white/40">
          <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand" weight="fill" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-3 tracking-tight">Arizangiz qabul qilindi!</h2>
          <p className="text-gray-muted mb-8 leading-relaxed">
            Sizning usta sifatidagi arizangiz admin tomonidan ko&apos;rib chiqilmoqda. Tasdiqlangach,
            xizmatlaringizni taklif qilishni boshlashingiz mumkin.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full" icon={<ArrowRight className="w-4 h-4" weight="bold" />}>
            Shaxsiy kabinetga o&apos;tish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-brand-hero flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-md border border-white/40 p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3 tracking-tight">
              Platformada qanday rolda davom etmoqchisiz?
            </h1>
            <p className="text-gray-muted leading-relaxed">O&apos;zingizga mos rolni tanlang va boshlang</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setSelectedRole('client')}
              className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ease-in-out min-h-[44px] ${
                selectedRole === 'client'
                  ? 'border-brand border-[2px] bg-brand-light/10 text-brand-dark'
                  : 'border-gray-light bg-white hover:border-brand/30'
              }`}
            >
              {selectedRole === 'client' && (
                <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-brand" weight="fill" />
              )}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  selectedRole === 'client' ? 'bg-brand text-white' : 'bg-gray-light text-gray-muted'
                }`}
              >
                <UserCircle className="w-8 h-8" weight="fill" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">Mijozman</h3>
              <p className="text-sm text-gray-muted leading-relaxed">
                Usta qidirib, band qilib, xizmatdan foydalanaman. Texnika arendaga olishim ham mumkin.
              </p>
            </button>

            <button
              onClick={() => setSelectedRole('usta_pending')}
              className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ease-in-out min-h-[44px] ${
                selectedRole === 'usta_pending'
                  ? 'border-brand border-[2px] bg-brand-light/10 text-brand-dark'
                  : 'border-gray-light bg-white hover:border-brand/30'
              }`}
            >
              {selectedRole === 'usta_pending' && (
                <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-brand" weight="fill" />
              )}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  selectedRole === 'usta_pending' ? 'bg-brand text-white' : 'bg-gray-light text-gray-muted'
                }`}
              >
                <Wrench className="w-8 h-8" weight="fill" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">Ustaman</h3>
              <p className="text-sm text-gray-muted leading-relaxed">
                Xizmat ko&apos;rsataman va/yoki texnikamni arendaga beraman. Professional mutaxassisman.
              </p>
            </button>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            loading={loading}
            size="lg"
            className="w-full"
            icon={<ArrowRight className="w-5 h-5" weight="bold" />}
          >
            Davom etish
          </Button>
        </div>
      </div>
    </div>
  );
}
