import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수 확인 (개발 모드에서만)
if (import.meta.env.DEV) {
  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
    console.warn('⚠️ VITE_SUPABASE_URL이 설정되지 않았습니다. .env 파일을 확인하세요.')
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.')
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  console.error('프로젝트 루트에 .env 파일을 생성하고 다음을 추가하세요:')
  console.error('VITE_SUPABASE_URL=your_supabase_url')
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// 개발 모드에서 연결 상태 확인 (비동기, 에러 무시)
if (import.meta.env.DEV) {
  console.log('🔗 Supabase 클라이언트 초기화:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '설정되지 않음',
    hasKey: !!supabaseAnonKey
  })
  
  // 연결 테스트는 백그라운드에서 실행하고 에러는 무시
  // (실제 API 호출 시 에러가 발생하면 그때 처리)
  setTimeout(() => {
    supabase
      .from('products')
      .select('count')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.warn('⚠️ Supabase 연결 테스트 실패 (무시됨):', error.message)
          console.warn('⚠️ 실제 API 호출 시 문제가 발생하면 Supabase SQL Editor에서 실행:')
          console.warn('   ALTER TABLE products DISABLE ROW LEVEL SECURITY;')
        } else {
          console.log('✅ Supabase 연결 테스트 성공')
        }
      })
      .catch(() => {
        // 타임아웃이나 네트워크 에러는 무시 (실제 사용 시 처리)
      })
  }, 1000) // 1초 후 백그라운드에서 실행
}

