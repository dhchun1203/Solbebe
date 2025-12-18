import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatPriceWithUnit } from '../../utils/formatters'
import { ROUTES } from '../../constants'

const ProductCard = memo(({ product }) => {
  const { id, name, price, images, category } = product
  
  // 메인 이미지 메모이제이션
  const mainImage = useMemo(() => {
    return images && images.length > 0 
      ? images[0] 
      : 'https://via.placeholder.com/400x400?text=Product+Image'
  }, [images])

  // 포맷된 가격 메모이제이션
  const formattedPrice = useMemo(() => formatPriceWithUnit(price), [price])

  return (
    <Link 
      to={`${ROUTES.PRODUCTS}/${id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 이미지 */}
      <div className="aspect-square overflow-hidden bg-pastel-beige">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 정보 */}
      <div className="p-3 md:p-4">
        <span className="text-xs text-pastel-pink-text font-medium uppercase">
          {category}
        </span>
        <h3 className="text-sm md:text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
          {name}
        </h3>
        <p className="text-base md:text-xl font-medium text-pastel-pink-text mt-2">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard



