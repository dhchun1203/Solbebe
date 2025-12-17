import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from './store/authStore'
import { supabase } from './services/supabase'

function App() {
  const { checkSession } = useAuthStore()

  useEffect(() => {
    // 앱 시작 시 세션 확인
    checkSession()

    // URL 해시에서 인증 토큰 확인 (이메일 인증 링크 처리)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (accessToken && (type === 'signup' || type === 'email' || type === 'recovery')) {
      // 이메일 인증 링크인 경우 인증 확인 페이지로 리다이렉트
      // 해시를 유지하면서 경로만 변경
      const currentPath = window.location.pathname
      if (currentPath !== '/auth/confirm') {
        window.history.replaceState(null, '', '/auth/confirm' + window.location.hash)
        window.location.reload()
      }
      return
    }

    // Supabase Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkSession()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [checkSession])

  return <RouterProvider router={router} />
}

export default App




