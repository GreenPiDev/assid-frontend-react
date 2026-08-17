import { useEffect, useState } from 'react'

const DOT_FRAMES = ['.', '..', '...', '.', '..', '...']
const VISIBLE_DURATION = 1500
const FADE_DURATION = 500

export default function LoadingScreen() {
  const [dotIndex, setDotIndex] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % DOT_FRAMES.length)
    }, 450)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setFadingOut(true), VISIBLE_DURATION)
    const unmountTimeout = setTimeout(() => setMounted(false), VISIBLE_DURATION + FADE_DURATION)
    return () => {
      clearTimeout(fadeTimeout)
      clearTimeout(unmountTimeout)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-assid-green-dark/90 backdrop-blur-sm transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <p className="mb-4 max-w-xs text-center font-sans text-sm font-semibold uppercase tracking-wide text-white/90">
        Ankara Siteler Sanayici ve İş İnsanları Derneği
      </p>
      <img
        src="/spinner-logo/spinner-logo.png"
        alt="Yükleniyor"
        className="h-32 w-32 animate-loading-bounce object-contain"
      />
      <p className="mt-4 font-sans text-sm font-medium tracking-wide text-white">
        Yükleniyor
        <span className="ml-0.5 inline-block w-6 text-left">{DOT_FRAMES[dotIndex]}</span>
      </p>
    </div>
  )
}
