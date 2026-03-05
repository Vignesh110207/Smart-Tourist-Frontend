import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'

import HomePage               from './pages/HomePage'
import LoginPage              from './pages/LoginPage'
import RegisterPage           from './pages/RegisterPage'
import DestinationsPage       from './pages/DestinationsPage'
import DestinationDetailPage  from './pages/DestinationDetailPage'
import PackagesPage           from './pages/PackagesPage'
import PackageDetailPage      from './pages/PackageDetailPage'
import GuidesPage             from './pages/GuidesPage'
import MyBookingsPage         from './pages/MyBookingsPage'
import AdminDashboardPage     from './pages/AdminDashboardPage'

// Guard: must be logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user)   return <Navigate to="/login" replace />
  return children
}

// Guard: must be ADMIN
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading)              return null
  if (!user)                return <Navigate to="/login"  replace />
  if (user.role !== 'ADMIN') return <Navigate to="/"     replace />
  return children
}

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"                  element={<HomePage />} />
      <Route path="/login"             element={<LoginPage />} />
      <Route path="/register"          element={<RegisterPage />} />
      <Route path="/destinations"      element={<DestinationsPage />} />
      <Route path="/destinations/:id"  element={<DestinationDetailPage />} />
      <Route path="/packages"          element={<PackagesPage />} />
      <Route path="/packages/:id"      element={<PackageDetailPage />} />
      <Route path="/guides"            element={<GuidesPage />} />
      <Route path="/my-bookings"       element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
      <Route path="/admin"             element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="*"                  element={<Navigate to="/" replace />} />
    </Routes>
  </>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
)

export default App
