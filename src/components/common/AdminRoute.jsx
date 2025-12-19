import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../constants'

/**
 * 관리자 전용 라우트 보호 컴포넌트
 * 관리자가 아니면 홈으로 리다이렉트
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuthStore()
  const isAdminUser = isAdmin()

  if (!user) {
    // 로그인하지 않은 경우 홈으로 리다이렉트
    return <Navigate to={ROUTES.HOME} replace />
  }

  if (!isAdminUser) {
    // 관리자가 아닌 경우 홈으로 리다이렉트
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}

export default AdminRoute





