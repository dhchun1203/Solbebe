import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, ROUTES } from '../../constants'

const CategoryCard = memo(({ category, description, bgImage }) => {
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
      {/* 배경 이미지 (블러 처리) */}
      {bgImage && (
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt={category}
            className="w-full h-full object-cover blur-sm scale-110 group-hover:scale-115 transition-transform duration-500"
            loading="lazy"
          />
          {/* 어두운 오버레이 (텍스트 가독성 향상) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 group-hover:from-black/50 group-hover:via-black/40 group-hover:to-black/60 transition-all duration-300" />
        </div>
      )}
      
      {/* 배경 그라데이션 효과 (이미지 없을 때 대체) */}
      {!bgImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/0 via-pastel-blue/0 to-pastel-beige/0 group-hover:from-pastel-pink/10 group-hover:via-pastel-blue/10 group-hover:to-pastel-beige/10 transition-all duration-300" />
      )}
      
      {/* 컨텐츠 */}
      <div className="relative p-6 md:p-8 text-center z-10 flex flex-col justify-center min-h-[200px] md:min-h-[240px]">
        {/* 텍스트 */}
        <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-3 transition-colors duration-300 ${
          bgImage 
            ? 'text-white drop-shadow-lg group-hover:text-pastel-pink-text' 
            : 'text-gray-800 dark:text-gray-100 group-hover:text-pastel-pink-text'
        }`}>
          {category}
        </h3>
        <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${
          bgImage 
            ? 'text-white/90 drop-shadow-md' 
            : 'text-gray-600 dark:text-gray-300'
        }`}>
          {description}
        </p>
        
        {/* 호버 시 화살표 */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg 
            className={`w-5 h-5 mx-auto group-hover:translate-x-1 transition-transform duration-300 ${
              bgImage 
                ? 'text-white drop-shadow-lg' 
                : 'text-pastel-pink-text'
            }`}
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




