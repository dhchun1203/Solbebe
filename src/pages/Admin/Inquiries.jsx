import { useEffect, useState } from 'react'
import { inquiryApi } from '../../services/api'
import Toast from '../../components/common/Toast'

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      console.log('📦 문의 조회 시작...')
      const data = await inquiryApi.getAllInquiries()
      console.log('📦 문의 조회 성공:', data?.length || 0)
      setInquiries(data || [])
    } catch (error) {
      console.error('📦 문의 조회 실패:', error)
      setInquiries([]) // 에러 발생 시 빈 배열로 설정
      setToast({
        isVisible: true,
        message: '문의를 불러오는데 실패했습니다. ' + (error?.message || ''),
        type: 'error',
      })
    } finally {
      setLoading(false)
      console.log('📦 문의 조회 완료 (로딩 종료)')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6 lg:mb-8">문의 관리</h1>

      {inquiries.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-xl shadow-md px-4">
          <p className="text-sm md:text-base text-gray-500">등록된 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-xl shadow-md p-3 md:p-4 lg:p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base text-gray-800 mb-1 truncate">{inquiry.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{inquiry.phone}</p>
                  {inquiry.email && (
                    <p className="text-xs text-gray-500 truncate">{inquiry.email}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${
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
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              {inquiry.products && (
                <div className="mb-2 md:mb-3">
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">상품:</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {typeof inquiry.products === 'object' && inquiry.products.name
                      ? inquiry.products.name
                      : '상품 정보 없음'}
                  </p>
                </div>
              )}

              {inquiry.options && (
                <div className="mb-2 md:mb-3">
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">옵션:</p>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-1">
                    {typeof inquiry.options === 'object'
                      ? JSON.stringify(inquiry.options)
                      : inquiry.options}
                  </p>
                </div>
              )}

              {inquiry.message && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">요청사항:</p>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                </div>
              )}
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
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">문의 상세</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">이름</p>
                <p className="text-sm md:text-base text-gray-800">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">연락처</p>
                <p className="text-sm md:text-base text-gray-800">{selectedInquiry.phone}</p>
              </div>

              {selectedInquiry.products && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">상품</p>
                  <p className="text-sm md:text-base text-gray-800">
                    {typeof selectedInquiry.products === 'object' && selectedInquiry.products.name
                      ? selectedInquiry.products.name
                      : '상품 정보 없음'}
                  </p>
                </div>
              )}

              {selectedInquiry.options && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">옵션</p>
                  <p className="text-xs md:text-sm text-gray-800 break-words">
                    {typeof selectedInquiry.options === 'object'
                      ? JSON.stringify(selectedInquiry.options, null, 2)
                      : selectedInquiry.options}
                  </p>
                </div>
              )}

              {selectedInquiry.message && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">요청사항</p>
                  <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap break-words">{selectedInquiry.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">문의일시</p>
                <p className="text-sm md:text-base text-gray-800">
                  {new Date(selectedInquiry.created_at).toLocaleString('ko-KR')}
                </p>
              </div>

              <div>
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">처리 상태</p>
                <select
                  value={selectedInquiry.status || 'pending'}
                  onChange={async (e) => {
                    const newStatus = e.target.value
                    try {
                      await inquiryApi.updateInquiryStatus(selectedInquiry.id, newStatus)
                      setInquiries(inquiries.map(inq => 
                        inq.id === selectedInquiry.id ? { ...inq, status: newStatus } : inq
                      ))
                      setSelectedInquiry({ ...selectedInquiry, status: newStatus })
                      setToast({
                        isVisible: true,
                        message: '처리 상태가 업데이트되었습니다.',
                        type: 'success',
                      })
                    } catch (error) {
                      setToast({
                        isVisible: true,
                        message: '처리 상태 업데이트에 실패했습니다. ' + (error?.message || ''),
                        type: 'error',
                      })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
                >
                  <option value="pending">접수 대기</option>
                  <option value="processing">처리 중</option>
                  <option value="completed">처리 완료</option>
                  <option value="cancelled">취소됨</option>
                </select>
              </div>
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

export default Inquiries

