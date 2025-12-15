import { supabase } from './supabase'

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

