import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import { productApi } from '../services/api'

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

  const categoryMap = {
    all: '전체',
    top: '상의',
    bottom: '하의',
    dress: '원피스',
    accessory: '악세서리',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {searchQuery ? `"${searchQuery}" 검색 결과` : '상품 목록'}
      </h1>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">카테고리:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink"
          >
            {Object.entries(categoryMap).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">정렬:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink"
          >
            <option value="latest">최신순</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12">로딩 중...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList

