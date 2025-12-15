import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InquiryButton from '../components/common/InquiryButton'
import { productApi } from '../services/api'
import { useProductStore } from '../store/productStore'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('info')

  const { setSelectedProduct, setSelectedSize, setSelectedColor, selectedSize, selectedColor } = useProductStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 더미 데이터
        const dummyProduct = {
          id: id,
          name: '부드러운 베이비 바디슈트',
          price: 29000,
          category: '상의',
          images: [
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
            'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
          ],
          sizes: ['70', '80', '90'],
          colors: ['크림', '핑크', '블루'],
          description: '아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다.',
          material: '순면 100%, 인체에 무해한 염료 사용',
          care: '30도 이하 세탁, 중성세제 사용, 그늘에서 건조',
        }
        setProduct(dummyProduct)
        setSelectedProduct(dummyProduct)
        // 실제 사용: const data = await productApi.getProductById(id)
        // setProduct(data)
        // setSelectedProduct(data)
      } catch (error) {
        console.error('상품 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, setSelectedProduct])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        로딩 중...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        상품을 찾을 수 없습니다.
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* 이미지 갤러리 */}
        <div>
          <div className="aspect-square bg-pastel-beige rounded-xl overflow-hidden mb-4">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* 썸네일 리스트 */}
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index
                    ? 'border-pastel-pink'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <span className="text-sm text-pastel-pink font-medium uppercase">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-pastel-pink mb-6">
            {product.price?.toLocaleString()}원
          </p>

          {/* 별점 (더미) */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-sm text-gray-500">(4.8)</span>
          </div>

          {/* 사이즈 선택 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">사이즈</label>
            <div className="flex gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded-xl border-2 transition-all ${
                    selectedSize === size
                      ? 'border-pastel-pink bg-pastel-pink text-white'
                      : 'border-gray-300 hover:border-pastel-pink'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 선택 */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">색상</label>
            <div className="flex gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-2 rounded-xl border-2 transition-all ${
                    selectedColor === color
                      ? 'border-pastel-pink bg-pastel-pink text-white'
                      : 'border-gray-300 hover:border-pastel-pink'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 구매 문의 버튼 */}
          <InquiryButton productId={product.id} />
        </div>
      </div>

      {/* 설명 탭 */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-pastel-pink border-b-2 border-pastel-pink'
                : 'text-gray-500'
            }`}
          >
            상품 정보
          </button>
          <button
            onClick={() => setActiveTab('material')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'material'
                ? 'text-pastel-pink border-b-2 border-pastel-pink'
                : 'text-gray-500'
            }`}
          >
            원단 정보
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'shipping'
                ? 'text-pastel-pink border-b-2 border-pastel-pink'
                : 'text-gray-500'
            }`}
          >
            배송 안내
          </button>
        </div>

        <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
          {activeTab === 'info' && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'material' && (
            <p className="text-gray-600 leading-relaxed">{product.material}</p>
          )}
          {activeTab === 'shipping' && (
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>• 배송비: 3,000원 (50,000원 이상 구매 시 무료배송)</p>
              <p>• 배송 소요: 2-3일</p>
              <p>• 제주 및 도서산간 지역 추가 배송비 발생</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

