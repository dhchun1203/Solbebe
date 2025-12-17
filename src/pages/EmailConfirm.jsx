import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import Toast from '../components/common/Toast'

const EmailConfirm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('confirming') // confirming, success, error
  const [message, setMessage] = useState('이메일 인증을 확인하는 중...')
  const { checkSession } = useAuthStore()
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // URL 해시에서 토큰 추출 (Supabase가 해시로 전달)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        // URL 쿼리 파라미터에서도 확인 (일부 경우)
        const token = searchParams.get('token')
        const tokenHash = searchParams.get('token_hash')
        const typeParam = searchParams.get('type')

        if (accessToken && refreshToken) {
          // 해시에서 토큰을 받은 경우
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) throw error

          // 세션 확인
          await checkSession()

          setStatus('success')
          setMessage('이메일 인증이 완료되었습니다!')

          // 2초 후 홈으로 이동
          setTimeout(() => {
            navigate('/')
          }, 2000)
        } else if (token && tokenHash && typeParam) {
          // 쿼리 파라미터에서 토큰을 받은 경우
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: typeParam,
          })

          if (error) throw error

          await checkSession()

          setStatus('success')
          setMessage('이메일 인증이 완료되었습니다!')

          setTimeout(() => {
            navigate('/')
          }, 2000)
        } else {
          // 토큰이 없는 경우 - 이미 인증되었거나 링크가 만료됨
          // 현재 세션 확인
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            // 이미 로그인되어 있음
            setStatus('success')
            setMessage('이미 인증이 완료된 계정입니다.')
            
            setTimeout(() => {
              navigate('/')
            }, 2000)
          } else {
            // 토큰이 없고 세션도 없음
            setStatus('error')
            setMessage('인증 링크가 유효하지 않거나 만료되었습니다.')
            
            setToast({
              isVisible: true,
              message: '인증 링크가 유효하지 않거나 만료되었습니다. 다시 시도해주세요.',
              type: 'error',
            })
          }
        }
      } catch (error) {
        console.error('이메일 인증 실패:', error)
        setStatus('error')
        
        let errorMessage = '이메일 인증에 실패했습니다.'
        if (error.message) {
          const errorMsg = error.message.toLowerCase()
          if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
            errorMessage = '인증 링크가 만료되었거나 유효하지 않습니다.'
          } else if (errorMsg.includes('already')) {
            errorMessage = '이미 인증이 완료된 계정입니다.'
          } else {
            errorMessage = error.message
          }
        }
        
        setMessage(errorMessage)
        setToast({
          isVisible: true,
          message: errorMessage,
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    handleEmailConfirmation()
  }, [navigate, searchParams, checkSession])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        {loading ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto border-4 border-pastel-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg text-gray-600">{message}</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-pastel-pink rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              인증 완료!
            </h1>
            <p className="text-gray-600 mb-8">{message}</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              인증 실패
            </h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="inline-block bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </>
        )}
      </div>

      {/* 토스트 알림 */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  )
}

export default EmailConfirm

