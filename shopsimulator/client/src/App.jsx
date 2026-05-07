import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ShopDetail from './pages/ShopDetail'
import AdminDashboard from './pages/admin/Dashboard'
import MerchantDashboard from './pages/merchant/Dashboard'
import UserOrders from './pages/user/Orders'
import UserBalance from './pages/user/Balance'

export default function App() {
  const { token, user } = useAuthStore()

  const getDefaultRoute = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'merchant') return '/merchant'
    return '/'
  }

  return (
    <Routes>
      <Route path="/login" element={
        token && user ? <Navigate to={getDefaultRoute()} replace /> : <Login />
      } />
      <Route path="/register" element={
        token && user ? <Navigate to={getDefaultRoute()} replace /> : <Register />
      } />

      <Route path="/" element={
        <ProtectedRoute roles={['user', 'admin']}>
          <Layout><Home /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/shop/:id" element={
        <ProtectedRoute roles={['user', 'admin']}>
          <Layout><ShopDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/merchant" element={
        <ProtectedRoute roles={['merchant']}>
          <Layout><MerchantDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/orders" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserOrders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/balance" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserBalance /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  )
}
