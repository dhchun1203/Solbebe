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
        // 실제 API 호출 대신 더미 데이터 사용 (Supabase 연동 전까지)
        const dummyProducts = [
          {
            id: '1',
            name: '부드러운 베이비 바디슈트',
            price: 29000,
            category: '상의',
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'],
            sizes: ['70', '80', '90'],
            colors: ['크림', '핑크'],
          },
          {
            id: '2',
            name: '코지 베이비 원피스',
            price: 35000,
            category: '원피스',
            images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'],
            sizes: ['70', '80', '90'],
            colors: ['베이지', '블루'],
          },
          {
            id: '3',
            name: '소프트 베이비 팬츠',
            price: 25000,
            category: '하의',
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
            sizes: ['70', '80', '90'],
            colors: ['화이트', '그레이'],
          },
          {
            id: '4',
            name: '귀여운 베이비 모자',
            price: 15000,
            category: '악세서리',
            images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'],
            sizes: ['Free'],
            colors: ['핑크', '블루'],
          },
        ]
        setRecommendedProducts(dummyProducts)
        // 실제 사용: const products = await productApi.getRecommendedProducts(6)
        // setRecommendedProducts(products)
      } catch (error) {
        console.error('상품 조회 실패:', error)
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pastel-pink to-pastel-blue py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Soft & Cozy Babywear
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              우리 아기를 위한 최고의 선택, 부드럽고 편안한 의류를 만나보세요
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-pastel-pink px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              신상 보러가기
            </Link>
          </div>
        </div>
        {/* 배너 이미지 */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920" 
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Category Quick Menu */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          카테고리
        </h2>
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
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          추천 상품
        </h2>
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
      <section className="container mx-auto px-4 py-12">
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

