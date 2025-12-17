import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../services/supabase'

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
          // Supabase 에러 메시지를 사용자 친화적인 메시지로 변환
          let errorMessage = '로그인에 실패했습니다.'
          
          if (error.message) {
            // Supabase 에러 코드 및 메시지 확인
            const errorMsg = error.message.toLowerCase()
            
            if (errorMsg.includes('invalid login credentials') || 
                errorMsg.includes('invalid credentials') ||
                errorMsg.includes('email not found') ||
                errorMsg.includes('user not found')) {
              // 이메일이 존재하지 않거나 비밀번호가 틀린 경우
              // 보안상 구체적인 정보를 제공하지 않음
              errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
            } else if (errorMsg.includes('email not confirmed')) {
              errorMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
            } else if (errorMsg.includes('too many requests')) {
              errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
            } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
              errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
            } else {
              // 기타 에러는 원본 메시지 사용
              errorMessage = error.message
            }
          }

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
          // Supabase 에러 메시지를 사용자 친화적인 메시지로 변환
          let errorMessage = '회원가입에 실패했습니다.'
          
          if (error.message) {
            const errorMsg = error.message.toLowerCase()
            
            if (errorMsg.includes('user already registered') || 
                errorMsg.includes('email already exists') ||
                errorMsg.includes('already registered')) {
              errorMessage = '이미 등록된 이메일입니다. 로그인해주세요.'
            } else if (errorMsg.includes('password')) {
              errorMessage = '비밀번호가 너무 짧거나 형식이 올바르지 않습니다.'
            } else if (errorMsg.includes('email')) {
              errorMessage = '올바른 이메일 형식이 아닙니다.'
            } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
              errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
            } else {
              errorMessage = error.message
            }
          }

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
          set({
            loading: false,
            error: error.message || '로그아웃에 실패했습니다.',
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
      name: 'auth-storage',
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

