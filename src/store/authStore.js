import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../services/supabase'
import { formatError } from '../utils/errorHandler'
import { ERROR_MESSAGES, STORAGE_KEYS } from '../constants'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      // 로그인
      signIn: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = formatError(error, ERROR_MESSAGES.LOGIN_FAILED)
          set({
            loading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      // 회원가입
      signUp: async (email, password, name) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
              },
            },
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = formatError(error, ERROR_MESSAGES.SIGNUP_FAILED)
          set({
            loading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      // 로그아웃
      signOut: async () => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            session: null,
            loading: false,
            error: null,
          })
        } catch (error) {
          const errorMessage = formatError(error, ERROR_MESSAGES.LOGOUT_FAILED)
          set({
            loading: false,
            error: errorMessage,
          })
        }
      },

      // 세션 확인
      checkSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          set({
            user: session?.user ?? null,
            session: session,
          })
        } catch (error) {
          console.error('세션 확인 실패:', error)
        }
      },

      // 사용자 정보 업데이트
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      
      // 에러 초기화
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
)

// Supabase Auth 상태 변경 리스너 설정
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().setSession(session)
  useAuthStore.getState().setUser(session?.user ?? null)
})

