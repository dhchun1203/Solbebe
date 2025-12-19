import { useState, useEffect, useRef } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const timeoutRef = useRef(null)
  const isVisibleRef = useRef(false)

  // 스크롤 위치 감지
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 스크롤되면 버튼 표시
      if (window.pageYOffset > 300) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true
          setShouldRender(true)
          // 다음 프레임에서 애니메이션 시작
          requestAnimationFrame(() => {
            setIsVisible(true)
          })
        }
      } else {
        if (isVisibleRef.current) {
          isVisibleRef.current = false
          setIsVisible(false)
          // 애니메이션 시간 후에 실제로 DOM에서 제거
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setShouldRender(false)
          }, 300) // slide-down 애니메이션 시간과 동일
        }
      }
    }

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', toggleVisibility)

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 페이지 최상단으로 부드럽게 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 버튼이 렌더링되지 않아야 할 때는 null 반환
  if (!shouldRender) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-pastel-pink-text text-white rounded-full shadow-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group hover:bg-opacity-90 ${
        isVisible ? 'animate-slide-up' : 'animate-slide-down'
      }`}
      style={{
        boxShadow: '0 10px 25px -5px rgba(255, 107, 157, 0.4), 0 10px 10px -5px rgba(255, 107, 157, 0.2)',
      }}
      aria-label="맨 위로"
    >
      <svg
        className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-y-1 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}

export default ScrollToTop

