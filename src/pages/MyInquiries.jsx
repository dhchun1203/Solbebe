import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { inquiryApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import Toast from '../components/common/Toast'
import { ROUTES } from '../constants'

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOME)
      return
    }
    fetchInquiries()
  }, [user, navigate])

  const fetchInquiries = async () => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      if (import.meta.env.DEV) {
        console.log('📝 내 문의 조회 시작...', user.email)
      }
      
      // 사용자 이메일 또는 user_id로 문의 조회
      const data = await inquiryApi.getUserInquiries(user.email, user.id)
      
      if (import.meta.env.DEV) {
        console.log('📝 내 문의 조회 성공:', data?.length || 0)
      }
      
      setInquiries(data || [])
    } catch (error) {
      console.error('📝 내 문의 조회 실패:', error)
      setInquiries([])
      setToast({
        isVisible: true,
        message: '문의를 불러오는데 실패했습니다. ' + (error?.message || ''),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-8">내 문의 내역</h1>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-transparent dark:border-gray-800">
          <div className="text-4xl md:text-6xl mb-4">📝</div>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-4">등록된 문의가 없습니다.</p>
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="inline-block bg-gray-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-sm md:text-base hover:bg-gray-700 transition-colors"
          >
            상품 보러가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm md:text-base">
                    {inquiry.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{inquiry.phone}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {inquiry.product && (
                <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">상품:</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    {inquiry.product.name || '상품 정보 없음'}
                  </p>
                  {inquiry.product.images && inquiry.product.images.length > 0 && (
                    <img
                      src={inquiry.product.images[0]}
                      alt={inquiry.product.name}
                      className="w-16 h-16 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              )}

              {inquiry.options && (
                <div className="mb-3">
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">옵션:</p>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.options.size && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                        사이즈: {inquiry.options.size}
                      </span>
                    )}
                    {inquiry.options.color && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                        색상: {inquiry.options.color}
                      </span>
                    )}
                    {inquiry.options.quantity && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                        수량: {inquiry.options.quantity}개
                      </span>
                    )}
                  </div>
                </div>
              )}

              {inquiry.message && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">요청사항:</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{inquiry.message}</p>
                </div>
              )}

              {/* 처리 상태 표시 */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  inquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                  inquiry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  inquiry.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {inquiry.status === 'completed' ? '처리 완료' :
                   inquiry.status === 'processing' ? '처리 중' :
                   inquiry.status === 'cancelled' ? '취소됨' :
                   '접수 대기'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 문의 상세 모달 */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6 border border-transparent dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">문의 상세</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">이름</p>
                <p className="text-sm text-gray-800 dark:text-gray-100">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">연락처</p>
                <p className="text-sm text-gray-800 dark:text-gray-100">{selectedInquiry.phone}</p>
              </div>

              {selectedInquiry.product && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">상품</p>
                  <div className="flex items-center gap-3">
                    {selectedInquiry.product.images && selectedInquiry.product.images.length > 0 && (
                      <img
                        src={selectedInquiry.product.images[0]}
                        alt={selectedInquiry.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                        {selectedInquiry.product.name}
                      </p>
                      {selectedInquiry.product.price && (
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {selectedInquiry.product.price.toLocaleString()}원
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedInquiry.options && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">옵션</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.options.size && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-3 py-1 rounded">
                        사이즈: {selectedInquiry.options.size}
                      </span>
                    )}
                    {selectedInquiry.options.color && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-3 py-1 rounded">
                        색상: {selectedInquiry.options.color}
                      </span>
                    )}
                    {selectedInquiry.options.quantity && (
                      <span className="text-xs bg-pastel-beige text-gray-700 px-3 py-1 rounded">
                        수량: {selectedInquiry.options.quantity}개
                      </span>
                    )}
                  </div>
                </div>
              )}

              {selectedInquiry.message && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">요청사항</p>
                  <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">문의 일시</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {new Date(selectedInquiry.created_at).toLocaleString('ko-KR')}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">처리 상태</p>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  selectedInquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedInquiry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  selectedInquiry.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedInquiry.status === 'completed' ? '처리 완료' :
                   selectedInquiry.status === 'processing' ? '처리 중' :
                   selectedInquiry.status === 'cancelled' ? '취소됨' :
                   '접수 대기'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="bg-gray-800 text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
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

export default MyInquiries

