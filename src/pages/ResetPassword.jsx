import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import Toast from '../components/common/Toast'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setToast({
        isVisible: true,
        message: '비밀번호가 일치하지 않습니다.',
        type: 'error',
      })
      return
    }

    if (password.length < 6) {
      setToast({
        isVisible: true,
        message: '비밀번호는 6자 이상이어야 합니다.',
        type: 'error',
      })
      return
    }

    setLoading(true)
    try {
      await authApi.updatePassword(password)
      
      setToast({
        isVisible: true,
        message: '비밀번호가 성공적으로 변경되었습니다!',
        type: 'success',
      })
      
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.message || '비밀번호 재설정에 실패했습니다.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">비밀번호 재설정</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '비밀번호 변경'}
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

export default ResetPassword



