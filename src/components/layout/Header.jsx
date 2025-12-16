import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold text-pastel-pink">
            Solbebe
          </Link>

          {/* 메뉴 */}
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-pastel-pink transition-colors"
            >
              홈
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-pastel-pink transition-colors"
            >
              상품
            </Link>
            <Link 
              to="/products?category=all" 
              className="text-gray-700 hover:text-pastel-pink transition-colors"
            >
              카테고리
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header



