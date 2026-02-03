import { PRODUCTS } from '../data/products'

const cloneProducts = () => PRODUCTS.map((product) => ({ ...product }))

export const productApi = {
  getAllProducts: async () => {
    return cloneProducts()
  },

  getProductsByCategory: async (category) => {
    if (!category || category === 'all') {
      return cloneProducts()
    }
    return cloneProducts().filter((product) => product.category === category)
  },

  getProductById: async (id) => {
    return cloneProducts().find((product) => product.id === id) || null
  },

  getRecommendedProducts: async (limit = 6) => {
    return cloneProducts()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
  },
}
