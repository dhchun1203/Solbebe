import { useEffect, useState, useRef } from 'react'
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
  
  // 드래그 관련 상태
  const thumbnailContainerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const { setSelectedProduct, setSelectedSize, setSelectedColor, selectedSize, selectedColor } = useProductStore()

  // 색상 이름을 영어로 매핑
  const getColorCode = (colorName) => {
    const colorMap = {
      '크림': 'beige',
      '베이지': 'beige',
      '핑크': 'pink',
      '블루': 'blue',
      '하늘색': 'blue',
      '화이트': 'white',
      '그레이': 'gray',
    }
    return colorMap[colorName] || colorName.toLowerCase()
  }

  // 선택된 색상에 맞는 이미지 필터링
  const getFilteredImages = () => {
    if (!product?.images || product.images.length === 0) return []
    
    // 색상이 선택되지 않았으면 모든 이미지 반환
    if (!selectedColor) return product.images
    
    const colorCode = getColorCode(selectedColor)
    
    // 이미지 URL에서 해당 색상 코드가 포함된 이미지만 필터링
    const matchedImages = product.images.filter(image => {
      const imageUrl = image.toLowerCase()
      // 다양한 패턴 지원:
      // - 하이픈 사이: -beige-, -blue-, -pink-
      // - 경로: /beige/, /blue/, /pink/
      // - 하이픈 뒤 확장자: -beige.png, -blue.png, -pink.png (모자/신발 등)
      return (
        imageUrl.includes(`-${colorCode}-`) || 
        imageUrl.includes(`/${colorCode}/`) ||
        imageUrl.includes(`-${colorCode}.`) ||
        imageUrl.endsWith(`-${colorCode}.png`)
      )
    })

    return matchedImages.length > 0 ? matchedImages : product.images
  }

  const filteredImages = getFilteredImages()

  // 색상 변경 시 이미지 인덱스 초기화
  useEffect(() => {
    if (selectedColor && filteredImages.length > 0) {
      setSelectedImageIndex(0)
    }
  }, [selectedColor, filteredImages.length])

  // 드래그 시작
  const handleMouseDown = (e) => {
    if (!thumbnailContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - thumbnailContainerRef.current.offsetLeft)
    setScrollLeft(thumbnailContainerRef.current.scrollLeft)
  }

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging || !thumbnailContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 조절
    thumbnailContainerRef.current.scrollLeft = scrollLeft - walk
  }

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 마우스가 영역을 벗어났을 때
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('상품 ID로 조회 시작:', id)
        // Supabase에서 실제 상품 데이터 가져오기
        const data = await productApi.getProductById(id)
        
        console.log('조회된 상품 데이터:', data)
        
        if (!data) {
          console.warn('상품 데이터가 없습니다. ID:', id)
          setProduct(null)
          return
        }
        
        // 이미지가 없는 경우를 대비한 처리
        if (!data.images || data.images.length === 0) {
          console.warn('상품 이미지가 없습니다:', data.name)
        }
        
        setProduct(data)
        setSelectedProduct(data)
      } catch (error) {
        console.error('상품 조회 실패:', error)
        console.error('에러 상세:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        // 에러 발생 시 빈 상태로 설정
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    } else {
      console.warn('상품 ID가 없습니다')
      setLoading(false)
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
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">상품을 찾을 수 없습니다.</p>
        <p className="text-gray-500 dark:text-gray-400 mb-4">상품 ID: {id}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          브라우저 콘솔(F12)에서 에러 메시지를 확인해주세요.
        </p>
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* 이미지 갤러리 */}
        <div className="min-w-0">
          {filteredImages.length > 0 ? (
            <>
              <div className="aspect-square bg-pastel-beige rounded-xl overflow-hidden mb-4">
                <img
                  src={filteredImages[selectedImageIndex] || filteredImages[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지 표시
                    e.target.src = 'https://via.placeholder.com/800x800?text=Image+Not+Found'
                  }}
                />
              </div>
              {/* 썸네일 리스트 */}
              {filteredImages.length > 1 && (
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scrollbar-hide max-w-full"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={(e) => {
                    // 모바일 터치 이벤트 처리
                    if (thumbnailContainerRef.current) {
                      setIsDragging(true)
                      setStartX(e.touches[0].pageX - thumbnailContainerRef.current.offsetLeft)
                      setScrollLeft(thumbnailContainerRef.current.scrollLeft)
                    }
                  }}
                  onTouchMove={(e) => {
                    if (!isDragging || !thumbnailContainerRef.current) return
                    e.preventDefault()
                    const x = e.touches[0].pageX - thumbnailContainerRef.current.offsetLeft
                    const walk = (x - startX) * 2
                    thumbnailContainerRef.current.scrollLeft = scrollLeft - walk
                  }}
                  onTouchEnd={() => {
                    setIsDragging(false)
                  }}
                >
                  {filteredImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        // 드래그 중이면 클릭 이벤트 방지
                        if (isDragging) {
                          e.preventDefault()
                          return
                        }
                        setSelectedImageIndex(index)
                      }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 select-none min-w-[64px] md:min-w-[80px] ${
                        selectedImageIndex === index
                          ? 'border-pastel-pink'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
              {selectedColor && filteredImages.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 text-center">
                  {selectedColor} 색상의 이미지를 찾을 수 없습니다.
                </p>
              )}
            </>
          ) : product.images && product.images.length > 0 ? (
            <div className="aspect-square bg-pastel-beige rounded-xl flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-300">
                {selectedColor ? `${selectedColor} 색상의 이미지를 선택해주세요.` : '이미지 준비 중입니다'}
              </p>
            </div>
          ) : (
            <div className="aspect-square bg-pastel-beige rounded-xl flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-300">이미지 준비 중입니다</p>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div>
          <span className="text-xs md:text-sm text-pastel-pink-text font-medium uppercase">
            {product.category}
          </span>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2 mb-3 md:mb-4">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-pastel-pink-text mb-4 md:mb-6">
            {product.price?.toLocaleString()}원
          </p>

          {/* 별점 (더미) */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-300">(4.8)</span>
          </div>

          {/* 사이즈 선택 */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium mb-2">사이즈</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-xl border-2 transition-all ${
                    selectedSize === size
                      ? 'border-pastel-pink-text bg-pastel-pink-text text-white'
                      : 'border-gray-300 dark:border-gray-700 hover:border-pastel-pink dark:hover:border-pastel-pink bg-white/70 dark:bg-gray-900/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 색상 선택 */}
          <div className="mb-6 md:mb-8">
            <label className="block text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium mb-2">색상</label>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-xl border-2 transition-all ${
                    selectedColor === color
                      ? 'border-pastel-pink-text bg-pastel-pink-text text-white'
                      : 'border-gray-300 dark:border-gray-700 hover:border-pastel-pink dark:hover:border-pastel-pink bg-white/70 dark:bg-gray-900/40'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300 mb-3">
            이 페이지는 데모 버전입니다. 장바구니 대신 문의로 연결됩니다.
          </p>
          <InquiryButton productId={product.id} />
        </div>
      </div>

      {/* 설명 탭 */}
      <div className="mb-6 md:mb-8">
        <div className="flex gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === 'info'
                ? 'text-pastel-pink-text border-b-2 border-pastel-pink'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            상품 정보
          </button>
          <button
            onClick={() => setActiveTab('material')}
            className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === 'material'
                ? 'text-pastel-pink-text border-b-2 border-pastel-pink'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            원단 정보
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'text-pastel-pink-text border-b-2 border-pastel-pink'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          >
            배송 안내
          </button>
        </div>

        <div className="mt-4 md:mt-6 p-4 md:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-transparent dark:border-gray-800">
          {activeTab === 'info' && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-200 leading-relaxed">{product.description}</p>
          )}
          {activeTab === 'material' && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-200 leading-relaxed">{product.material}</p>
          )}
          {activeTab === 'shipping' && (
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-200 leading-relaxed space-y-2">
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

