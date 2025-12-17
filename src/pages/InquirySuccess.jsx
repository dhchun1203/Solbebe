import { Link } from 'react-router-dom'

const InquirySuccess = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto text-center">
        {/* 체크 아이콘 */}
        <div className="mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-pastel-pink rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 성공 메시지 */}
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4 px-2">
          문의가 정상적으로 접수되었습니다!
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 px-2">
          입력해주신 연락처로 빠른 시일 내에 답변 드리겠습니다.
          감사합니다.
        </p>

        {/* 홈으로 돌아가기 버튼 */}
        <Link
          to="/"
          className="inline-block bg-pastel-pink text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default InquirySuccess






