import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

const Footer = () => {
  return (
    <footer 
      className="bg-gradient-to-b from-white via-pastel-pink/30 to-pastel-pink/50 border-t border-white mt-12 md:mt-20 select-none pb-safe"
      draggable="false"
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="inline-block">
              <h3 className="text-2xl md:text-3xl font-bold text-pastel-pink-text">
                Solbebe
              </h3>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              부드럽고 따뜻한 아기 의류로<br />
              소중한 순간을 함께합니다
            </p>
          </div>

          {/* 빠른 링크 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              빠른 링크
            </h4>
            <nav className="flex flex-col gap-2">
              <Link 
                to={ROUTES.HOME}
                className="text-sm text-gray-600 hover:text-pastel-pink-text transition-colors w-fit"
              >
                홈
              </Link>
              <Link 
                to={ROUTES.PRODUCTS}
                className="text-sm text-gray-600 hover:text-pastel-pink-text transition-colors w-fit"
              >
                상품 보기
              </Link>
              <Link 
                to={ROUTES.MY_INQUIRIES}
                className="text-sm text-gray-600 hover:text-pastel-pink-text transition-colors w-fit"
              >
                내 문의 내역
              </Link>
            </nav>
          </div>

          {/* SNS 및 연락처 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
              소셜 미디어
            </h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-pink-400 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md group"
                aria-label="Instagram"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" draggable="false">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-blue-400 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md group"
                aria-label="Facebook"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" draggable="false">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-yellow-400 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md group"
                aria-label="Kakao"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" draggable="false">
                  <path d="M12 3C6.48 3 2 6.14 2 10c0 2.38 1.66 4.48 4.05 5.76l-.9 3.38 3.58-2.35c.47.06.95.09 1.42.09.17 0 .33-.01.5-.02-.93-.9-1.5-2.16-1.5-3.52 0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6c-.17 0-.33-.01-.5-.02.17.01.33.02.5.02 5.52 0 10-3.14 10-7s-4.48-7-10-7z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-pastel-pink/20 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 카피라이트 */}
            <div className="text-xs text-gray-500 text-center md:text-left">
              © 2025 Solbebe. All rights reserved.
            </div>
            
            {/* 추가 정보 */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-500">
              <Link to="#" className="hover:text-pastel-pink-text transition-colors">
                이용약관
              </Link>
              <Link to="#" className="hover:text-pastel-pink-text transition-colors">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



