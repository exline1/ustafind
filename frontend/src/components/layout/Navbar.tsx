import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { List, X, User, SignOut, Shield } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';
  const isTransparent = isLanding && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Bosh sahifa' },
    { to: '/ustalar', label: 'Ustalar' },
    { to: '/texnika', label: 'Texnika arendasi' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const headerClass = isTransparent
    ? 'bg-transparent text-white'
    : 'bg-white text-brand-dark shadow-sm';

  const logoClass = isTransparent ? 'text-white' : 'text-brand-dark';
  const linkClass = (active: boolean) =>
    isTransparent
      ? active
        ? 'text-white border-b-2 border-brand-light'
        : 'text-white/80 hover:text-white nav-link-underline'
      : active
        ? 'text-brand border-b-2 border-brand'
        : 'text-gray-muted hover:text-brand nav-link-underline';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${headerClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="UstaFind bosh sahifa">
              <span className={`text-xl font-extrabold tracking-tight ${logoClass}`}>UstaFind</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6" aria-label="Asosiy navigatsiya">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-1 py-2 text-sm font-medium transition-colors duration-300 ease-in-out ${linkClass(isActive(link.to))}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl transition-colors duration-300 ${
                      isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-light'
                    }`}
                    aria-label="Profil menyusi"
                    aria-expanded={profileOpen}
                  >
                    <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                    <span
                      className={`hidden sm:block text-sm font-medium max-w-[120px] truncate ${
                        isTransparent ? 'text-white' : 'text-brand-dark'
                      }`}
                    >
                      {user.name}
                    </span>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden="true" />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-md border border-gray-light py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-light">
                          <p className="text-sm font-semibold text-brand-dark">{user.name}</p>
                          <p className="text-xs text-gray-muted truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-dark hover:bg-gray-light transition-colors duration-300"
                        >
                          <User className="w-4 h-4" weight="regular" />
                          Shaxsiy kabinet
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand font-medium hover:bg-brand-light/10 transition-colors duration-300"
                          >
                            <Shield className="w-4 h-4" weight="fill" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors duration-300"
                        >
                          <SignOut className="w-4 h-4" weight="regular" />
                          Chiqish
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm" variant={isTransparent ? 'white' : 'primary'}>
                    Kirish / Ro&apos;yxatdan o&apos;tish
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-xl transition-colors duration-300 ${
                  isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-light text-brand-dark'
                }`}
                aria-label={mobileOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" weight="bold" />
                ) : (
                  <List className="w-6 h-6" weight="bold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar on non-landing pages */}
      {!isLanding && <div className="h-16 md:h-[4.5rem]" />}

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-brand-dark flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/20">
            <span className="text-xl font-extrabold text-white">UstaFind</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl text-white hover:bg-white/10 transition-colors duration-300"
              aria-label="Menyuni yopish"
            >
              <X className="w-6 h-6" weight="bold" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2" aria-label="Mobil navigatsiya">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-4 rounded-xl text-lg font-semibold transition-colors duration-300 ${
                  isActive(link.to) ? 'text-brand-light bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-4 rounded-xl text-lg font-semibold text-brand-light bg-white/10"
              >
                Admin Panel
              </Link>
            )}
            {!user && (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="mt-4">
                <Button className="w-full" size="lg">
                  Kirish / Ro&apos;yxatdan o&apos;tish
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
