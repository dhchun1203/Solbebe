import { Link } from 'react-router-dom'

const CategoryCard = ({ category, icon, description }) => {
  const categoryMap = {
    '상의': 'top',
    '하의': 'bottom',
    '원피스': 'dress',
    '악세서리': 'accessory',
  }

  const categoryValue = categoryMap[category] || category.toLowerCase()

  return (
    <Link
      to={`/products?category=${categoryValue}`}
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




