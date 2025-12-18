import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { inquiryApi } from '../services/api'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const Inquiry = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const productId = searchParams.get('productId')
  
  // 장바구니에서 전달된 아이템들
  const cartItems = location.state?.cartItems || []
  const isFromCart = cartItems.length > 0
  
  const { selectedProduct, selectedSize, selectedColor } = useProductStore()
  const { clearCart } = useCartStore()
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 장바구니에서 온 경우는 체크하지 않음
    if (!isFromCart && !productId && !selectedProduct) {
      navigate('/products')
    }
  }, [productId, selectedProduct, navigate, isFromCart])

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

    // 장바구니에서 온 경우는 사이즈/색상 체크하지 않음
    if (!isFromCart) {
      if (!selectedSize || !selectedColor) {
        alert('사이즈와 색상을 선택해주세요. 상품 상세 페이지로 돌아가세요.')
        return
      }
    }

    setLoading(true)

    try {
      // 장바구니에서 온 경우: 모든 아이템에 대해 문의 생성
      if (isFromCart && cartItems.length > 0) {
        const inquiries = cartItems.map(item => ({
          name: formData.name,
          phone: formData.phone,
          email: user?.email || formData.phone || '', // 이메일 필드 추가
          user_id: user?.id || null, // 로그인한 사용자의 경우 user_id 저장
          product_id: item.productId,
          status: 'pending', // 기본 상태
          options: {
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity || 1,
          },
          message: formData.message || '',
        }))

        if (import.meta.env.DEV) {
          console.log('📝 장바구니 문의 생성 시작:', inquiries.length, '개')
        }

        // 모든 문의를 순차적으로 생성 (에러 발생 시 중단)
        for (const inquiry of inquiries) {
          await inquiryApi.createInquiry(inquiry)
        }

        if (import.meta.env.DEV) {
          console.log('📝 모든 문의 생성 완료')
        }

        // 장바구니에서 온 경우 장바구니 비우기
        let cartCleared = false
        let cartClearAttempts = 0
        const maxCartClearAttempts = 3
        
        while (!cartCleared && cartClearAttempts < maxCartClearAttempts) {
          try {
            cartClearAttempts++
            if (import.meta.env.DEV) {
              console.log(`🛒 장바구니 비우기 시도 ${cartClearAttempts}/${maxCartClearAttempts}`)
            }
            
            await clearCart()
            cartCleared = true
            
            if (import.meta.env.DEV) {
              console.log('🛒 장바구니 비우기 완료')
            }
          } catch (error) {
            console.error(`🛒 장바구니 비우기 실패 (시도 ${cartClearAttempts}/${maxCartClearAttempts}):`, error)
            
            if (cartClearAttempts >= maxCartClearAttempts) {
              // 최대 시도 횟수 초과 시 사용자에게 알림
              console.error('🛒 장바구니 비우기 최대 시도 횟수 초과')
              alert('문의는 정상적으로 접수되었지만, 장바구니 비우기에 실패했습니다. 장바구니 페이지에서 직접 삭제해주세요.')
            } else {
              // 재시도 전 잠시 대기
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        }

        navigate('/inquiry/success')
      } else {
        // 단일 상품 문의
        const inquiryData = {
          name: formData.name,
          phone: formData.phone,
          email: user?.email || formData.phone || '', // 이메일 필드 추가
          user_id: user?.id || null, // 로그인한 사용자의 경우 user_id 저장
          product_id: productId || selectedProduct?.id,
          status: 'pending', // 기본 상태
          options: {
            size: selectedSize,
            color: selectedColor,
          },
          message: formData.message || '',
        }

        if (import.meta.env.DEV) {
          console.log('📝 단일 상품 문의 생성 시작:', inquiryData)
        }

        await inquiryApi.createInquiry(inquiryData)

        if (import.meta.env.DEV) {
          console.log('📝 문의 생성 완료')
        }

        navigate('/inquiry/success')
      }
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
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8">구매 문의</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        {/* 상품 정보 (읽기 전용) */}
        {isFromCart && cartItems.length > 0 ? (
          <div className="bg-pastel-beige rounded-xl p-3 md:p-4">
            <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-3">장바구니 상품 정보</h2>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <p className="text-sm md:text-base text-gray-700 font-medium">{item.productName}</p>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm text-gray-600">
                    {item.size && <span>사이즈: {item.size}</span>}
                    {item.color && <span>색상: {item.color}</span>}
                    <span>수량: {item.quantity}개</span>
                    <span>가격: {(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedProduct && (
          <div className="bg-pastel-beige rounded-xl p-3 md:p-4">
            <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-2">상품 정보</h2>
            <p className="text-sm md:text-base text-gray-700">{selectedProduct.name}</p>
            <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm text-gray-600">
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






