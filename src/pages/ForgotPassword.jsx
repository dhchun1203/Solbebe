import { useState } from 'react'
import { authApi } from '../services/api'
import Toast from '../components/common/Toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      await authApi.resetPassword(email)
      
      // 보안상 이메일 존재 여부와 관계없이 성공 메시지 표시
      // (실제로는 등록된 이메일만 재설정 링크가 발송됨)
      setToast({
        isVisible: true,
        message: '비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.',
        type: 'success',
      })
      
      setEmail('')
    } catch (error) {
      // 에러 메시지를 사용자 친화적으로 변환
      let errorMessage = '이메일 발송에 실패했습니다.'
      
      if (error.message) {
        const errorMsg = error.message.toLowerCase()
        
        if (errorMsg.includes('user not found') || 
            errorMsg.includes('email not found') ||
            errorMsg.includes('user does not exist')) {
          errorMessage = '등록되지 않은 이메일입니다. 이메일 주소를 확인해주세요.'
        } else if (errorMsg.includes('rate limit') || errorMsg.includes('too many')) {
          errorMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.'
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
        } else {
          errorMessage = error.message
        }
      }
      
      setToast({
        isVisible: true,
        message: errorMessage,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">비밀번호 찾기</h1>
        <p className="text-gray-600 mb-6">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '재설정 링크 보내기'}
          </button>
        </form>
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

export default ForgotPassword

