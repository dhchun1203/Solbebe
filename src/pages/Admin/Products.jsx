import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '../../services/api'
import { ROUTES } from '../../constants'
import Toast from '../../components/common/Toast'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productApi.getAllProducts()
      setProducts(data || [])
    } catch (error) {
      console.error('상품 조회 실패:', error)
      setToast({
        isVisible: true,
        message: '상품을 불러오는데 실패했습니다.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) {
      return
    }

    try {
      await productApi.deleteProduct(id)
      setToast({
        isVisible: true,
        message: '상품이 삭제되었습니다.',
        type: 'success',
      })
      fetchProducts()
    } catch (error) {
      console.error('상품 삭제 실패:', error)
      setToast({
        isVisible: true,
        message: '상품 삭제에 실패했습니다.',
        type: 'error',
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">상품 관리</h1>
        <Link
          to={ROUTES.ADMIN_PRODUCTS + '/new'}
          className="bg-pastel-pink-text text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pastel-pink transition-colors"
        >
          + 새 상품 추가
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 mb-4">등록된 상품이 없습니다.</p>
          <Link
            to={ROUTES.ADMIN_PRODUCTS + '/new'}
            className="inline-block bg-pastel-pink-text text-white px-6 py-3 rounded-xl font-semibold hover:bg-pastel-pink transition-colors"
          >
            첫 상품 추가하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이미지</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상품명</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">카테고리</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">가격</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">작성일</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">이미지 없음</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{product.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {product.price?.toLocaleString()}원
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {new Date(product.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={ROUTES.ADMIN_PRODUCTS + '/' + product.id + '/edit'}
                          className="text-sm text-pastel-pink-text hover:text-pastel-pink transition-colors"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  )
}

export default Products

