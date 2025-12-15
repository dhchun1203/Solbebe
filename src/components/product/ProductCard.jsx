import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const { id, name, price, images, category } = product
  const mainImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x400?text=Product+Image'

  return (
    <Link 
      to={`/products/${id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 이미지 */}
      <div className="aspect-square overflow-hidden bg-pastel-beige">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 정보 */}
      <div className="p-4">
        <span className="text-xs text-pastel-pink font-medium uppercase">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
          {name}
        </h3>
        <p className="text-xl font-bold text-pastel-pink mt-2">
          {price?.toLocaleString()}원
        </p>
      </div>
    </Link>
  )
}

export default ProductCard

