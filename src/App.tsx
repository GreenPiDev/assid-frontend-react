import { createBrowserRouter, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import LoadingScreen from './components/ui/LoadingScreen'
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
        <LoadingScreen />
        <Outlet />
        <ScrollRestoration />
      </ToastProvider>
    </AuthProvider>
  )
}

const FULL_BLEED_PATHS = ['/', '/login', '/forgot-password', '/reset-password', '/contact', '/uyelik-basvurusu']
const SINGLE_SCREEN_PATHS = ['/contact']

function SiteLayout() {
  const location = useLocation()
  const isFullBleed = FULL_BLEED_PATHS.includes(location.pathname)
  const isSingleScreen = SINGLE_SCREEN_PATHS.includes(location.pathname)

  if (isSingleScreen) {
    return (
      <div className="flex flex-col lg:h-screen lg:overflow-hidden">
        <Header />
        <div className="lg:min-h-0 lg:flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={isFullBleed ? undefined : 'pt-[78px]'}>
        <Outlet />
      </div>
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
