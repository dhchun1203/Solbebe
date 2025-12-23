import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { items, loadCartItems, getTotalItems } = useCartStore()
  const { user, signOut, checkSession, isAdmin } = useAuthStore()
  const mobileMenuButtonRef = useRef(null)
  const searchButtonRef = useRef(null)
  const searchInputRef = useRef(null)
  
  // 메모이제이션된 값들
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems, items])
  const isAdminUser = useMemo(() => isAdmin(), [isAdmin, user])

  // 메뉴 토글 함수들 메모이제이션
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])
  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => {
      if (!prev && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      return !prev
    })
  }, [])
  const openLogin = useCallback(() => setIsLoginOpen(true), [])
  const toggleProfileMenu = useCallback(() => setIsProfileMenuOpen(prev => !prev), [])

  // 외부 클릭 감지 훅 (버튼 제외)
  const closeProfileMenu = useCallback(() => setIsProfileMenuOpen(false), [])
  const closeSearch = useCallback(() => setIsSearchOpen(false), [])
  const closeMobileMenu = useCallback((event) => {
    // 버튼 클릭은 제외
    if (mobileMenuButtonRef.current && mobileMenuButtonRef.current.contains(event?.target)) {
      return
    }
    setIsMobileMenuOpen(false)
  }, [])
  const profileMenuRef = useClickOutside(closeProfileMenu, isProfileMenuOpen)
  
  // 검색 드롭다운 외부 클릭 감지 (버튼 제외)
  const searchRef = useRef(null)
  useEffect(() => {
    if (!isSearchOpen) return

    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])
  
  // 검색 제출 핸들러
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }, [searchQuery, navigate])
  
  // ESC 키로 검색 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    
    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isSearchOpen])
  
  // 모바일 메뉴 body 스크롤 제어
  useEffect(() => {
    if (isMobileMenuOpen) {
      // body 스크롤 방지
      document.body.style.overflow = 'hidden'
    } else {
      // body 스크롤 복원
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
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

              {/* 검색 버튼 및 드롭다운 (데스크탑만) */}
              <div className="relative hidden md:block" ref={searchRef}>
                <button
                  ref={searchButtonRef}
                  onClick={toggleSearch}
                  className="text-gray-800 hover:text-pastel-pink-text transition-colors flex items-center justify-center w-6 h-6"
                  aria-label="검색"
                >
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* 검색 드롭다운 */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-80 md:w-96 max-w-md bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 animate-fade-in-up">
                    <form onSubmit={handleSearchSubmit} className="px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="상품을 검색하세요..."
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink-text focus:border-transparent"
                            autoFocus
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2.5 text-sm bg-pastel-pink-text text-white rounded-lg hover:bg-pastel-pink-text/90 transition-colors whitespace-nowrap"
                        >
                          검색
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

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

        </div>
      </header>

      {/* 모바일 사이드 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div
          data-mobile-overlay
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-[9998] md:hidden transition-opacity duration-300"
        />
      )}

      {/* 모바일 사이드 메뉴 */}
      <div 
        data-mobile-menu
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        }`}
      >
        {/* 사이드 메뉴 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link 
            to={ROUTES.HOME} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center"
          >
            <img 
              src="/logo.png" 
              alt="Solbebe" 
              className="h-8 w-auto object-contain"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.target.style.display = 'none'
                const textElement = e.target.nextElementSibling
                if (textElement) {
                  textElement.style.display = 'block'
                }
              }}
            />
            <span className="text-lg font-bold text-gray-800 ml-2" style={{ display: 'none' }}>
              Solbebe
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-800 hover:text-pastel-pink-text transition-colors p-2"
            aria-label="메뉴 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 사이드 메뉴 네비게이션 */}
        <nav className="flex flex-col h-[calc(100vh-73px)] overflow-y-auto">
          {/* 검색 폼 */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="상품을 검색하세요..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink-text focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm bg-pastel-pink-text text-white rounded-lg hover:bg-pastel-pink-text/90 transition-colors whitespace-nowrap flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  검색
                </button>
              </div>
            </form>
          </div>
          
          <div className="p-4 space-y-1">
            <Link 
              to={ROUTES.HOME} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-800 hover:text-pastel-pink-text hover:bg-pastel-pink/10 rounded-xl transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>홈</span>
            </Link>
            
            <Link 
              to={ROUTES.PRODUCTS} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-800 hover:text-pastel-pink-text hover:bg-pastel-pink/10 rounded-xl transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>상품</span>
            </Link>

            {user && (
              <>
                <Link 
                  to={ROUTES.CART} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-base text-gray-800 hover:text-pastel-pink-text hover:bg-pastel-pink/10 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>장바구니</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-pastel-pink-text text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </Link>

                <Link 
                  to={ROUTES.MY_INQUIRIES} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base text-gray-800 hover:text-pastel-pink-text hover:bg-pastel-pink/10 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>내 문의 내역</span>
                </Link>

                {isAdminUser && (
                  <Link 
                    to={ROUTES.ADMIN_DASHBOARD} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base text-gray-800 hover:text-pastel-pink-text hover:bg-pastel-pink/10 rounded-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>관리자 대시보드</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* 사용자 정보 섹션 */}
          {user ? (
            <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  {user.user_metadata?.name || '사용자'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMobileMenuOpen(false)
                  handleSignOut(e)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-800 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="mt-auto p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsLoginOpen(true)
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-base text-white bg-pastel-pink-text hover:bg-pastel-pink-text/90 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>로그인</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Header



