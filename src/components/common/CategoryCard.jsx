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
      className="block bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
    >
      <div className="text-3xl md:text-4xl mb-2 md:mb-3 flex justify-center">
        <span className="text-gray-800">{icon}</span>
      </div>
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">{category}</h3>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </Link>
  )
})

CategoryCard.displayName = 'CategoryCard'

export default CategoryCard




