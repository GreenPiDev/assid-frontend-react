import { Outlet, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import FirmaRehberiPage from './pages/FirmaRehberiPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/firma-rehberi" element={<FirmaRehberiPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
