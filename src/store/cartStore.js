import { create } from 'zustand'
import { cartApi } from '../services/api'

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // 장바구니 아이템 로드
  loadCartItems: async () => {
    set({ loading: true, error: null })
    
    // 타임아웃 설정 (10초)
    const timeoutId = setTimeout(() => {
      console.warn('🛒 장바구니 로드 타임아웃 (10초 초과)')
      set({ 
        items: [],
        loading: false,
        error: '장바구니를 불러오는데 시간이 오래 걸립니다.',
      })
    }, 10000)
    
    try {
      console.log('🛒 장바구니 로드 시작...')
      const items = await cartApi.getCartItems()
      clearTimeout(timeoutId)
      console.log('🛒 장바구니 로드 성공:', items?.length || 0)
      set({ items: items || [], loading: false })
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('🛒 장바구니 로드 실패:', error)
      set({ 
        items: [],
        loading: false,
        error: error.message || '장바구니를 불러오는데 실패했습니다.',
      })
    }
  },

  // 장바구니에 상품 추가
  addToCart: async (product, options = {}) => {
    set({ loading: true, error: null })
    try {
      const newItem = await cartApi.addToCart(product.id, {
        size: options.size,
        color: options.color,
      })
      
      // 로컬 상태 업데이트
      const existingIndex = get().items.findIndex(
        item => item.id === newItem.id
      )
      
      if (existingIndex >= 0) {
        set((state) => {
          const updatedItems = [...state.items]
          updatedItems[existingIndex] = newItem
          return { items: updatedItems, loading: false }
        })
      } else {
        set((state) => ({
          items: [newItem, ...state.items],
          loading: false,
        }))
      }
      
      return { success: true }
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      set({
        loading: false,
        error: error.message || '장바구니에 추가하는데 실패했습니다.',
      })
      return { success: false, error: error.message }
    }
  },
  
  // 장바구니에서 상품 제거
  removeFromCart: async (itemId) => {
    set({ loading: true, error: null })
    try {
      const result = await cartApi.removeFromCart(itemId)
      // API 호출이 성공한 경우에만 로컬 상태 업데이트
      if (result?.success) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          loading: false,
        }))
      } else {
        throw new Error('장바구니 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('장바구니 삭제 실패:', error)
      set({
        loading: false,
        error: error.message || '장바구니에서 삭제하는데 실패했습니다.',
      })
      // 에러 발생 시 로컬 상태는 변경하지 않음
      throw error // 에러를 다시 throw하여 UI에서 처리할 수 있도록
    }
  },
  
  // 수량 업데이트
  updateQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null })
    try {
      const updatedItem = await cartApi.updateCartItemQuantity(itemId, quantity)
      
      if (updatedItem) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? updatedItem : item
          ),
          loading: false,
        }))
      } else {
        // 삭제된 경우
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          loading: false,
        }))
      }
    } catch (error) {
      console.error('수량 업데이트 실패:', error)
      set({
        loading: false,
        error: error.message || '수량을 업데이트하는데 실패했습니다.',
      })
    }
  },
  
  // 장바구니 비우기
  clearCart: async () => {
    set({ loading: true, error: null })
    try {
      const result = await cartApi.clearCart()
      // API 호출이 성공한 경우에만 로컬 상태 업데이트
      if (result?.success) {
        set({ items: [], loading: false })
      } else {
        throw new Error('장바구니 비우기에 실패했습니다.')
      }
    } catch (error) {
      console.error('장바구니 비우기 실패:', error)
      set({
        loading: false,
        error: error.message || '장바구니를 비우는데 실패했습니다.',
      })
      // 에러 발생 시 로컬 상태는 변경하지 않음
      throw error // 에러를 다시 throw하여 UI에서 처리할 수 있도록
    }
  },
  
  // 장바구니 총 개수
  getTotalItems: () => {
    return get().items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  },
  
  // 장바구니 총 금액
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    )
  },
}))

