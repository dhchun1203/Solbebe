import { Link } from 'react-router-dom'

const InquirySuccess = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        {/* 체크 아이콘 */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-pastel-pink rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          문의가 정상적으로 접수되었습니다!
        </h1>
        <p className="text-gray-600 mb-8">
          입력해주신 연락처로 빠른 시일 내에 답변 드리겠습니다.
          감사합니다.
        </p>

        {/* 홈으로 돌아가기 버튼 */}
        <Link
          to="/"
          className="inline-block bg-pastel-pink text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default InquirySuccess



