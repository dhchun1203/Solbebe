import { useEffect } from 'react'

const PrivacyModal = ({ isOpen, onClose }) => {
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">개인정보처리방침</h2>
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
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제1조 (개인정보의 처리목적)</h3>
              <p className="leading-relaxed mb-2">
                Solbebe(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 
                다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 
                개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>회원 가입 및 관리:</strong> 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 
                회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 목적</li>
                <li><strong>상품 주문 및 배송:</strong> 상품 주문 및 결제 처리, 배송 서비스 제공, 
                주문 내역 조회 및 관리</li>
                <li><strong>고객 문의 및 상담:</strong> 고객 문의사항 접수 및 처리, 상담 서비스 제공</li>
                <li><strong>마케팅 및 광고:</strong> 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제2조 (개인정보의 처리 및 보유기간)</h3>
              <p className="leading-relaxed mb-2">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 
                개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 
                해당 수사·조사 종료 시까지)</li>
                <li><strong>주문 정보:</strong> 주문 완료 후 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li><strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li><strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제3조 (처리하는 개인정보의 항목)</h3>
              <p className="leading-relaxed mb-2">
                회사는 다음의 개인정보 항목을 처리하고 있습니다.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">필수항목</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>이름, 이메일 주소, 전화번호</li>
                    <li>주문 정보: 배송 주소, 결제 정보</li>
                    <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">선택항목</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>생년월일, 성별</li>
                    <li>마케팅 수신 동의 시: 마케팅 정보 수신 여부</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제4조 (개인정보의 제3자 제공)</h3>
              <p className="leading-relaxed mb-2">
                회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 
                정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 
                개인정보를 제3자에게 제공합니다.
              </p>
              <p className="leading-relaxed">
                회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>배송 서비스 제공을 위해 배송업체에 배송 정보 제공 (이름, 주소, 전화번호)</li>
                <li>결제 서비스 제공을 위해 결제 대행사에 결제 정보 제공 (필요한 최소한의 정보만)</li>
                <li>법령에 의해 수사·조사 기관의 요청이 있는 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제5조 (개인정보처리의 위탁)</h3>
              <p className="leading-relaxed mb-2">
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-800">위탁업체: 배송업체</h4>
                  <p className="text-sm">위탁업무 내용: 상품 배송 서비스</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">위탁업체: 결제 대행사</h4>
                  <p className="text-sm">위탁업무 내용: 결제 처리 서비스</p>
                </div>
              </div>
              <p className="leading-relaxed mt-2">
                회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 
                기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독 및 손해배상 등에 관한 사항을 
                계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
              <p className="leading-relaxed mb-2">
                정보주체는 다음과 같은 권리를 행사할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 수집·이용·제공에 대한 동의 철회</li>
              </ul>
              <p className="leading-relaxed mt-2">
                위 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 
                회사는 이에 대해 지체 없이 조치하겠습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제7조 (개인정보의 파기)</h3>
              <p className="leading-relaxed mb-2">
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                지체 없이 해당 개인정보를 파기합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">파기절차</h4>
                  <p className="text-sm">이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 
                  내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">파기방법</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                    <li>기록물, 인쇄물, 서면 등: 분쇄하거나 소각</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제8조 (개인정보 보호책임자)</h3>
              <p className="leading-relaxed mb-2">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <h4 className="font-semibold text-gray-800">개인정보 보호책임자</h4>
                  <p className="text-sm">이메일: privacy@solbebe.com</p>
                  <p className="text-sm">전화: 1588-0000</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제9조 (개인정보의 안전성 확보조치)</h3>
              <p className="leading-relaxed mb-2">
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 
                고유식별정보 등의 암호화, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">제10조 (개인정보 처리방침 변경)</h3>
              <p className="leading-relaxed">
                이 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
                삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
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

export default PrivacyModal

