import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../store/themeStore'
import { ROUTES } from '../../constants'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-50 border-b border-transparent dark:border-gray-800/60">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.HOME} className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
              Solbebe
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
              <Link to={ROUTES.HOME} className="hover:text-pastel-pink-text transition-colors">
                홈
              </Link>
              <Link to={ROUTES.PRODUCTS} className="hover:text-pastel-pink-text transition-colors">
                상품
              </Link>
              <Link to={ROUTES.INQUIRY} className="hover:text-pastel-pink-text transition-colors">
                문의
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품 검색"
                className="w-48 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
              />
            </form>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-200"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Link to={ROUTES.HOME} onClick={() => setIsMobileMenuOpen(false)}>
              홈
            </Link>
            <Link to={ROUTES.PRODUCTS} onClick={() => setIsMobileMenuOpen(false)}>
              상품
            </Link>
            <Link to={ROUTES.INQUIRY} onClick={() => setIsMobileMenuOpen(false)}>
              문의
            </Link>
          </nav>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품 검색"
              className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
            />
            <button
              type="submit"
              className="rounded-full bg-pastel-pink-text text-white px-4 text-sm font-semibold"
            >
              검색
            </button>
          </form>
          <button
            onClick={toggleTheme}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2 text-sm text-gray-700 dark:text-gray-200"
          >
            테마 전환: {theme === 'dark' ? '다크' : '라이트'}
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
