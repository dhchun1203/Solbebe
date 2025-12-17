import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import CategoryCard from '../components/common/CategoryCard'
import { productApi } from '../services/api'
import { CATEGORIES, DEFAULTS, ROUTES } from '../constants'

const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const products = await productApi.getRecommendedProducts(DEFAULTS.RECOMMENDED_PRODUCTS_LIMIT)
        setRecommendedProducts(products || [])
      } catch (error) {
        console.error('상품 조회 실패:', error)
        setRecommendedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [])

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-pastel-pink to-white py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 프리미엄 태그 */}
            <div className="inline-block bg-transparent rounded-lg px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6">
              <span className="text-xs md:text-sm font-medium text-gray-800">프리미엄 베이비웨어</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-3 md:mb-4">
              Soft & Cozy Babywear
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 px-2">
              우리 아기를 위한 최고의 선택, 부드럽고 편안한 의류를 만나보세요
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-gray-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              지금 보러가기
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Menu */}
      <section className="container mx-auto px-4 py-8 md:py-12 bg-white">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            카테고리
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            아기에게 필요한 모든 것
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.value}
              category={category.name}
              icon={category.icon}
              description={category.description}
            />
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="container mx-auto px-4 py-8 md:py-12 bg-white">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            추천 상품
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            엄선된 베스트 아이템
          </p>
        </div>
        {loading ? (
          <div className="text-center py-8 md:py-12">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 bg-white">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-md order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
              alt="Brand Story"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3 md:space-y-4 order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Solbebe 이야기</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Solbebe는 우리 아이들이 가장 편안하고 건강하게 자랄 수 있도록
              최고의 소재와 디자인으로 제작된 아기 의류를 제공합니다.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              모든 제품은 아기의 부드러운 피부를 고려하여 선택된 원단으로
              만들어지며, 세탁 후에도 변형이 적고 오래 지속됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

