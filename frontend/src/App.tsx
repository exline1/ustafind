import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import PageTransition from './components/layout/PageTransition';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RoleSelectPage from './pages/RoleSelectPage';
import UstalarListPage from './pages/UstalarListPage';
import UstaProfilePage from './pages/UstaProfilePage';
import BookingPage from './pages/BookingPage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingRequests from './pages/admin/PendingRequests';
import AllUsers from './pages/admin/AllUsers';
import AllBookings from './pages/admin/AllBookings';
import EquipmentManagement from './pages/admin/EquipmentManagement';

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Outlet />
    </PageTransition>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
}

function AdminLayout() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-light pb-20 md:pb-8">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-light">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/ustalar" element={<UstalarListPage />} />
            <Route path="/ustalar/:id" element={<UstaProfilePage />} />
            <Route path="/texnika" element={<EquipmentListPage />} />
            <Route path="/texnika/:id" element={<EquipmentDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/ustalar/:id/booking" element={<BookingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/role-select" element={<RoleSelectPage />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/arizalar" element={<PendingRequests />} />
            <Route path="/admin/foydalanuvchilar" element={<AllUsers />} />
            <Route path="/admin/bandlovlar" element={<AllBookings />} />
            <Route path="/admin/texnikalar" element={<EquipmentManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
