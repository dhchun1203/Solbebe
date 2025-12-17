import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import CategoryCard from '../components/common/CategoryCard'
import { productApi } from '../services/api'

const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // Supabase에서 추천 상품 가져오기
        const products = await productApi.getRecommendedProducts(6)
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

  const categories = [
    { name: '상의', icon: '👕', description: '편안한 상의' },
    { name: '하의', icon: '👖', description: '부드러운 하의' },
    { name: '원피스', icon: '👗', description: '귀여운 원피스' },
    { name: '악세서리', icon: '🧢', description: '액세서리' },
  ]

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-pastel-pink to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 프리미엄 태그 */}
            <div className="inline-block bg-white rounded-lg px-4 py-2 mb-6">
              <span className="text-sm font-medium text-gray-800">프리미엄 베이비웨어</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Soft & Cozy Babywear
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              우리 아기를 위한 최고의 선택, 부드럽고 편안한 의류를 만나보세요
            </p>
            <Link
              to="/products"
              className="inline-block bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              지금 보러가기
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Menu */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
          카테고리
        </h2>
          <p className="text-gray-600">
            아기에게 필요한 모든 것
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              icon={category.icon}
              description={category.description}
            />
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
          추천 상품
        </h2>
          <p className="text-gray-600">
            엄선된 베스트 아이템
          </p>
        </div>
        {loading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
              alt="Brand Story"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Solbebe 이야기</h2>
            <p className="text-gray-600 leading-relaxed">
              Solbebe는 우리 아이들이 가장 편안하고 건강하게 자랄 수 있도록
              최고의 소재와 디자인으로 제작된 아기 의류를 제공합니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
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

