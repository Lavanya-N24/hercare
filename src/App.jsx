import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Landing & Auth
import Landing from './pages/Landing'
import UserLogin from './pages/user/UserLogin'
import UserRegister from './pages/user/UserRegister'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'

// User
import UserLayout from './layouts/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import NapkinRequest from './pages/user/NapkinRequest'
import QRScanner from './pages/user/QRScanner'
import PeriodTracker from './pages/user/PeriodTracker'
import CrampRelief from './pages/user/CrampRelief'
import HealthArticles from './pages/user/HealthArticles'
import AIHealthAssistant from './pages/user/AIHealthAssistant'
import DoctorRecommendations from './pages/user/DoctorRecommendations'

// Profile
import ProfileSettings from './pages/ProfileSettings'

// Admin
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import MachineManagement from './pages/admin/MachineManagement'
import StockManagement from './pages/admin/StockManagement'
import DispenseHistory from './pages/admin/DispenseHistory'
import Alerts from './pages/admin/Alerts'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/" replace />
  // Allow if no role restriction, or role matches, or role is not yet loaded (undefined = fresh Google sign-in)
  if (role && user.role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading HerCare...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      <Route path="/user" element={
        <ProtectedRoute role="user">
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="napkin" element={<NapkinRequest />} />
        <Route path="scan" element={<QRScanner />} />
        <Route path="period-tracker" element={<PeriodTracker />} />
        <Route path="cramp-relief" element={<CrampRelief />} />
        <Route path="health-articles" element={<HealthArticles />} />
        <Route path="ai-assistant" element={<AIHealthAssistant />} />
        <Route path="doctor-recommendations" element={<DoctorRecommendations />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>

      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="machines" element={<MachineManagement />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="dispenses" element={<DispenseHistory />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
