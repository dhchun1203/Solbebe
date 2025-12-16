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

