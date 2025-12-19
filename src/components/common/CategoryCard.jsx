import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, ROUTES } from '../../constants'

const CategoryCard = memo(({ category, icon, description }) => {
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
      className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/0 via-pastel-blue/0 to-pastel-beige/0 group-hover:from-pastel-pink/10 group-hover:via-pastel-blue/10 group-hover:to-pastel-beige/10 transition-all duration-300" />
      
      {/* 컨텐츠 */}
      <div className="relative p-6 md:p-8 text-center">
        {/* 아이콘 컨테이너 */}
        <div className="mb-4 md:mb-5 flex justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-pastel-pink/20 to-pastel-blue/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span className="text-3xl md:text-4xl">{icon}</span>
          </div>
        </div>
        
        {/* 텍스트 */}
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-pastel-pink-text transition-colors duration-300">
          {category}
        </h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {/* 호버 시 화살표 */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg 
            className="w-5 h-5 mx-auto text-pastel-pink-text group-hover:translate-x-1 transition-transform duration-300" 
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




