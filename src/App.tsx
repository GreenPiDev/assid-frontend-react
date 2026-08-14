import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ContactPage from './pages/ContactPage'
import FirmaRehberiPage from './pages/FirmaRehberiPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MembershipApplicationPage from './pages/MembershipApplicationPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import RoleDashboardRouter from './pages/RoleDashboardRouter'

function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
        <ScrollRestoration />
      </ToastProvider>
    </AuthProvider>
  )
}

function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
          { path: '/contact', element: <ContactPage /> },
          { path: '/uyelik-basvurusu', element: <MembershipApplicationPage /> },
        ],
      },
      { path: '/firma-rehberi', element: <FirmaRehberiPage /> },
      {
        path: '/dashboard/*',
        element: (
          <RequireAuth>
            <RoleDashboardRouter />
          </RequireAuth>
        ),
      },
    ],
  },
])
