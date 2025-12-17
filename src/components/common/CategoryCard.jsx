import { Link } from 'react-router-dom'
import { CATEGORIES, ROUTES } from '../../constants'

const CategoryCard = ({ category, icon, description }) => {
  // 카테고리 이름으로 value 찾기
  const categoryData = CATEGORIES.find(cat => cat.name === category)
  const categoryValue = categoryData?.value || category.toLowerCase()

  return (
    <Link
      to={`${ROUTES.PRODUCTS}?category=${categoryValue}`}
      className="block bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
    >
      <div className="text-3xl md:text-4xl mb-2 md:mb-3 flex justify-center">
        <span className="text-gray-800">{icon}</span>
      </div>
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">{category}</h3>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </Link>
  )
}

export default CategoryCard




