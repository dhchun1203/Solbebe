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

// 개발 모드에서 연결 상태 확인
if (import.meta.env.DEV) {
  console.log('🔗 Supabase 클라이언트 초기화:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '설정되지 않음',
    hasKey: !!supabaseAnonKey
  })
  
  // 연결 테스트 (타임아웃 포함)
  const testPromise = supabase
    .from('products')
    .select('count')
    .limit(1)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('연결 테스트 타임아웃')), 5000)
  })
  
  Promise.race([testPromise, timeoutPromise])
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase 연결 실패:', error)
        console.error('❌ 에러 코드:', error.code)
        console.error('❌ 에러 메시지:', error.message)
        console.error('❌ 해결 방법: Supabase SQL Editor에서 실행:')
        console.error('   ALTER TABLE products DISABLE ROW LEVEL SECURITY;')
      } else {
        console.log('✅ Supabase 연결 성공')
      }
    })
    .catch((err) => {
      console.error('❌ Supabase 연결 오류:', err)
      console.error('❌ 해결 방법: Supabase SQL Editor에서 실행:')
      console.error('   ALTER TABLE products DISABLE ROW LEVEL SECURITY;')
    })
}

