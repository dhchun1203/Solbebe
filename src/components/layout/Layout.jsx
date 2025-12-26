import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../common/ScrollToTop'
import { useThemeStore } from '../../store/themeStore'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useThemeStore((s) => s.theme)

  // 다크모드 적용 (html.dark)
  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])

  // 이메일 인증 해시 처리 (모든 페이지에서)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    // 인증 확인 페이지가 아닌 경우에만 처리
    if (location.pathname !== '/auth/confirm' && accessToken && (type === 'signup' || type === 'email' || type === 'recovery')) {
      // 이메일 인증 링크인 경우 인증 확인 페이지로 리다이렉트
      navigate('/auth/confirm' + window.location.hash, { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-grow bg-white dark:bg-gray-950">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout




