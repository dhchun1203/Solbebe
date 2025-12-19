import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../constants'
import AdminRoute from '../../components/common/AdminRoute'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, loading } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  const handleSignOut = async () => {
    try {
      const result = await signOut()
      
      if (result?.success !== false) {
        // 로그아웃 성공 또는 결과가 없어도 홈으로 이동
        navigate(ROUTES.HOME)
        // 페이지 새로고침으로 상태 완전 초기화
        window.location.href = ROUTES.HOME
      } else {
        console.error('로그아웃 실패:', result?.error)
        // 실패해도 홈으로 이동
        navigate(ROUTES.HOME)
        window.location.href = ROUTES.HOME
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      // 에러가 발생해도 홈으로 이동
      navigate(ROUTES.HOME)
      window.location.href = ROUTES.HOME
    }
  }

  const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, label: '대시보드', icon: '📊' },
    { path: ROUTES.ADMIN_PRODUCTS, label: '상품 관리', icon: '📦' },
    { path: ROUTES.ADMIN_INQUIRIES, label: '문의 관리', icon: '💬' },
  ]

  const handleMenuClick = (path) => {
    console.log('🔵 메뉴 클릭:', path)
    console.log('🔵 현재 경로:', location.pathname)
    console.log('🔵 이동할 경로:', path)
    
    // 현재 경로와 같거나, 대시보드인 경우 /admin과 /admin/dashboard 모두 체크
    const isSamePath = 
      location.pathname === path ||
      (path === ROUTES.ADMIN_DASHBOARD && (location.pathname === '/admin' || location.pathname === '/admin/')) ||
      (location.pathname === '/admin' && path === ROUTES.ADMIN_DASHBOARD)
    
    if (isSamePath) {
      console.log('🔵 이미 해당 페이지에 있습니다.')
      return
    }
    
    // replace: true로 히스토리에 추가하지 않고 이동
    navigate(path, { replace: false })
    
    // navigate 후 경로 확인
    setTimeout(() => {
      console.log('🔵 이동 후 경로:', window.location.pathname)
    }, 100)
    
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    setIsSidebarOpen(false)
  }

  // 외부 클릭 시 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // 햄버거 버튼 클릭은 제외
        if (!event.target.closest('[data-sidebar-toggle]')) {
          setIsSidebarOpen(false)
        }
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen])

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* 관리자 헤더 */}
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                {/* 모바일 햄버거 메뉴 버튼 */}
                <button
                  data-sidebar-toggle
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden text-gray-800 hover:text-pastel-pink-text transition-colors p-2"
                  aria-label="메뉴"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isSidebarOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                <Link to={ROUTES.HOME} className="text-lg md:text-xl font-bold text-gray-800">
                  Solbebe
                </Link>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="hidden sm:inline text-xs md:text-sm text-gray-600">관리자</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  to={ROUTES.HOME}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors px-2 py-1 md:px-0 md:py-0"
                >
                  <span className="hidden sm:inline">홈으로</span>
                  <span className="sm:hidden">홈</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 md:px-0 md:py-0"
                >
                  {loading ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 모바일 오버레이 */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* 사이드바 */}
            <aside 
              ref={sidebarRef}
              className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 md:w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
              }`}
            >
              <nav className="bg-white rounded-xl shadow-md p-4 h-full md:h-auto overflow-y-auto relative z-50">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    // 경로 매칭 개선: /admin과 /admin/dashboard 모두 대시보드로 인식
                    const isActive = 
                      location.pathname === item.path ||
                      (item.path === ROUTES.ADMIN_DASHBOARD && location.pathname === '/admin')
                    
                    return (
                      <li key={item.path}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleMenuClick(item.path)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? 'bg-pastel-pink text-white font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm md:text-base">{item.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}

export default AdminLayout

