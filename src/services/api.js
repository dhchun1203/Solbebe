import { supabase } from './supabase'
import { handleApiCall } from '../utils/errorHandler'
import { ERROR_MESSAGES } from '../constants'

// 공통 에러 처리 헬퍼
const handleSupabaseError = (error, defaultMessage) => {
  if (error) {
    const enhancedError = new Error(error.message || defaultMessage)
    enhancedError.originalError = error
    throw enhancedError
  }
}

// 인증 관련 API
export const authApi = {
  // 비밀번호 재설정 이메일 발송
  resetPassword: async (email) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      handleSupabaseError(error, ERROR_MESSAGES.NETWORK_ERROR)
      return data
    }, ERROR_MESSAGES.NETWORK_ERROR)
  },
  
  // 비밀번호 업데이트
  updatePassword: async (newPassword) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      handleSupabaseError(error, ERROR_MESSAGES.INVALID_PASSWORD)
      return data
    }, ERROR_MESSAGES.INVALID_PASSWORD)
  },
}

// 상품 관련 API
export const productApi = {
  // 모든 상품 조회
  getAllProducts: async () => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 카테고리별 상품 조회
  getProductsByCategory: async (category) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 상품 상세 조회
  getProductById: async (id) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      return data
    }, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
  },

  // 추천 상품 조회 (최신순 상위 N개)
  getRecommendedProducts: async (limit = 6) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 관리자: 상품 생성
  createProduct: async (product) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 관리자: 상품 수정
  updateProduct: async (id, product) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 관리자: 상품 삭제
  deleteProduct: async (id) => {
    return handleApiCall(async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      handleSupabaseError(error, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },
}

// 문의 관련 API
export const inquiryApi = {
  // 문의 생성
  createInquiry: async (inquiry) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiry])
        .select()
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.INQUIRY_CREATE_FAILED)
      return data
    }, ERROR_MESSAGES.INQUIRY_CREATE_FAILED)
  },

  // 관리자: 모든 문의 조회
  getAllInquiries: async () => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          products (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
      
      handleSupabaseError(error, ERROR_MESSAGES.INQUIRY_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.INQUIRY_LOAD_FAILED)
  },

  // 관리자: 문의 상세 조회
  getInquiryById: async (id) => {
    return handleApiCall(async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          products (
            id,
            name,
            price
          )
        `)
        .eq('id', id)
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.INQUIRY_LOAD_FAILED)
      return data
    }, ERROR_MESSAGES.INQUIRY_LOAD_FAILED)
  },
}

// 장바구니 데이터 변환 헬퍼
const transformCartItem = (item) => ({
  id: item.id,
  productId: item.product_id,
  product: item.products,
  size: item.size,
  color: item.color,
  quantity: item.quantity,
  addedAt: item.created_at,
})

// 사용자 인증 확인 헬퍼
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
  }
  return user
}

// 장바구니 관련 API
export const cartApi = {
  // 현재 사용자의 장바구니 조회
  getCartItems: async () => {
    return handleApiCall(async () => {
      const user = await getCurrentUser()

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      handleSupabaseError(error, ERROR_MESSAGES.CART_LOAD_FAILED)
      
      return data.map(transformCartItem)
    }, ERROR_MESSAGES.CART_LOAD_FAILED)
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, options = {}) => {
    return handleApiCall(async () => {
      const user = await getCurrentUser()

      // 기존 아이템 확인
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', options.size || null)
        .eq('color', options.color || null)
        .maybeSingle()

      const productSelect = `
        *,
        products (
          id,
          name,
          price,
          images,
          category
        )
      `

      if (existingItem) {
        // 이미 있으면 수량 증가
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
          .select(productSelect)
          .single()
        
        handleSupabaseError(error, ERROR_MESSAGES.CART_ADD_FAILED)
        return transformCartItem(data)
      } else {
        // 없으면 새로 추가
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            product_id: productId,
            size: options.size || null,
            color: options.color || null,
            quantity: 1,
          }])
          .select(productSelect)
          .single()
        
        handleSupabaseError(error, ERROR_MESSAGES.CART_ADD_FAILED)
        return transformCartItem(data)
      }
    }, ERROR_MESSAGES.CART_ADD_FAILED)
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItemQuantity: async (itemId, quantity) => {
    return handleApiCall(async () => {
      const user = await getCurrentUser()

      if (quantity <= 0) {
        // 수량이 0 이하면 삭제
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id)
        
        handleSupabaseError(error, ERROR_MESSAGES.CART_REMOVE_FAILED)
        return null
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            category
          )
        `)
        .single()
      
      handleSupabaseError(error, ERROR_MESSAGES.CART_UPDATE_FAILED)
      return transformCartItem(data)
    }, ERROR_MESSAGES.CART_UPDATE_FAILED)
  },

  // 장바구니 아이템 삭제
  removeFromCart: async (itemId) => {
    return handleApiCall(async () => {
      const user = await getCurrentUser()

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)
      
      handleSupabaseError(error, ERROR_MESSAGES.CART_REMOVE_FAILED)
    }, ERROR_MESSAGES.CART_REMOVE_FAILED)
  },

  // 장바구니 비우기
  clearCart: async () => {
    return handleApiCall(async () => {
      const user = await getCurrentUser()

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      
      handleSupabaseError(error, ERROR_MESSAGES.CART_CLEAR_FAILED)
    }, ERROR_MESSAGES.CART_CLEAR_FAILED)
  },
}




