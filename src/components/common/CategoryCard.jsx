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
      className="block bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{category}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}

export default CategoryCard

