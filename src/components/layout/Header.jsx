import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchModal from '../common/SearchModal'
import LoginModal from '../common/LoginModal'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useClickOutside } from '../../hooks/useClickOutside'
import { ROUTES } from '../../constants'

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { items, loadCartItems, getTotalItems } = useCartStore()
  const { user, signOut, checkSession, isAdmin } = useAuthStore()
  const mobileMenuButtonRef = useRef(null)
  
  // 메모이제이션된 값들
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems, items])
  const isAdminUser = useMemo(() => isAdmin(), [isAdmin, user])

  // 메뉴 토글 함수들 메모이제이션
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])
  const openSearch = useCallback(() => setIsSearchOpen(true), [])
  const openLogin = useCallback(() => setIsLoginOpen(true), [])
  const toggleProfileMenu = useCallback(() => setIsProfileMenuOpen(prev => !prev), [])

  // 외부 클릭 감지 훅 (버튼 제외)
  const closeProfileMenu = useCallback(() => setIsProfileMenuOpen(false), [])
  const closeMobileMenu = useCallback((event) => {
    // 버튼 클릭은 제외
    if (mobileMenuButtonRef.current && mobileMenuButtonRef.current.contains(event?.target)) {
      return
    }
    setIsMobileMenuOpen(false)
  }, [])
  const profileMenuRef = useClickOutside(closeProfileMenu, isProfileMenuOpen)
  
  // 모바일 메뉴 외부 클릭 감지 (커스텀)
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (event) => {
      // 메뉴 영역과 버튼 영역 모두 제외
      const menuElement = document.querySelector('[data-mobile-menu]')
      if (
        menuElement && 
        !menuElement.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (user) {
      loadCartItems()
    }
  }, [user, loadCartItems])

  const handleSignOut = useCallback(async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (import.meta.env.DEV) {
      console.log('🔴 로그아웃 버튼 클릭됨')
    }
    
    // 메뉴 닫기
    setIsProfileMenuOpen(false)
    
    try {
      if (import.meta.env.DEV) {
        console.log('🔴 signOut 함수 호출 시작...')
      }
      
      // signOut 호출 (즉시 반환됨)
      const result = await signOut()
      
      if (import.meta.env.DEV) {
        console.log('🔴 signOut 결과:', result)
        console.log('🔴 홈으로 이동 중...')
      }
      
      // 약간의 딜레이 후 페이지 새로고침 (상태 초기화가 완료되도록)
      setTimeout(() => {
        window.location.href = ROUTES.HOME
      }, 100)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('🔴 로그아웃 중 오류 발생:', error)
      }
      
      // 상태 강제 초기화
      try {
        localStorage.removeItem('auth-storage')
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('localStorage 제거 실패:', e)
        }
      }
      
      // 에러가 발생해도 홈으로 이동
      setTimeout(() => {
        window.location.href = ROUTES.HOME
      }, 100)
    }
  }, [signOut])

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            {/* 로고 및 메뉴 */}
            <div className="flex items-center gap-4 md:gap-8">
              {/* 로고 */}
              <Link to={ROUTES.HOME} className="flex items-center">
                {/* 로고 이미지가 있으면 이미지 사용, 없으면 텍스트 표시 */}
                <img 
                  src="/logo.png" 
                  alt="Solbebe" 
                  className="h-10 md:h-12 max-h-12 md:max-h-14 w-auto object-contain"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    // 이미지 로드 실패 시 텍스트로 대체
                    e.target.style.display = 'none'
                    const textElement = e.target.nextElementSibling
                    if (textElement) {
                      textElement.style.display = 'block'
                    }
                  }}
                />
                <span className="text-xl md:text-2xl font-bold text-gray-800" style={{ display: 'none' }}>
                  Solbebe
                </span>
              </Link>

              {/* 데스크탑 메뉴 */}
              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  to={ROUTES.HOME} 
                  className="text-lg text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  홈
                </Link>
                <Link 
                  to={ROUTES.PRODUCTS} 
                  className="text-lg text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  상품
                </Link>
              </nav>
            </div>

            {/* 아이콘 버튼들 */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* 모바일 햄버거 메뉴 버튼 */}
              <button
                ref={mobileMenuButtonRef}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }}
                className="md:hidden text-gray-800 hover:text-pastel-pink-text transition-colors z-50 relative flex items-center justify-center w-6 h-6"
                aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                type="button"
              >
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* 검색 버튼 */}
              <button
                onClick={openSearch}
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
                    onClick={toggleProfileMenu}
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
                        to={ROUTES.CART}
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

                      {/* 내 문의 내역 메뉴 */}
                      <Link
                        to={ROUTES.MY_INQUIRIES}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-sm text-gray-700">내 문의 내역</span>
                      </Link>

                      {/* 관리자 대시보드 메뉴 */}
                      {isAdminUser && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm text-gray-700 font-medium">관리자 대시보드</span>
                        </Link>
                      )}

                      {/* 로그아웃 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleSignOut(e)
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
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
                  onClick={openLogin}
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

          {/* 모바일 메뉴 */}
          <div 
            data-mobile-menu
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'max-h-96 opacity-100 border-t border-gray-200 mt-3 pt-3' 
                : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0'
            }`}
          >
            <nav className={`flex flex-col gap-4 transition-all duration-300 ${
              isMobileMenuOpen 
                ? 'translate-y-0' 
                : '-translate-y-4'
            }`}>
                <Link 
                  to={ROUTES.HOME} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base text-gray-800 hover:text-pastel-pink-text transition-colors py-2"
                >
                  홈
                </Link>
                <Link 
                  to={ROUTES.PRODUCTS} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base text-gray-800 hover:text-pastel-pink-text transition-colors py-2"
                >
                  상품
                </Link>
                {user && (
                  <Link 
                    to={ROUTES.CART} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base text-gray-800 hover:text-pastel-pink-text transition-colors py-2 flex items-center gap-2"
                  >
                    장바구니
                    {totalItems > 0 && (
                      <span className="bg-pastel-pink-text text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {totalItems > 9 ? '9+' : totalItems}
                      </span>
                    )}
                  </Link>
                )}
                {user ? (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{user.user_metadata?.name || '사용자'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsLoginOpen(true)
                    }}
                    className="text-base text-gray-800 hover:text-pastel-pink-text transition-colors py-2 text-left"
                  >
                    로그인
                  </button>
                )}
              </nav>
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



