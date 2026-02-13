import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DonorDashboard from './pages/DonorDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/volunteer/dashboard'} replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/volunteer/dashboard'} replace /> : <RegisterPage />} 
        />
        <Route 
          path="/donor/dashboard" 
          element={
            <ProtectedRoute allowedRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/dashboard" 
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
