import { useState, useEffect, useRef } from 'react'

/**
 * 숫자를 0부터 목표값까지 애니메이션으로 카운트하는 훅
 * @param {number} target - 목표 숫자
 * @param {number} duration - 애니메이션 지속 시간 (ms)
 * @param {boolean} start - 애니메이션 시작 여부
 * @returns {number} 현재 카운트 값
 */
export const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return
    }

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // easing 함수 (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * target)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      startTimeRef.current = null
    }
  }, [target, duration, start])

  return count
}

