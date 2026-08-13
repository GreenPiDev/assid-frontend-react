import { Route, Routes } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { ToastProvider } from './context/ToastContext'
import FirmaRehberiPage from './pages/FirmaRehberiPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function HomeLayout() {
  return (
    <>
      <Header />
      <HomePage />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/firma-rehberi" element={<FirmaRehberiPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </ToastProvider>
  )
}
