import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import { productApi } from '../services/api'
import { CATEGORY_MAP, SORT_OPTIONS } from '../constants'

const ProductList = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  )
  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Supabase에서 실제 상품 데이터 가져오기
        const data = await productApi.getAllProducts()
        setProducts(data || [])
      } catch (error) {
        console.error('상품 조회 실패:', error)
        // 에러 발생 시 빈 배열로 설정
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // URL 파라미터 변경 감지
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    setSelectedCategory(category)
    setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    let filtered = [...products]

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      )
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // 정렬
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      // latest (기본값)
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy, searchQuery])

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-8">
        {searchQuery ? `"${searchQuery}" 검색 결과` : '상품 목록'}
      </h1>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 space-y-4 md:space-y-6 border border-transparent dark:border-gray-800">
        {/* 카테고리 필터 */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">카테고리</label>
          <div className="flex flex-nowrap gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center md:justify-start">
            {Object.entries(CATEGORY_MAP).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === value
                    ? 'bg-pastel-pink-text text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 필터 */}
        <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">정렬</label>
          <div className="flex flex-nowrap gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center md:justify-start">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0 ${
                  sortBy === option.value
                    ? 'bg-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {sortBy === option.value && (
                  <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-8 md:py-12">로딩 중...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-gray-500">
          상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList

