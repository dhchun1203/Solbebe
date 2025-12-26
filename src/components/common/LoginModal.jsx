import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true) // true: 로그인, false: 회원가입
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { signIn, signUp, loading, error, clearError } = useAuthStore()

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 초기화
      setEmail('')
      setPassword('')
      setName('')
      setConfirmPassword('')
      setIsLogin(true)
      clearError()
    }
  }, [isOpen, clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLogin) {
      // 로그인
      const result = await signIn(email, password)
      if (result.success) {
        onClose()
      }
    } else {
      // 회원가입
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }
      if (password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.')
        return
      }
      const result = await signUp(email, password, name)
      if (result.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.')
        setIsLogin(true)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md my-auto border border-transparent dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isLogin ? '로그인' : '회원가입'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  required={!isLogin}
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-xs md:text-sm bg-red-50 p-2 md:p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          {/* 비밀번호 찾기 (로그인 모드일 때만) */}
          {isLogin && (
            <div className="mt-3 md:mt-4 text-center">
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="text-xs md:text-sm text-gray-600 dark:text-gray-300 hover:text-pastel-pink-text transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          )}

          {/* 로그인/회원가입 전환 */}
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                clearError()
              }}
              className="text-xs md:text-sm text-gray-600 dark:text-gray-300 hover:text-pastel-pink-text transition-colors"
            >
              {isLogin ? (
                <>
                  계정이 없으신가요? <span className="font-semibold">회원가입</span>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요? <span className="font-semibold">로그인</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal

