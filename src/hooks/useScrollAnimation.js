import { useEffect, useRef, useState } from 'react'

/**
 * 스크롤 시 요소가 뷰포트에 들어올 때 애니메이션을 적용하는 훅
 * @param {Object} options - 옵션 객체
 * @param {number} options.threshold - Intersection Observer의 threshold (0-1)
 * @param {string} options.rootMargin - Intersection Observer의 rootMargin
 * @param {boolean} options.triggerOnce - 한 번만 트리거할지 여부
 * @returns {Object} { ref, isVisible }
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref: elementRef, isVisible }
}

