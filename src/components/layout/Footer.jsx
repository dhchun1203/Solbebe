import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 md:mt-20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 로고 */}
          <div className="text-lg md:text-xl font-bold text-pastel-pink-text">
            Solbebe
          </div>

          {/* SNS 링크 */}
          <div className="flex gap-3 md:gap-4">
            <a 
              href="#" 
              className="text-sm md:text-base text-gray-600 hover:text-pastel-pink-text transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a 
              href="#" 
              className="text-sm md:text-base text-gray-600 hover:text-pastel-pink-text transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a 
              href="#" 
              className="text-sm md:text-base text-gray-600 hover:text-pastel-pink-text transition-colors"
              aria-label="Kakao"
            >
              Kakao
            </a>
          </div>

          {/* 카피라이트 */}
          <div className="text-xs md:text-sm text-gray-500">
            © 2024 Solbebe. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



