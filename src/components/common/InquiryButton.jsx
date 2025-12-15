import { Link } from 'react-router-dom'

const InquiryButton = ({ productId, className = '' }) => {
  return (
    <Link
      to={`/inquiry?productId=${productId}`}
      className={`block w-full bg-pastel-pink text-white text-center py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg ${className}`}
    >
      구매 문의하기
    </Link>
  )
}

export default InquiryButton

