import { useEffect } from 'react'

const TermsModal = ({ isOpen, onClose }) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={(e) => {
        // 오버레이 클릭 시 닫기
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-fade-in-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">이용약관</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-6">
            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제1조 (목적)</h3>
              <p className="leading-relaxed">
                본 약관은 Solbebe(이하 "회사")가 운영하는 온라인 쇼핑몰에서 제공하는 서비스의 이용과 관련하여 
                회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제2조 (정의)</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>"서비스"란 회사가 제공하는 아기 의류 쇼핑몰 및 관련 제반 서비스를 의미합니다.</li>
                <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 
                회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                <li>"상품"이란 회사가 판매하는 아기 의류 및 관련 제품을 의미합니다.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제3조 (약관의 게시와 개정)</h3>
              <p className="leading-relaxed mb-2">
                회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
              </p>
              <p className="leading-relaxed">
                회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 
                약관이 개정되는 경우 회사는 개정된 약관의 내용과 시행일을 명시하여 현행약관과 함께 
                서비스 초기 화면에 그 시행일 7일 이전부터 시행일 후 상당한 기간 동안 공지합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제4조 (서비스의 제공 및 변경)</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                    <li>아기 의류 및 관련 제품의 판매</li>
                    <li>상품 정보 제공 및 검색 서비스</li>
                    <li>구매 문의 및 주문 처리 서비스</li>
                    <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                  </ul>
                </li>
                <li>회사는 상품의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 
                제공할 상품의 내용을 변경할 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제5조 (주문 및 결제)</h3>
              <p className="leading-relaxed mb-2">
                이용자는 회사가 제공하는 서비스를 통해 상품을 주문할 수 있으며, 회사는 이용자의 주문에 대하여 
                다음 각 호에 해당하는 경우 승인하지 않을 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>주문 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 주문에 관하여 회사가 정한 조건을 위반한 경우</li>
                <li>상품의 품절 또는 재고 부족 등으로 인해 주문을 처리할 수 없는 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제6조 (배송)</h3>
              <p className="leading-relaxed mb-2">
                회사는 이용자의 주문에 따른 배송을 위해 필요한 경우 이용자에게 연락을 취할 수 있으며, 
                이용자가 제공한 배송지 정보가 부정확하여 배송을 완료할 수 없는 경우 회사는 이에 대한 책임을 지지 않습니다.
              </p>
              <p className="leading-relaxed">
                배송은 주문 완료 후 영업일 기준 2-3일 내에 이루어지며, 배송비는 상품 페이지에 명시된 대로 적용됩니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제7조 (취소 및 환불)</h3>
              <p className="leading-relaxed mb-2">
                이용자는 상품을 배송받은 날로부터 7일 이내에 교환 또는 반품을 요청할 수 있습니다. 
                다만, 다음 각 호의 경우에는 교환 및 반품이 불가능합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>이용자의 귀책사유로 상품이 멸실되거나 훼손된 경우</li>
                <li>상품의 사용 또는 일부 소비로 인해 상품의 가치가 현저히 감소한 경우</li>
                <li>시간이 지나 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제8조 (면책사항)</h3>
              <p className="leading-relaxed">
                회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 
                서비스 제공에 관한 책임이 면제됩니다. 또한 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 
                대하여는 책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제9조 (준거법 및 관할법원)</h3>
              <p className="leading-relaxed">
                본 약관은 대한민국 법률에 따라 규율되고 해석되며, 회사와 이용자 간에 발생한 분쟁에 대해서는 
                민사소송법상의 관할법원에 제소합니다.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                본 약관은 2025년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-pastel-pink-text text-white rounded-lg hover:bg-pastel-pink-text/90 transition-colors font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsModal

