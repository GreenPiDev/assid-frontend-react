import { createBrowserRouter, Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import RequireAuth from './components/auth/RequireAuth'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import LoadingScreen from './components/ui/LoadingScreen'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AboutPage from './pages/AboutPage'
import AllEventsPage from './pages/AllEventsPage'
import AllNewsPage from './pages/AllNewsPage'
import BoardManagementPage from './pages/BoardManagementPage'
import ContactPage from './pages/ContactPage'
import FirmaRehberiPage from './pages/FirmaRehberiPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MembershipApplicationPage from './pages/MembershipApplicationPage'
import NewsDetailPage from './pages/NewsDetailPage'
import PresidentMessagePage from './pages/PresidentMessagePage'
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

const FULL_BLEED_PATHS = [
  '/anasayfa',
  '/giris',
  '/sifremi-unuttum',
  '/sifre-sifirla',
  '/iletisim',
  '/uyelik-basvurusu',
  '/tum-etkinlikler',
  '/hakkimizda',
  '/haberler',
  '/baskanin-mesaji',
  '/dernek-yonetimi',
]
const SINGLE_SCREEN_PATHS = ['/iletisim']

function SiteLayout() {
  const location = useLocation()
  const isFullBleed = FULL_BLEED_PATHS.includes(location.pathname) || location.pathname.startsWith('/haberler/')
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
          { path: '/', element: <Navigate to="/anasayfa" replace /> },
          { path: '/anasayfa', element: <HomePage /> },
          { path: '/giris', element: <LoginPage /> },
          { path: '/sifremi-unuttum', element: <ForgotPasswordPage /> },
          { path: '/sifre-sifirla', element: <ResetPasswordPage /> },
          { path: '/iletisim', element: <ContactPage /> },
          { path: '/uyelik-basvurusu', element: <MembershipApplicationPage /> },
          { path: '/tum-etkinlikler', element: <AllEventsPage /> },
          { path: '/hakkimizda', element: <AboutPage /> },
          { path: '/haberler', element: <AllNewsPage /> },
          { path: '/haberler/:slug', element: <NewsDetailPage /> },
          { path: '/baskanin-mesaji', element: <PresidentMessagePage /> },
          { path: '/dernek-yonetimi', element: <BoardManagementPage /> },
        ],
      },
      { path: '/firma-rehberi', element: <FirmaRehberiPage /> },
      {
        path: '/panel/*',
        element: (
          <RequireAuth>
            <RoleDashboardRouter />
          </RequireAuth>
        ),
      },
    ],
  },
])
