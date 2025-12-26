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
      className="group block bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
    >
      {/* 이미지 */}
      <div className="aspect-square overflow-hidden bg-pastel-beige relative">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        {/* 호버 시 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* 정보 */}
      <div className="p-3 md:p-4">
        <span className="text-xs text-pastel-pink-text font-medium uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-100 mt-1 line-clamp-2 group-hover:text-pastel-pink-text transition-colors duration-300">
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



