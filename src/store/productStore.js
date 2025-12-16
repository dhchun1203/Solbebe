import { create } from 'zustand'

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  selectedSize: null,
  selectedColor: null,
  loading: false,
  error: null,

  // 상품 목록 설정
  setProducts: (products) => set({ products }),

  // 선택된 상품 설정
  setSelectedProduct: (product) => set({ 
    selectedProduct: product,
    selectedSize: null,
    selectedColor: null,
  }),

  // 사이즈 선택
  setSelectedSize: (size) => set({ selectedSize: size }),

  // 색상 선택
  setSelectedColor: (color) => set({ selectedColor: color }),

  // 로딩 상태
  setLoading: (loading) => set({ loading }),

  // 에러 설정
  setError: (error) => set({ error }),

  // 선택 옵션 초기화
  resetSelection: () => set({ 
    selectedSize: null, 
    selectedColor: null 
  }),
}))



