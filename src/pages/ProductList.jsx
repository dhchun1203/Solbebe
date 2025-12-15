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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 더미 데이터 (실제 API 연동 전까지)
        const dummyProducts = [
          {
            id: '1',
            name: '부드러운 베이비 바디슈트',
            price: 29000,
            category: 'top',
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'],
          },
          {
            id: '2',
            name: '코지 베이비 원피스',
            price: 35000,
            category: 'dress',
            images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'],
          },
          {
            id: '3',
            name: '소프트 베이비 팬츠',
            price: 25000,
            category: 'bottom',
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          },
          {
            id: '4',
            name: '귀여운 베이비 모자',
            price: 15000,
            category: 'accessory',
            images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'],
          },
          {
            id: '5',
            name: '베이비 긴팔 티셔츠',
            price: 22000,
            category: 'top',
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'],
          },
          {
            id: '6',
            name: '베이비 반바지',
            price: 20000,
            category: 'bottom',
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          },
        ]
        setProducts(dummyProducts)
        // 실제 사용: const data = await productApi.getAllProducts()
        // setProducts(data)
      } catch (error) {
        console.error('상품 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

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
  }, [products, selectedCategory, sortBy])

  const categoryMap = {
    all: '전체',
    top: '상의',
    bottom: '하의',
    dress: '원피스',
    accessory: '악세서리',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">상품 목록</h1>

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

