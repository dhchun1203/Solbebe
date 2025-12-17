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
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">장바구니</h1>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">장바구니가 비어있습니다</p>
          <Link
            to="/products"
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors"
          >
            상품 보러가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">장바구니</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4"
            >
              {/* 상품 이미지 */}
              <Link
                to={`/products/${item.productId}`}
                className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-pastel-beige"
              >
                <img
                  src={item.product.images?.[0] || 'https://via.placeholder.com/200'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* 상품 정보 */}
              <div className="flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-lg font-semibold text-gray-800 hover:text-pastel-pink-text transition-colors"
                >
                  {item.product.name}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  {item.size && <span>사이즈: {item.size} </span>}
                  {item.color && <span>색상: {item.color}</span>}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-pastel-pink-text">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors mt-1"
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
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">주문 요약</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>총 결제금액</span>
                  <span className="text-pastel-pink-text">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              구매 문의하기
            </button>
            <Link
              to="/products"
              className="block text-center text-gray-600 hover:text-gray-800 transition-colors mt-4"
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

