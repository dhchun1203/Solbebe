import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../constants'
import AdminRoute from '../../components/common/AdminRoute'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, loading } = useAuthStore()

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
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* 관리자 헤더 */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-800">
                  Solbebe
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">관리자 페이지</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={ROUTES.HOME}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  홈으로
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 사이드바 */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="bg-white rounded-xl shadow-md p-4">
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
                          onClick={() => handleMenuClick(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? 'bg-pastel-pink text-white font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
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

