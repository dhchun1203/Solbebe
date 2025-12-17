import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const Cart = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items, loading, loadCartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()

  useEffect(() => {
    // 로그인 체크
    if (!user) {
      navigate('/')
      return
    }

    // 장바구니 아이템 로드
    loadCartItems()
  }, [user, navigate, loadCartItems])

  // 로그인하지 않은 경우 아무것도 표시하지 않음 (리다이렉트 중)
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-8">장바구니</h1>
        <div className="text-center py-8 md:py-16">
          <div className="text-4xl md:text-6xl mb-3 md:mb-4">🛒</div>
          <p className="text-base md:text-xl text-gray-600 mb-4">장바구니가 비어있습니다</p>
          <Link
            to="/products"
            className="inline-block bg-gray-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-sm md:text-base hover:bg-gray-700 transition-colors"
          >
            상품 보러가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">장바구니</h1>
        <button
          onClick={clearCart}
          className="text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="md:col-span-2 space-y-3 md:space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-3 md:p-4 flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              {/* 상품 이미지 */}
              <Link
                to={`/products/${item.productId}`}
                className="flex-shrink-0 w-full sm:w-20 md:w-24 h-20 md:h-24 rounded-lg overflow-hidden bg-pastel-beige"
              >
                <img
                  src={item.product.images?.[0] || 'https://via.placeholder.com/200'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* 상품 정보 */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-pastel-pink-text transition-colors block mb-1"
                >
                  {item.product.name}
                </Link>
                <div className="text-xs md:text-sm text-gray-600 mb-3 md:mb-0">
                  {item.size && <span>사이즈: {item.size} </span>}
                  {item.color && <span>색상: {item.color}</span>}
                </div>
                <div className="flex items-center justify-between mt-2 md:mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm md:text-base"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm md:text-base font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm md:text-base"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-base md:text-lg font-bold text-pastel-pink-text">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors mt-1"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 sticky top-20 md:top-24">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">주문 요약</h2>
            <div className="space-y-2 mb-3 md:mb-4">
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-gray-600">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-base md:text-lg font-bold text-gray-800">
                  <span>총 결제금액</span>
                  <span className="text-pastel-pink-text">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gray-800 text-white py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold hover:bg-gray-700 transition-colors"
            >
              구매 문의하기
            </button>
            <Link
              to="/products"
              className="block text-center text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors mt-3 md:mt-4"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

