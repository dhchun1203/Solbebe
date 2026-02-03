import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { PRODUCTS } from '../data/products'

const Inquiry = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const productId = searchParams.get('productId')
  const { selectedProduct, selectedSize, selectedColor } = useProductStore()
  const productFromParams = PRODUCTS.find((item) => item.id === productId)
  const displayProduct = selectedProduct || productFromParams || null
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productId && !selectedProduct) {
      navigate('/products')
    }
  }, [productId, selectedProduct, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      alert('이름과 연락처를 입력해주세요.')
      return
    }

    if (displayProduct?.sizes?.length && !selectedSize) {
      alert('사이즈를 선택해주세요. 상품 상세 페이지로 돌아가세요.')
      return
    }
    if (displayProduct?.colors?.length && !selectedColor) {
      alert('색상을 선택해주세요. 상품 상세 페이지로 돌아가세요.')
      return
    }

    setLoading(true)

    try {
      navigate('/inquiry/success')
    } catch (error) {
      console.error('❌ 문의 등록 실패:', error)
      const errorMessage = error?.message || '문의 등록에 실패했습니다. 다시 시도해주세요.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-2xl">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-8">구매 문의</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 border border-transparent dark:border-gray-800">
        {/* 상품 정보 (읽기 전용) */}
        {displayProduct && (
          <div className="bg-pastel-beige rounded-xl p-3 md:p-4">
            <h2 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">상품 정보</h2>
            <p className="text-sm md:text-base text-gray-700">{displayProduct.name}</p>
            <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-300">
              {selectedSize && <span>사이즈: {selectedSize}</span>}
              {selectedColor && <span>색상: {selectedColor}</span>}
            </div>
          </div>
        )}

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="이름을 입력해주세요"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="phone" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
            연락처 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="연락처를 입력해주세요"
          />
        </div>

        {/* 요청사항 */}
        <div>
          <label htmlFor="message" className="block text-sm md:text-base text-gray-700 font-medium mb-2">
            요청사항
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink resize-none"
            placeholder="추가 요청사항이 있으시면 입력해주세요"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pastel-pink-text text-white py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '제출 중...' : '문의 제출하기'}
        </button>
      </form>
    </div>
  )
}

export default Inquiry






