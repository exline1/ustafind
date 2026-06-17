import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';

const loginSchema = z.object({
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(6, 'Kamida 6 ta belgi'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Kamida 2 ta belgi'),
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(6, 'Kamida 6 ta belgi'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Parollar mos kelmadi',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, loginWithGoogle, loginWithTelegram } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setLoading(true);
    setError('');
    try {
      await signup(data.name, data.email, data.password);
      navigate('/auth/role-select');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/auth/role-select');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramLogin = async () => {
    setLoading(true);
    try {
      await loginWithTelegram();
      navigate('/auth/role-select');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <img src="/logo.png" alt="UstaFind" className="h-10 w-auto" />
              <span className="text-2xl font-extrabold text-brand-dark">UstaFind</span>
            </div>
            <p className="text-sm text-gray-500">Ustalar va mijozlarni bog'lovchi ishonchli platforma</p>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              { id: 'login', label: 'KIRISH' },
              { id: 'signup', label: "RO'YXATDAN O'TISH" },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => { setActiveTab(id as 'login' | 'signup'); setError(''); }}
            className="mb-6"
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <Input
                label="Email manzilingiz"
                type="email"
                placeholder="email@example.com"
                icon={<Mail className="w-5 h-5" />}
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register('email')}
              />
              <Input
                label="Parolingiz"
                type="password"
                placeholder="Kamida 6 ta belgi"
                icon={<Lock className="w-5 h-5" />}
                error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />
              <div className="text-right">
                <a href="#" className="text-sm text-brand hover:text-brand-dark transition-colors">
                  Parolni unutdingizmi?
                </a>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                KIRISH
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <Input
                label="To'liq ismingiz"
                placeholder="Ism Familiya"
                icon={<User className="w-5 h-5" />}
                error={signupForm.formState.errors.name?.message}
                {...signupForm.register('name')}
              />
              <Input
                label="Email manzilingiz"
                type="email"
                placeholder="email@example.com"
                icon={<Mail className="w-5 h-5" />}
                error={signupForm.formState.errors.email?.message}
                {...signupForm.register('email')}
              />
              <Input
                label="Parol"
                type="password"
                placeholder="Kamida 6 ta belgi"
                icon={<Lock className="w-5 h-5" />}
                error={signupForm.formState.errors.password?.message}
                {...signupForm.register('password')}
              />
              <Input
                label="Parolni tasdiqlang"
                type="password"
                placeholder="Parolni qayta kiriting"
                icon={<Lock className="w-5 h-5" />}
                error={signupForm.formState.errors.confirmPassword?.message}
                {...signupForm.register('confirmPassword')}
              />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                RO'YXATDAN O'TISH
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">YOKI</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google orqali kirish
            </button>
            <button
              onClick={handleTelegramLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0088cc] rounded-xl text-sm font-medium text-white hover:bg-[#0077b5] transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram orqali kirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
