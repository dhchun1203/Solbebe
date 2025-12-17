import { supabase } from './supabase'

// 인증 관련 API
export const authApi = {
  // 비밀번호 재설정 이메일 발송
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) {
      // 에러를 더 명확하게 전달하기 위해 에러 객체에 메시지 추가
      const enhancedError = new Error(error.message || '비밀번호 재설정 이메일 발송에 실패했습니다.')
      enhancedError.originalError = error
      throw enhancedError
    }
    return data
  },
  
  // 비밀번호 업데이트
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) {
      const enhancedError = new Error(error.message || '비밀번호 변경에 실패했습니다.')
      enhancedError.originalError = error
      throw enhancedError
    }
    return data
  },
}

// 상품 관련 API
export const productApi = {
  // 모든 상품 조회
  getAllProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 카테고리별 상품 조회
  getProductsByCategory: async (category) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 상품 상세 조회
  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // 추천 상품 조회 (최신순 상위 N개)
  getRecommendedProducts: async (limit = 6) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // 관리자: 상품 생성
  createProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 관리자: 상품 수정
  updateProduct: async (id, product) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 관리자: 상품 삭제
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
}

// 문의 관련 API
export const inquiryApi = {
  // 문의 생성
  createInquiry: async (inquiry) => {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 관리자: 모든 문의 조회
  getAllInquiries: async () => {
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
    
    if (error) throw error
    return data
  },

  // 관리자: 문의 상세 조회
  getInquiryById: async (id) => {
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
    
    if (error) throw error
    return data
  },
}

// 장바구니 관련 API
export const cartApi = {
  // 현재 사용자의 장바구니 조회
  getCartItems: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

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
    
    if (error) throw error
    
    // 데이터 구조 변환
    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      product: item.products,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      addedAt: item.created_at,
    }))
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, options = {}) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    // 기존 아이템 확인 (maybeSingle 사용 - 없으면 null 반환)
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('size', options.size || null)
      .eq('color', options.color || null)
      .maybeSingle()

    if (existingItem) {
      // 이미 있으면 수량 증가
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id)
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
      
      if (error) throw error
      
      return {
        id: data.id,
        productId: data.product_id,
        product: data.products,
        size: data.size,
        color: data.color,
        quantity: data.quantity,
        addedAt: data.created_at,
      }
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
      
      if (error) throw error
      
      return {
        id: data.id,
        productId: data.product_id,
        product: data.products,
        size: data.size,
        color: data.color,
        quantity: data.quantity,
        addedAt: data.created_at,
      }
    }
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItemQuantity: async (itemId, quantity) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    if (quantity <= 0) {
      // 수량이 0 이하면 삭제
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)
      
      if (error) throw error
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
    
    if (error) throw error
    
    return {
      id: data.id,
      productId: data.product_id,
      product: data.products,
      size: data.size,
      color: data.color,
      quantity: data.quantity,
      addedAt: data.created_at,
    }
  },

  // 장바구니 아이템 삭제
  removeFromCart: async (itemId) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)
    
    if (error) throw error
  },

  // 장바구니 비우기
  clearCart: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
    
    if (error) throw error
  },
}




