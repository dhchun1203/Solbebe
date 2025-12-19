import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import CategoryCard from '../components/common/CategoryCard'
import { productApi } from '../services/api'
import { CATEGORIES, DEFAULTS, ROUTES } from '../constants'

const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef(null)
  const isMountedRef = useRef(true)

  // 카테고리 리스트 메모이제이션
  const categoriesList = useMemo(() => CATEGORIES, [])

  // 상품 조회 함수 메모이제이션
  const fetchRecommendedProducts = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('상품 조회 시작...')
      }
      const products = await productApi.getRecommendedProducts(DEFAULTS.RECOMMENDED_PRODUCTS_LIMIT)
      
      if (import.meta.env.DEV) {
        console.log('상품 조회 성공:', products)
      }
      
      // 타임아웃 취소 (성공 시)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      if (isMountedRef.current) {
        setRecommendedProducts(products || [])
        setLoading(false)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('상품 조회 실패:', error)
        console.error('에러 상세:', {
          message: error?.message,
          stack: error?.stack,
          originalError: error?.originalError
        })
      }
      
      // 타임아웃 취소 (실패 시)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      if (isMountedRef.current) {
        setRecommendedProducts([])
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    // 타임아웃 설정 (10초 후에도 응답이 없으면 에러 처리)
    timeoutRef.current = setTimeout(() => {
      if (import.meta.env.DEV) {
        console.error('상품 조회 타임아웃 (10초 초과)')
      }
      if (isMountedRef.current) {
        setLoading(false)
        setRecommendedProducts([])
      }
    }, 10000)

    fetchRecommendedProducts()

    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [fetchRecommendedProducts])

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-pastel-pink/30 via-pastel-pink/10 to-white py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* 프리미엄 태그 */}
            <div className="inline-block bg-pastel-pink/20 rounded-full px-4 py-1.5 md:px-5 md:py-2 mb-6 md:mb-8">
              <span className="text-xs md:text-sm font-semibold text-pastel-pink-text uppercase tracking-wider">
                Premium Babywear
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              Soft & Cozy<br />Babywear
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              우리 아기를 위한 최고의 선택, 부드럽고 편안한 의류를 만나보세요
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-pastel-pink-text text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              지금 보러가기
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Menu */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gradient-to-b from-white to-pastel-pink/10">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block bg-pastel-pink/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs md:text-sm font-semibold text-pastel-pink-text uppercase tracking-wider">
              Categories
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            아기에게 필요한 모든 것
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            부드럽고 안전한 소재로 만든 다양한 카테고리의 의류를 만나보세요
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoriesList.map((category) => (
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
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gradient-to-b from-pastel-pink/10 to-white">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block bg-pastel-blue/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs md:text-sm font-semibold text-pastel-pink-text uppercase tracking-wider">
              Featured Products
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            추천 상품
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            엄선된 베스트 아이템으로 우리 아기를 더욱 특별하게
          </p>
        </div>
        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="mb-4">로딩 중...</div>
            <div className="text-sm text-gray-500">
              {import.meta.env.DEV && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-left max-w-2xl mx-auto">
                  <p className="font-semibold mb-2">🔍 디버깅 정보:</p>
                  <p className="text-xs mb-1">1. 브라우저 개발자 도구 (F12) → Network 탭 열기</p>
                  <p className="text-xs mb-1">2. "products" 요청 찾기</p>
                  <p className="text-xs mb-1">3. Status Code 확인:</p>
                  <p className="text-xs ml-4">- 401/403: RLS 정책 문제 → Supabase SQL Editor에서 실행:</p>
                  <p className="text-xs ml-8 font-mono bg-gray-100 p-1 rounded">ALTER TABLE products DISABLE ROW LEVEL SECURITY;</p>
                  <p className="text-xs ml-4">- pending: 네트워크 문제</p>
                  <p className="text-xs ml-4">- 200: 정상 (데이터 확인 필요)</p>
                </div>
              )}
            </div>
          </div>
        ) : recommendedProducts.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 mb-4">상품이 없습니다.</p>
            {import.meta.env.DEV && (
              <div className="text-sm text-gray-400">
                <p>Supabase에서 상품 데이터를 확인하세요.</p>
                <p className="mt-2">Table Editor → products 테이블</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gradient-to-b from-white to-pastel-beige/20">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block bg-pastel-beige/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs md:text-sm font-semibold text-pastel-pink-text uppercase tracking-wider">
              Our Story
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            Solbebe 이야기
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 order-2 md:order-1 group">
            <img
              src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
              alt="Brand Story"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-4 md:space-y-6 order-1 md:order-2">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              우리의 약속
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Solbebe는 우리 아이들이 가장 편안하고 건강하게 자랄 수 있도록
              최고의 소재와 디자인으로 제작된 아기 의류를 제공합니다.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              모든 제품은 아기의 부드러운 피부를 고려하여 선택된 원단으로
              만들어지며, 세탁 후에도 변형이 적고 오래 지속됩니다.
            </p>
            <div className="pt-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-pastel-pink/20 rounded-full px-4 py-2">
                  <span className="text-2xl">✨</span>
                  <span className="text-sm font-medium text-gray-700">프리미엄 소재</span>
                </div>
                <div className="flex items-center gap-2 bg-pastel-blue/20 rounded-full px-4 py-2">
                  <span className="text-2xl">🌿</span>
                  <span className="text-sm font-medium text-gray-700">친환경</span>
                </div>
                <div className="flex items-center gap-2 bg-pastel-beige/30 rounded-full px-4 py-2">
                  <span className="text-2xl">💝</span>
                  <span className="text-sm font-medium text-gray-700">사랑으로 제작</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

