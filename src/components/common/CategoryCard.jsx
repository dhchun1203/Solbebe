import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, ROUTES } from '../../constants'

// 카테고리별 SVG 아이콘 컴포넌트
// 무료 SVG 아이콘 사이트에서 가져온 아이콘을 사용할 수 있습니다:
// - Heroicons: https://heroicons.com/
// - Lucide Icons: https://lucide.dev/
// - Feather Icons: https://feathericons.com/
// - Iconoir: https://iconoir.com/
const CategoryIcon = ({ category }) => {
  const iconProps = {
    className: "w-24 h-24 md:w-32 md:h-32 transition-all duration-300 group-hover:scale-110",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }

  switch (category) {
    case '상의':
      return (
        <svg {...iconProps} className={`${iconProps.className} text-pastel-pink-text`}>
          {/* 모자 아이콘 */}
          <path d="M6 4H9C9 4 9 7 12 7C15 7 15 4 15 4H18M18 11V19.4C18 19.7314 17.7314 20 17.4 20H6.6C6.26863 20 6 19.7314 6 19.4L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 4L22.4429 5.77717C22.7506 5.90023 22.9002 6.24942 22.7772 6.55709L21.1509 10.6228C21.0597 10.8506 20.8391 11 20.5938 11H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.99993 4L1.55701 5.77717C1.24934 5.90023 1.09969 6.24942 1.22276 6.55709L2.84906 10.6228C2.94018 10.8506 3.1608 11 3.40615 11H5.99993" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case '하의':
      return (
        <svg {...iconProps} className={`${iconProps.className} text-pastel-blue-text`}>
          {/* 바지 아이콘 */}
          <path d="M5.03518 3.63328C5.01608 3.28936 5.28981 3 5.63426 3H18.3657C18.7102 3 18.9839 3.28936 18.9648 3.63328L18.0315 20.4333C18.0138 20.7512 17.7508 21 17.4324 21H14.5335C14.2293 21 13.9732 20.7723 13.9377 20.4701L12.5959 9.06507C12.5128 8.35854 11.4872 8.35854 11.4041 9.06507L10.0623 20.4701C10.0268 20.7723 9.7707 21 9.46645 21H6.56759C6.24915 21 5.98618 20.7512 5.96852 20.4333L5.03518 3.63328Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 7.5H6.5C7.60457 7.5 8.5 6.60457 8.5 5.5V3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18.5 7.5H17.5C16.3954 7.5 15.5 6.60457 15.5 5.5V3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case '원피스':
      return (
        <svg {...iconProps} className={`${iconProps.className} text-pastel-pink-text`}>
          {/* 원피스 아이콘 */}
          <path d="M18 21H6C6 21 7.66042 16.1746 7.5 13C7.3995 11.0112 5.97606 9.92113 6.5 8C6.72976 7.15753 7.5 6 7.5 6C7.5 6 9 7 12 7C15 7 16.5 6 16.5 6C16.5 6 17.2702 7.15753 17.5 8C18.0239 9.92113 16.6005 11.0112 16.5 13C16.3396 16.1746 18 21 18 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.49988 6.00002V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 6.00002V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case '악세서리':
      return (
        <svg {...iconProps} className={`${iconProps.className} text-pastel-beige-text`}>
          {/* 티셔츠 아이콘 */}
          <path d="M7 17V15C7 11.134 10.134 8 14 8C17.866 8 21 11.134 21 15V17H7ZM7 17H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 6.01L14.01 5.99889" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps} className={`${iconProps.className} text-pastel-pink-text`}>
          {/* 기본 상자 아이콘 */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
  }
}

const CategoryCard = memo(({ category, description }) => {
  // 카테고리 value 메모이제이션
  const categoryValue = useMemo(() => {
    const categoryData = CATEGORIES.find(cat => cat.name === category)
    return categoryData?.value || category.toLowerCase()
  }, [category])

  // 링크 URL 메모이제이션
  const linkUrl = useMemo(() => `${ROUTES.PRODUCTS}?category=${categoryValue}`, [categoryValue])

  return (
    <Link
      to={linkUrl}
      className="group relative block bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/5 via-pastel-blue/5 to-pastel-beige/5 group-hover:from-pastel-pink/10 group-hover:via-pastel-blue/10 group-hover:to-pastel-beige/10 transition-all duration-300" />
      
      {/* 컨텐츠 */}
      <div className="relative p-6 md:p-8 text-center z-10 flex flex-col justify-center items-center min-h-[200px] md:min-h-[240px]">
        {/* SVG 아이콘 (메인) */}
        <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <CategoryIcon category={category} />
        </div>
        
        {/* 텍스트 */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 transition-colors duration-300 text-gray-800 dark:text-gray-100 group-hover:text-pastel-pink-text">
          {category}
        </h3>
        <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </p>
        
        {/* 호버 시 화살표 */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg 
            className="w-5 h-5 mx-auto group-hover:translate-x-1 transition-transform duration-300 text-pastel-pink-text"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
})

CategoryCard.displayName = 'CategoryCard'

export default CategoryCard
