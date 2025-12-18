import { ERROR_MESSAGES } from '../constants'

/**
 * Supabase 에러를 사용자 친화적인 메시지로 변환
 * @param {Error} error - Supabase 에러 객체
 * @param {string} defaultMessage - 기본 에러 메시지
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export const formatError = (error, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  if (!error || !error.message) {
    return defaultMessage
  }

  const errorMsg = error.message.toLowerCase()

  // 인증 관련 에러
  if (
    errorMsg.includes('invalid login credentials') ||
    errorMsg.includes('invalid credentials') ||
    errorMsg.includes('email not found') ||
    errorMsg.includes('user not found')
  ) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS
  }

  if (errorMsg.includes('email not confirmed')) {
    return ERROR_MESSAGES.EMAIL_NOT_CONFIRMED
  }

  if (errorMsg.includes('too many requests')) {
    return ERROR_MESSAGES.TOO_MANY_REQUESTS
  }

  if (
    errorMsg.includes('user already registered') ||
    errorMsg.includes('email already exists') ||
    errorMsg.includes('already registered')
  ) {
    return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
  }

  if (errorMsg.includes('password')) {
    return ERROR_MESSAGES.INVALID_PASSWORD
  }

  if (errorMsg.includes('email')) {
    return ERROR_MESSAGES.INVALID_EMAIL
  }

  // 네트워크 에러
  if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  // 기타 에러는 원본 메시지 반환
  return error.message || defaultMessage
}

/**
 * API 호출 래퍼 함수
 * @param {Function} apiCall - API 호출 함수
 * @param {string} errorMessage - 에러 발생 시 표시할 메시지
 * @returns {Promise} API 호출 결과
 */
export const handleApiCall = async (apiCall, errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  try {
    if (import.meta.env.DEV) {
      console.log('🔄 API 호출 시작...')
    }
    const result = await apiCall()
    if (import.meta.env.DEV) {
      console.log('✅ API 호출 성공:', result)
    }
    return result
  } catch (error) {
    console.error('❌ API 호출 실패:', error)
    console.error('❌ 에러 상세:', {
      message: error?.message,
      stack: error?.stack,
      originalError: error?.originalError,
      name: error?.name
    })
    const formattedError = formatError(error, errorMessage)
    throw new Error(formattedError)
  }
}

