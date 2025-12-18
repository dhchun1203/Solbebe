import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../services/supabase'
import { formatError } from '../utils/errorHandler'
import { ERROR_MESSAGES, STORAGE_KEYS, ADMIN_EMAILS } from '../constants'

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

          // 관리자 이메일 체크
          const userEmail = data.user?.email?.toLowerCase().trim()
          const isAdminUser = ADMIN_EMAILS && ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail)
          
          // 관리자 이메일이 설정되어 있고, 로그인한 사용자가 관리자가 아니면 접근 거부
          if (ADMIN_EMAILS && ADMIN_EMAILS.length > 0 && !isAdminUser) {
            // 로그인은 성공했지만 관리자가 아니므로 로그아웃 처리
            await supabase.auth.signOut()
            throw new Error('관리자 계정만 로그인할 수 있습니다.')
          }

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
        console.log('🔴 authStore.signOut 시작')
        set({ loading: true, error: null })
        
        // 1단계: Supabase 로그아웃 시도 (타임아웃 포함)
        let supabaseSuccess = false
        try {
          console.log('🔴 Supabase signOut 호출 시작...')
          
          // 타임아웃 설정 (3초)
          const signOutPromise = supabase.auth.signOut()
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Supabase signOut 타임아웃')), 3000)
          })
          
          const { error } = await Promise.race([signOutPromise, timeoutPromise])
          
          if (error) {
            console.error('🔴 Supabase signOut 에러:', error)
            throw error
          }
          
          supabaseSuccess = true
          console.log('🔴 Supabase signOut 성공')
        } catch (error) {
          console.warn('🔴 Supabase signOut 실패 (계속 진행):', error)
          // Supabase 실패해도 계속 진행
        }

        // 2단계: 상태 초기화 (Supabase 성공/실패와 관계없이)
        console.log('🔴 상태 초기화 시작...')
        set({
          user: null,
          session: null,
          loading: false,
          error: null,
        })

        // 3단계: localStorage에서 인증 데이터 제거
        console.log('🔴 localStorage 제거 시작...')
        try {
          localStorage.removeItem(STORAGE_KEYS.AUTH)
          console.log('🔴 localStorage 제거 완료')
        } catch (storageError) {
          console.warn('🔴 localStorage 제거 실패:', storageError)
        }

        // 4단계: Supabase 세션도 강제로 제거 (추가 안전장치)
        try {
          // Supabase가 localStorage에 저장한 세션도 제거
          const supabaseStorageKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('sb-') || key.includes('supabase')
          )
          supabaseStorageKeys.forEach(key => {
            try {
              localStorage.removeItem(key)
              console.log(`🔴 Supabase storage 제거: ${key}`)
            } catch (e) {
              console.warn(`🔴 Supabase storage 제거 실패 (${key}):`, e)
            }
          })
        } catch (storageError) {
          console.warn('🔴 Supabase storage 정리 실패:', storageError)
        }

        console.log('🔴 signOut 완료', { supabaseSuccess })
        return { success: true, supabaseSuccess }
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
      
      // 관리자 체크
      isAdmin: () => {
        const state = useAuthStore.getState()
        if (!state.user || !state.user.email) return false
        
        const userEmail = state.user.email.toLowerCase().trim()
        
        // 관리자 이메일 리스트가 비어있으면 false 반환
        if (!ADMIN_EMAILS || ADMIN_EMAILS.length === 0) {
          if (import.meta.env.DEV) {
            console.warn('⚠️ 관리자 이메일이 설정되지 않았습니다. .env 파일에 VITE_ADMIN_EMAILS를 설정하세요.')
          }
          return false
        }
        
        return ADMIN_EMAILS.includes(userEmail)
      },
      
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
  console.log('🔵 Supabase Auth 상태 변경:', event, session?.user?.email || '로그아웃됨')
  useAuthStore.getState().setSession(session)
  useAuthStore.getState().setUser(session?.user ?? null)
})

