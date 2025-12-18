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
      if (import.meta.env.DEV) {
        console.log('📦 getAllProducts 호출')
        console.log('📦 Supabase URL:', supabase.supabaseUrl)
        console.log('📦 Supabase Key 존재:', !!supabase.supabaseKey)
      }
      
      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        const testUrl = `${supabase.supabaseUrl}/rest/v1/products?select=*&order=created_at.desc`
        
        if (import.meta.env.DEV) {
          console.log('📦 직접 fetch 테스트 시작...')
          console.log('📦 요청 URL:', testUrl)
        }
        
        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📦 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 성공! 데이터 개수:', data?.length || 0)
        }
        
        return data || []
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📦 쿼리 실행 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 카테고리별 상품 조회
  getProductsByCategory: async (category) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📦 getProductsByCategory 호출:', { category })
        console.log('📦 Supabase URL:', supabase.supabaseUrl)
        console.log('📦 Supabase Key 존재:', !!supabase.supabaseKey)
      }
      
      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        const testUrl = `${supabase.supabaseUrl}/rest/v1/products?category=eq.${encodeURIComponent(category)}&select=*&order=created_at.desc`
        
        if (import.meta.env.DEV) {
          console.log('📦 직접 fetch 테스트 시작...')
          console.log('📦 요청 URL:', testUrl)
        }
        
        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📦 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 성공! 데이터 개수:', data?.length || 0)
        }
        
        return data || []
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📦 쿼리 실행 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.PRODUCT_LOAD_FAILED)
  },

  // 상품 상세 조회
  getProductById: async (id) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📦 getProductById 호출:', { id })
        console.log('📦 Supabase URL:', supabase.supabaseUrl)
        console.log('📦 Supabase Key 존재:', !!supabase.supabaseKey)
      }
      
      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        const testUrl = `${supabase.supabaseUrl}/rest/v1/products?id=eq.${id}&select=*`
        
        if (import.meta.env.DEV) {
          console.log('📦 직접 fetch 테스트 시작...')
          console.log('📦 요청 URL:', testUrl)
        }
        
        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
          console.log('📦 Fetch 응답 헤더:', Object.fromEntries(fetchResponse.headers.entries()))
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📦 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 성공! 데이터:', data)
          console.log('📦 데이터 개수:', data?.length || 0)
        }
        
        // single()과 동일하게 첫 번째 항목만 반환
        if (Array.isArray(data) && data.length > 0) {
          return data[0]
        }
        
        if (Array.isArray(data) && data.length === 0) {
          throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
        }
        
        return data
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📦 쿼리 실행 중 예외 발생:', err)
          console.error('📦 해결 방법:')
          console.error('1. Supabase 대시보드 → Table Editor → products 테이블')
          console.error('2. 우측 상단 "..." → "Edit RLS policies"')
          console.error('3. RLS가 활성화되어 있다면 "New Policy" 클릭')
          console.error('4. Policy name: "Public products are viewable by everyone"')
          console.error('5. Allowed operation: SELECT')
          console.error('6. Policy definition: true')
          console.error('또는 SQL Editor에서 실행: ALTER TABLE products DISABLE ROW LEVEL SECURITY;')
        }
        throw err
      }
    }, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
  },

  // 추천 상품 조회 (최신순 상위 N개)
  getRecommendedProducts: async (limit = 6) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📦 getRecommendedProducts 호출:', { limit })
        console.log('📦 Supabase URL:', supabase.supabaseUrl)
        console.log('📦 Supabase Key 존재:', !!supabase.supabaseKey)
      }
      
      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        const testUrl = `${supabase.supabaseUrl}/rest/v1/products?select=*&order=created_at.desc&limit=${limit}`
        
        if (import.meta.env.DEV) {
          console.log('📦 직접 fetch 테스트 시작...')
          console.log('📦 요청 URL:', testUrl)
        }
        
        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
          console.log('📦 Fetch 응답 헤더:', Object.fromEntries(fetchResponse.headers.entries()))
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📦 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 성공! 데이터:', data)
          console.log('📦 데이터 개수:', data?.length || 0)
        }
        
        return data || []
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📦 쿼리 실행 중 예외 발생:', err)
          console.error('📦 해결 방법:')
          console.error('1. Supabase 대시보드 → Table Editor → products 테이블')
          console.error('2. 우측 상단 "..." → "Edit RLS policies"')
          console.error('3. RLS가 활성화되어 있다면 "New Policy" 클릭')
          console.error('4. Policy name: "Public products are viewable by everyone"')
          console.error('5. Allowed operation: SELECT')
          console.error('6. Policy definition: true')
          console.error('또는 SQL Editor에서 실행: ALTER TABLE products DISABLE ROW LEVEL SECURITY;')
        }
        throw err
      }
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
      if (import.meta.env.DEV) {
        console.log('📝 createInquiry 호출:', inquiry)
        console.log('📝 Supabase URL:', supabase.supabaseUrl)
        console.log('📝 Supabase Key 존재:', !!supabase.supabaseKey)
      }

      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        const testUrl = `${supabase.supabaseUrl}/rest/v1/inquiries`
        
        if (import.meta.env.DEV) {
          console.log('📝 직접 fetch 테스트 시작...')
          console.log('📝 요청 URL:', testUrl)
          console.log('📝 요청 데이터:', JSON.stringify(inquiry, null, 2))
        }

        // Supabase REST API는 배열을 받아야 함
        const fetchPromise = fetch(testUrl, {
          method: 'POST',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify([inquiry]) // 배열로 감싸기
        })

        const fetchTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('문의 생성 타임아웃')), 10000)
        })

        const fetchResponse = await Promise.race([fetchPromise, fetchTimeout])

        if (import.meta.env.DEV) {
          console.log('📝 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📝 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }

        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📝 Fetch 성공! 생성된 문의:', data)
        }

        // 배열로 반환되는 경우 첫 번째 항목 반환
        return Array.isArray(data) ? data[0] : data
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📝 문의 생성 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.INQUIRY_CREATE_FAILED)
  },

  // 사용자: 내 문의 조회 (이메일 또는 user_id로 필터링)
  getUserInquiries: async (email, userId = null) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📝 getUserInquiries 호출:', { email, userId })
        console.log('📝 Supabase URL:', supabase.supabaseUrl)
        console.log('📝 Supabase Key 존재:', !!supabase.supabaseKey)
      }

      try {
        // user_id가 있으면 user_id로 필터링, 없으면 email로 필터링
        let testUrl
        if (userId) {
          testUrl = `${supabase.supabaseUrl}/rest/v1/inquiries?user_id=eq.${userId}&select=*&order=created_at.desc`
        } else if (email) {
          testUrl = `${supabase.supabaseUrl}/rest/v1/inquiries?email=eq.${encodeURIComponent(email)}&select=*&order=created_at.desc`
        } else {
          throw new Error('이메일 또는 사용자 ID가 필요합니다.')
        }
        
        if (import.meta.env.DEV) {
          console.log('📝 직접 fetch 테스트 시작...')
          console.log('📝 요청 URL:', testUrl)
        }

        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })

        if (import.meta.env.DEV) {
          console.log('📝 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📝 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }

        let inquiries = await fetchResponse.json()

        if (import.meta.env.DEV) {
          console.log('📝 Fetch 성공! 문의 개수:', inquiries?.length || 0)
        }

        // products 조인이 실패할 수 있으므로, 수동으로 조인 처리
        if (inquiries && inquiries.length > 0) {
          const productIds = [...new Set(inquiries.map(i => i.product_id).filter(Boolean))]
          
          if (productIds.length > 0) {
            const productsUrl = `${supabase.supabaseUrl}/rest/v1/products?select=id,name,price,images,category&id=in.(${productIds.join(',')})`
            
            const productsResponse = await fetch(productsUrl, {
              method: 'GET',
              headers: {
                'apikey': supabase.supabaseKey,
                'Authorization': `Bearer ${supabase.supabaseKey}`,
                'Content-Type': 'application/json'
              }
            })

            if (productsResponse.ok) {
              const products = await productsResponse.json()
              const productMap = new Map(products.map(p => [p.id, p]))
              
              inquiries = inquiries.map(inquiry => ({
                ...inquiry,
                product: productMap.get(inquiry.product_id) || null
              }))
            }
          }
        }

        return inquiries || []
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📝 문의 조회 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.INQUIRY_LOAD_FAILED)
  },

  // 관리자: 모든 문의 조회
  getAllInquiries: async () => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📦 getAllInquiries 호출')
        console.log('📦 Supabase URL:', supabase.supabaseUrl)
        console.log('📦 Supabase Key 존재:', !!supabase.supabaseKey)
      }
      
      try {
        // 직접 fetch로 테스트 (Supabase 클라이언트 우회)
        // 조인을 사용하려면 특별한 쿼리 형식이 필요하므로, 먼저 inquiries만 가져옴
        const testUrl = `${supabase.supabaseUrl}/rest/v1/inquiries?select=*&order=created_at.desc`
        
        if (import.meta.env.DEV) {
          console.log('📦 직접 fetch 테스트 시작...')
          console.log('📦 요청 URL:', testUrl)
        }
        
        const fetchResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('📦 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const inquiries = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('📦 Fetch 성공! 문의 개수:', inquiries?.length || 0)
        }
        
        // product_id가 있으면 products 정보를 별도로 조회
        if (inquiries && inquiries.length > 0) {
          const productIds = inquiries
            .map(inq => inq.product_id)
            .filter(id => id)
            .filter((id, index, self) => self.indexOf(id) === index) // 중복 제거
          
          if (productIds.length > 0) {
            try {
              const productsUrl = `${supabase.supabaseUrl}/rest/v1/products?select=id,name&id=in.(${productIds.join(',')})`
              const productsResponse = await fetch(productsUrl, {
                method: 'GET',
                headers: {
                  'apikey': supabase.supabaseKey,
                  'Authorization': `Bearer ${supabase.supabaseKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                }
              })
              
              if (productsResponse.ok) {
                const products = await productsResponse.json()
                const productsMap = new Map(products.map(p => [p.id, p]))
                
                // inquiries에 products 정보 추가
                inquiries.forEach(inquiry => {
                  if (inquiry.product_id && productsMap.has(inquiry.product_id)) {
                    inquiry.products = productsMap.get(inquiry.product_id)
                  }
                })
              }
            } catch (productError) {
              console.warn('📦 상품 정보 조회 실패 (무시):', productError)
            }
          }
        }
        
        return inquiries || []
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📦 쿼리 실행 중 예외 발생:', err)
        }
        throw err
      }
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

  // 관리자: 문의 상태 업데이트
  updateInquiryStatus: async (id, status) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('📝 updateInquiryStatus 호출:', { id, status })
      }

      try {
        const testUrl = `${supabase.supabaseUrl}/rest/v1/inquiries?id=eq.${id}`
        
        const fetchResponse = await fetch(testUrl, {
          method: 'PATCH',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ status })
        })

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`)
        }

        const data = await fetchResponse.json()
        return Array.isArray(data) ? data[0] : data
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('📝 문의 상태 업데이트 중 예외 발생:', err)
        }
        throw err
      }
    }, '문의 상태 업데이트에 실패했습니다.')
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
  try {
    // getSession을 사용 (타임아웃 포함)
    const sessionPromise = supabase.auth.getSession()
    const sessionTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('세션 조회 타임아웃')), 2000)
    })
    
    const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout])
    if (!session || !session.user) {
      throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
    }
    return session.user
  } catch (error) {
    // getSession 실패 시 localStorage에서 직접 가져오기 시도
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 getSession 실패, localStorage에서 시도...')
      }
      
      // authStore의 localStorage에서 user 정보 가져오기
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const authData = JSON.parse(authStorage)
        const user = authData?.state?.user
        if (user && user.id) {
          if (import.meta.env.DEV) {
            console.log('🔄 localStorage에서 user 정보 가져옴:', user.id)
          }
          return user
        }
      }
      
      throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
    } catch (err) {
      if (err.message === ERROR_MESSAGES.LOGIN_REQUIRED) {
        throw err
      }
      // localStorage도 실패하면 getUser 시도 (타임아웃 포함)
      try {
        const getUserPromise = supabase.auth.getUser()
        const getUserTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('사용자 정보 조회 타임아웃')), 2000)
        })
        
        const { data: { user } } = await Promise.race([getUserPromise, getUserTimeout])
        if (!user) {
          throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
        }
        return user
      } catch (getUserErr) {
        if (getUserErr.message === '사용자 정보 조회 타임아웃') {
          throw new Error('사용자 정보 조회에 시간이 오래 걸립니다. 다시 시도해주세요.')
        }
        throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
      }
    }
  }
}

// 장바구니 관련 API
export const cartApi = {
  // 현재 사용자의 장바구니 조회
  getCartItems: async () => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('🛒 getCartItems 호출 시작...')
      }

      try {
        // 사용자 정보 가져오기
        const user = await getCurrentUser()
        
        if (import.meta.env.DEV) {
          console.log('🛒 사용자 ID:', user.id)
        }

        // 세션에서 액세스 토큰 가져오기 (타임아웃 포함)
        let session = null
        try {
          const sessionPromise = supabase.auth.getSession()
          const sessionTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('세션 조회 타임아웃')), 2000)
          })
          const result = await Promise.race([sessionPromise, sessionTimeout])
          session = result.data?.session
        } catch (sessionError) {
          // getSession 실패 시 localStorage에서 직접 가져오기
          if (import.meta.env.DEV) {
            console.log('🔄 getSession 실패, localStorage에서 세션 정보 가져오기 시도...')
          }
          
          const authStorage = localStorage.getItem('auth-storage')
          if (authStorage) {
            try {
              const authData = JSON.parse(authStorage)
              session = authData?.state?.session
            } catch (e) {
              console.warn('localStorage 파싱 실패:', e)
            }
          }
        }
        
        if (!session || !session.access_token) {
          throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
        }

        // 직접 fetch로 조회 (인증 토큰 포함, 타임아웃 포함)
        const cartUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?select=*,products(id,name,price,images,category)&user_id=eq.${user.id}&order=created_at.desc`
        
        if (import.meta.env.DEV) {
          console.log('🛒 직접 fetch 시작...')
          console.log('🛒 요청 URL:', cartUrl)
        }
        
        const fetchPromise = fetch(cartUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        const fetchTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('장바구니 조회 타임아웃')), 5000)
        })
        
        const fetchResponse = await Promise.race([fetchPromise, fetchTimeout])
        
        if (import.meta.env.DEV) {
          console.log('🛒 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
        }
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('🛒 Fetch 에러 응답:', errorText)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
        }
        
        const data = await fetchResponse.json()
        
        if (import.meta.env.DEV) {
          console.log('🛒 Fetch 성공! 장바구니 아이템 개수:', data?.length || 0)
        }
        
        return (data || []).map(transformCartItem)
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('🛒 장바구니 조회 중 예외 발생:', err)
        }
        // 에러가 발생해도 빈 배열 반환 (로딩 종료를 위해)
        return []
      }
    }, ERROR_MESSAGES.CART_LOAD_FAILED)
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, options = {}) => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('🛒 addToCart 호출:', { productId, options })
      }

      try {
        // 사용자 정보 가져오기
        const user = await getCurrentUser()

        // 세션에서 액세스 토큰 가져오기 (타임아웃 포함)
        let session = null
        try {
          const sessionPromise = supabase.auth.getSession()
          const sessionTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('세션 조회 타임아웃')), 2000)
          })
          const result = await Promise.race([sessionPromise, sessionTimeout])
          session = result.data?.session
        } catch (sessionError) {
          // getSession 실패 시 localStorage에서 직접 가져오기
          if (import.meta.env.DEV) {
            console.log('🔄 getSession 실패, localStorage에서 세션 정보 가져오기 시도...')
          }
          
          const authStorage = localStorage.getItem('auth-storage')
          if (authStorage) {
            try {
              const authData = JSON.parse(authStorage)
              session = authData?.state?.session
            } catch (e) {
              console.warn('localStorage 파싱 실패:', e)
            }
          }
        }
        
        if (!session || !session.access_token) {
          throw new Error(ERROR_MESSAGES.LOGIN_REQUIRED)
        }

        // 기존 아이템 확인 (직접 fetch)
        // size와 color가 null일 때는 쿼리에서 제외
        let checkUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?select=*&user_id=eq.${user.id}&product_id=eq.${productId}`
        if (options.size) {
          checkUrl += `&size=eq.${encodeURIComponent(options.size)}`
        } else {
          checkUrl += `&size=is.null`
        }
        if (options.color) {
          checkUrl += `&color=eq.${encodeURIComponent(options.color)}`
        } else {
          checkUrl += `&color=is.null`
        }
        
        if (import.meta.env.DEV) {
          console.log('🛒 기존 아이템 확인:', checkUrl)
        }

        const checkPromise = fetch(checkUrl, {
          method: 'GET',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        })
        
        const checkTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('기존 아이템 확인 타임아웃')), 3000)
        })
        
        const checkResponse = await Promise.race([checkPromise, checkTimeout])
        const existingItems = checkResponse.ok ? await checkResponse.json() : []
        const existingItem = existingItems && existingItems.length > 0 ? existingItems[0] : null

        if (existingItem) {
          // 이미 있으면 수량 증가
          if (import.meta.env.DEV) {
            console.log('🛒 기존 아이템 수량 증가:', existingItem.id)
          }

          const updateUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?id=eq.${existingItem.id}`
          const updateData = { quantity: existingItem.quantity + 1 }
          
          const updatePromise = fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(updateData)
          })
          
          const updateTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('수량 업데이트 타임아웃')), 3000)
          })
          
          const updateResponse = await Promise.race([updatePromise, updateTimeout])
          
          if (!updateResponse.ok) {
            throw new Error(`HTTP ${updateResponse.status}: ${updateResponse.statusText}`)
          }

          // 업데이트된 아이템 조회 (products 정보 포함)
          const getUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?select=*,products(id,name,price,images,category)&id=eq.${existingItem.id}`
          const getResponse = await fetch(getUrl, {
            method: 'GET',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          })
          
          const updatedItems = await getResponse.json()
          const updatedItem = updatedItems && updatedItems.length > 0 ? updatedItems[0] : null
          
          if (import.meta.env.DEV) {
            console.log('🛒 수량 증가 성공')
          }
          
          return transformCartItem(updatedItem || { ...existingItem, quantity: existingItem.quantity + 1 })
        } else {
          // 없으면 새로 추가
          if (import.meta.env.DEV) {
            console.log('🛒 새 아이템 추가')
          }

          const insertUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?select=*,products(id,name,price,images,category)`
          const insertData = {
            user_id: user.id,
            product_id: productId,
            size: options.size || null,
            color: options.color || null,
            quantity: 1,
          }
          
          const insertPromise = fetch(insertUrl, {
            method: 'POST',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(insertData)
          })
          
          const insertTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('아이템 추가 타임아웃')), 3000)
          })
          
          const insertResponse = await Promise.race([insertPromise, insertTimeout])
          
          if (!insertResponse.ok) {
            const errorText = await insertResponse.text()
            if (import.meta.env.DEV) {
              console.error('🛒 추가 실패:', errorText)
            }
            throw new Error(`HTTP ${insertResponse.status}: ${insertResponse.statusText}`)
          }

          const newItems = await insertResponse.json()
          const newItem = newItems && newItems.length > 0 ? newItems[0] : null
          
          if (import.meta.env.DEV) {
            console.log('🛒 추가 성공')
          }
          
          return transformCartItem(newItem)
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('🛒 장바구니 추가 중 예외 발생:', err)
        }
        throw err
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
      if (import.meta.env.DEV) {
        console.log('🛒 removeFromCart 호출:', itemId)
      }

      try {
        // 사용자 정보 및 세션 가져오기
        const user = await getCurrentUser()
        if (!user || !user.id) {
          throw new Error('사용자 정보를 가져올 수 없습니다.')
        }

        // 세션에서 access_token 가져오기 (여러 방법 시도)
        let accessToken = supabase.supabaseKey // 기본값: anon key
        
        try {
          // 방법 1: getSession 시도
          const sessionPromise = supabase.auth.getSession()
          const sessionTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('세션 조회 타임아웃')), 2000)
          })
          
          const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout])
          if (session?.access_token) {
            accessToken = session.access_token
            if (import.meta.env.DEV) {
              console.log('🛒 getSession에서 토큰 가져옴')
            }
          }
        } catch (sessionError) {
          // 방법 2: localStorage에서 직접 가져오기
          try {
            // Supabase는 sb-{project-ref}-auth-token 형식으로 저장
            const supabaseUrl = supabase.supabaseUrl
            const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
            const tokenKey = `sb-${projectRef}-auth-token`
            
            const tokenData = localStorage.getItem(tokenKey)
            if (tokenData) {
              const parsed = JSON.parse(tokenData)
              if (parsed?.access_token) {
                accessToken = parsed.access_token
                if (import.meta.env.DEV) {
                  console.log('🛒 localStorage에서 토큰 가져옴')
                }
              }
            }
          } catch (localStorageError) {
            // 방법 3: authStore의 localStorage 확인
            try {
              const authStorage = localStorage.getItem('auth-storage')
              if (authStorage) {
                const authData = JSON.parse(authStorage)
                const session = authData?.state?.session
                if (session?.access_token) {
                  accessToken = session.access_token
                  if (import.meta.env.DEV) {
                    console.log('🛒 authStore에서 토큰 가져옴')
                  }
                }
              }
            } catch (authStoreError) {
              if (import.meta.env.DEV) {
                console.warn('🛒 모든 토큰 조회 방법 실패, anon key 사용')
              }
            }
          }
        }
        
        if (import.meta.env.DEV) {
          console.log('🛒 사용할 토큰:', accessToken === supabase.supabaseKey ? 'anon key' : 'access_token')
        }

        // 직접 fetch로 삭제
        const testUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?id=eq.${itemId}&user_id=eq.${user.id}`
        
        if (import.meta.env.DEV) {
          console.log('🛒 직접 fetch 테스트 시작...')
          console.log('🛒 요청 URL:', testUrl)
        }

        const fetchPromise = fetch(testUrl, {
          method: 'DELETE',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        })

        const fetchTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('장바구니 삭제 타임아웃')), 10000)
        })

        const fetchResponse = await Promise.race([fetchPromise, fetchTimeout])

        if (import.meta.env.DEV) {
          console.log('🛒 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
          console.log('🛒 Fetch 응답 헤더:', Object.fromEntries(fetchResponse.headers.entries()))
        }

        // DELETE 요청은 204 No Content 또는 200 OK를 반환할 수 있음
        if (!fetchResponse.ok && fetchResponse.status !== 204) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('🛒 Fetch 에러 응답:', errorText)
            console.error('🛒 사용자 ID:', user.id)
            console.error('🛒 아이템 ID:', itemId)
            console.error('🛒 Access Token 존재:', !!accessToken)
            console.error('🛒 Access Token이 anon key와 다른가:', accessToken !== supabase.supabaseKey)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${errorText || fetchResponse.statusText}`)
        }

        // 삭제가 실제로 되었는지 확인 (항상 확인, access_token 사용)
        try {
          // 잠시 대기 후 확인 (DB 반영 시간 고려)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const verifyUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?id=eq.${itemId}&user_id=eq.${user.id}&select=id`
          const verifyResponse = await fetch(verifyUrl, {
            method: 'GET',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${accessToken}`, // access_token 사용 (RLS 정책 통과)
              'Content-Type': 'application/json'
            }
          })
          
          if (verifyResponse.ok) {
            const remainingItems = await verifyResponse.json()
            if (remainingItems && remainingItems.length > 0) {
              const errorMsg = `장바구니 아이템 삭제가 실제로 반영되지 않았습니다. (RLS 정책 확인 필요)`
              console.error(`🛒 ❌ 삭제 실패: 장바구니에 아이템이 여전히 존재합니다!`)
              console.error('🛒 남아있는 아이템:', remainingItems)
              console.error('🛒 사용자 ID:', user.id)
              console.error('🛒 아이템 ID:', itemId)
              console.error('🛒 Access Token 사용:', accessToken !== supabase.supabaseKey)
              throw new Error(errorMsg)
            } else {
              if (import.meta.env.DEV) {
                console.log('🛒 ✅ 삭제 확인 완료 (아이템이 삭제됨)')
              }
            }
          } else {
            const errorText = await verifyResponse.text()
            console.warn('🛒 삭제 확인 요청 실패:', verifyResponse.status, errorText)
            // 확인 요청 실패는 삭제 실패로 간주하지 않음 (네트워크 문제일 수 있음)
          }
        } catch (verifyError) {
          if (verifyError.message.includes('삭제가 실제로 반영되지 않았습니다')) {
            throw verifyError
          }
          // 다른 에러는 무시 (확인 실패는 삭제 실패가 아님)
          if (import.meta.env.DEV) {
            console.warn('🛒 장바구니 삭제 확인 중 오류 (무시):', verifyError)
          }
        }

        if (import.meta.env.DEV) {
          console.log('🛒 장바구니 아이템 삭제 성공')
        }

        return { success: true }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('🛒 장바구니 삭제 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.CART_REMOVE_FAILED)
  },

  // 장바구니 비우기
  clearCart: async () => {
    return handleApiCall(async () => {
      if (import.meta.env.DEV) {
        console.log('🛒 clearCart 호출')
      }

      try {
        // 사용자 정보 및 세션 가져오기
        const user = await getCurrentUser()
        if (!user || !user.id) {
          throw new Error('사용자 정보를 가져올 수 없습니다.')
        }

        // 세션에서 access_token 가져오기 (여러 방법 시도)
        let accessToken = supabase.supabaseKey // 기본값: anon key
        
        try {
          // 방법 1: getSession 시도
          const sessionPromise = supabase.auth.getSession()
          const sessionTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('세션 조회 타임아웃')), 2000)
          })
          
          const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout])
          if (session?.access_token) {
            accessToken = session.access_token
            if (import.meta.env.DEV) {
              console.log('🛒 getSession에서 토큰 가져옴')
            }
          }
        } catch (sessionError) {
          // 방법 2: localStorage에서 직접 가져오기
          try {
            // Supabase는 sb-{project-ref}-auth-token 형식으로 저장
            const supabaseUrl = supabase.supabaseUrl
            const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
            const tokenKey = `sb-${projectRef}-auth-token`
            
            const tokenData = localStorage.getItem(tokenKey)
            if (tokenData) {
              const parsed = JSON.parse(tokenData)
              if (parsed?.access_token) {
                accessToken = parsed.access_token
                if (import.meta.env.DEV) {
                  console.log('🛒 localStorage에서 토큰 가져옴')
                }
              }
            }
          } catch (localStorageError) {
            // 방법 3: authStore의 localStorage 확인
            try {
              const authStorage = localStorage.getItem('auth-storage')
              if (authStorage) {
                const authData = JSON.parse(authStorage)
                const session = authData?.state?.session
                if (session?.access_token) {
                  accessToken = session.access_token
                  if (import.meta.env.DEV) {
                    console.log('🛒 authStore에서 토큰 가져옴')
                  }
                }
              }
            } catch (authStoreError) {
              if (import.meta.env.DEV) {
                console.warn('🛒 모든 토큰 조회 방법 실패, anon key 사용')
              }
            }
          }
        }
        
        if (import.meta.env.DEV) {
          console.log('🛒 사용할 토큰:', accessToken === supabase.supabaseKey ? 'anon key' : 'access_token')
        }

        // 직접 fetch로 전체 삭제
        const testUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?user_id=eq.${user.id}`
        
        if (import.meta.env.DEV) {
          console.log('🛒 직접 fetch 테스트 시작...')
          console.log('🛒 요청 URL:', testUrl)
        }

        const fetchPromise = fetch(testUrl, {
          method: 'DELETE',
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          }
        })

        const fetchTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('장바구니 비우기 타임아웃')), 10000)
        })

        const fetchResponse = await Promise.race([fetchPromise, fetchTimeout])

        if (import.meta.env.DEV) {
          console.log('🛒 Fetch 응답 상태:', fetchResponse.status, fetchResponse.statusText)
          console.log('🛒 Fetch 응답 헤더:', Object.fromEntries(fetchResponse.headers.entries()))
        }

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text()
          if (import.meta.env.DEV) {
            console.error('🛒 Fetch 에러 응답:', errorText)
            console.error('🛒 사용자 ID:', user.id)
            console.error('🛒 Access Token 존재:', !!accessToken)
            console.error('🛒 Access Token이 anon key와 다른가:', accessToken !== supabase.supabaseKey)
          }
          throw new Error(`HTTP ${fetchResponse.status}: ${errorText || fetchResponse.statusText}`)
        }

        // 삭제가 실제로 되었는지 확인 (항상 확인, access_token 사용)
        try {
          // 잠시 대기 후 확인 (DB 반영 시간 고려)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const verifyUrl = `${supabase.supabaseUrl}/rest/v1/cart_items?user_id=eq.${user.id}&select=id`
          const verifyResponse = await fetch(verifyUrl, {
            method: 'GET',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${accessToken}`, // access_token 사용 (RLS 정책 통과)
              'Content-Type': 'application/json'
            }
          })
          
          if (verifyResponse.ok) {
            const remainingItems = await verifyResponse.json()
            if (remainingItems && remainingItems.length > 0) {
              const errorMsg = `장바구니 비우기가 실제로 반영되지 않았습니다. (RLS 정책 확인 필요)`
              console.error(`🛒 ❌ 삭제 실패: 장바구니에 ${remainingItems.length}개의 아이템이 여전히 남아있습니다!`)
              console.error('🛒 남아있는 아이템:', remainingItems)
              console.error('🛒 사용자 ID:', user.id)
              console.error('🛒 Access Token 사용:', accessToken !== supabase.supabaseKey)
              throw new Error(errorMsg)
            } else {
              if (import.meta.env.DEV) {
                console.log('🛒 ✅ 장바구니 비우기 확인 완료 (모든 아이템 삭제됨)')
              }
            }
          } else {
            const errorText = await verifyResponse.text()
            console.warn('🛒 삭제 확인 요청 실패:', verifyResponse.status, errorText)
            // 확인 요청 실패는 삭제 실패로 간주하지 않음 (네트워크 문제일 수 있음)
          }
        } catch (verifyError) {
          if (verifyError.message.includes('장바구니 비우기가 실제로 반영되지 않았습니다')) {
            throw verifyError
          }
          // 다른 에러는 무시 (확인 실패는 삭제 실패가 아님)
          if (import.meta.env.DEV) {
            console.warn('🛒 장바구니 삭제 확인 중 오류 (무시):', verifyError)
          }
        }

        if (import.meta.env.DEV) {
          console.log('🛒 장바구니 비우기 성공')
        }

        return { success: true }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('🛒 장바구니 비우기 중 예외 발생:', err)
        }
        throw err
      }
    }, ERROR_MESSAGES.CART_CLEAR_FAILED)
  },
}




