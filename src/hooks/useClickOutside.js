import { useEffect, useRef } from 'react'

/**
 * 외부 클릭 감지 훅
 * @param {Function} handler - 외부 클릭 시 실행할 함수
 * @param {boolean} enabled - 훅 활성화 여부
 * @returns {Object} ref 객체
 */
export const useClickOutside = (handler, enabled = true) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handler, enabled])

  return ref
}








