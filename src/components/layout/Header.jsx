import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchModal from '../common/SearchModal'
import LoginModal from '../common/LoginModal'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const navigate = useNavigate()
  const { items, loadCartItems, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()
  const { user, signOut, checkSession } = useAuthStore()

  useEffect(() => {
    // 컴포넌트 마운트 시 세션 확인
    checkSession()
  }, [checkSession])

  useEffect(() => {
    // 로그인한 사용자의 장바구니 로드
    if (user) {
      loadCartItems()
    }
  }, [user, loadCartItems])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    setIsProfileMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 및 메뉴 */}
            <div className="flex items-center gap-8">
              {/* 로고 */}
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Solbebe
              </Link>

              {/* 메뉴 */}
              <nav className="flex items-center gap-8">
                <Link 
                  to="/" 
                  className="text-lg text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  홈
                </Link>
                <Link 
                  to="/products" 
                  className="text-lg text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  상품
                </Link>
                <Link 
                  to="/products?category=all" 
                  className="text-lg text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  카테고리
                </Link>
              </nav>
            </div>

            {/* 아이콘 버튼들 */}
            <div className="flex items-center gap-4">
              {/* 검색 버튼 */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-800 hover:text-pastel-pink-text transition-colors flex items-center justify-center w-6 h-6"
                aria-label="검색"
              >
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 프로필 메뉴 (로그인한 사용자) */}
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="text-gray-800 hover:text-pastel-pink-text transition-colors flex items-center justify-center w-6 h-6"
                    aria-label="프로필 메뉴"
                  >
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {/* 프로필 정보 */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user.user_metadata?.name || '사용자'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.email}
                        </p>
                      </div>

                      {/* 장바구니 메뉴 */}
                      <Link
                        to="/cart"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-sm text-gray-700">장바구니</span>
                        {totalItems > 0 && (
                          <span className="ml-auto bg-pastel-pink-text text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {totalItems > 9 ? '9+' : totalItems}
                          </span>
                        )}
                      </Link>

                      {/* 로그아웃 */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm text-gray-700">로그아웃</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 로그인 버튼 (프로필 아이콘) */
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-gray-800 hover:text-pastel-pink-text transition-colors flex items-center justify-center w-6 h-6"
                  aria-label="로그인"
                >
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 검색 모달 */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Header



