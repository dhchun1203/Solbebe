# Supabase 비밀번호 인증 활성화 가이드

이 가이드는 Supabase에서 비밀번호 인증을 제대로 활성화하고 설정하는 방법을 안내합니다.

---

## 📌 문제 상황

- Authentication User 테이블에 비밀번호 관련 컬럼이 없음
- 로그인 시 비밀번호가 틀려도 로그인이 성공함
- 비밀번호 기능이 제대로 작동하지 않음

---

## 🔧 해결 방법

### 1. Supabase 대시보드에서 Email Provider 활성화

1. **Supabase 대시보드 접속**
   - [Supabase](https://supabase.com) 로그인
   - 프로젝트 선택

2. **Authentication → Providers 메뉴로 이동**
   - 왼쪽 사이드바에서 **"Authentication"** 클릭
   - **"Providers"** 탭 선택

3. **Email Provider 활성화 확인**
   - **Email** 섹션 찾기
   - ✅ **"Enable Email provider"** 체크박스가 **반드시 활성화**되어 있어야 함
   - 비활성화되어 있다면 체크박스를 클릭하여 활성화

4. **Password Provider 확인**
   - Email Provider와 함께 **Password Provider**도 자동으로 활성화됨
   - Email Provider를 활성화하면 비밀번호 인증이 자동으로 활성화됨

---

### 2. 기존 사용자 비밀번호 재설정

기존에 생성된 사용자들은 비밀번호가 제대로 설정되지 않았을 수 있습니다. 다음 방법으로 재설정하세요:

#### 방법 1: Supabase 대시보드에서 직접 재설정

1. **Authentication → Users 메뉴로 이동**
   - 왼쪽 사이드바에서 **"Authentication"** 클릭
   - **"Users"** 탭 선택

2. **사용자 선택**
   - 비밀번호를 재설정할 사용자 클릭

3. **비밀번호 재설정**
   - 사용자 상세 페이지에서 **"Reset Password"** 또는 **"Send Password Reset Email"** 버튼 클릭
   - 또는 **"Update User"** 메뉴에서 직접 비밀번호 설정

#### 방법 2: 사용자가 직접 비밀번호 재설정 (권장)

1. **비밀번호 재설정 기능 추가** (아래 코드 참고)
2. 사용자가 "비밀번호 찾기" 기능을 통해 재설정

---

### 3. 비밀번호 정책 설정

**Authentication → Settings → Password** 섹션에서:

1. **Minimum password length**: 최소 비밀번호 길이 설정 (기본값: 6자)
2. **Password requirements**: 비밀번호 요구사항 설정
   - 대문자 포함 여부
   - 소문자 포함 여부
   - 숫자 포함 여부
   - 특수문자 포함 여부

---

### 4. 코드에서 비밀번호 재설정 기능 추가

비밀번호 재설정 기능을 추가하여 사용자가 직접 비밀번호를 설정할 수 있도록 합니다.

#### 4-1. 비밀번호 재설정 이메일 발송

```javascript
// services/api.js 또는 별도 파일에 추가
export const authApi = {
  // 비밀번호 재설정 이메일 발송
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
    return data
  },
  
  // 비밀번호 업데이트
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) throw error
    return data
  },
}
```

#### 4-2. 비밀번호 재설정 페이지 생성

`src/pages/ResetPassword.jsx` 파일 생성:

```javascript
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      setError(error.message || '비밀번호 재설정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">비밀번호 재설정</h1>
        
        {success ? (
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-green-800">비밀번호가 성공적으로 변경되었습니다!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? '처리 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
```

---

### 5. 기존 사용자 삭제 후 재가입 (테스트용)

테스트 환경에서 기존 사용자를 삭제하고 새로 가입하는 방법:

1. **Authentication → Users** 메뉴로 이동
2. 삭제할 사용자 선택
3. **"Delete user"** 버튼 클릭
4. 앱에서 새로 회원가입 (이번에는 비밀번호가 제대로 저장됨)

---

### 6. 로그인 테스트

1. **올바른 비밀번호로 로그인**
   - 정상적으로 로그인되어야 함

2. **잘못된 비밀번호로 로그인 시도**
   - 에러 메시지가 표시되어야 함
   - 로그인이 실패해야 함

3. **콘솔 확인**
   - 브라우저 개발자 도구(F12) → Console 탭
   - 에러 메시지 확인

---

## 🔍 문제 진단

### 비밀번호가 제대로 작동하지 않는 경우 확인사항

1. **Email Provider 활성화 확인**
   - Authentication → Providers → Email
   - "Enable Email provider" 체크 확인

2. **사용자 확인**
   - Authentication → Users
   - 사용자의 "Providers" 컬럼에 "Email"이 표시되는지 확인
   - "Email"이 없으면 Email Provider가 제대로 활성화되지 않은 것

3. **비밀번호 해시 확인**
   - Supabase는 보안상 비밀번호를 평문으로 저장하지 않음
   - `auth.users` 테이블에는 `encrypted_password` 컬럼이 있음 (직접 확인 불가)
   - 비밀번호는 해시로 저장되므로 User 테이블에서 직접 볼 수 없음

4. **콘솔 에러 확인**
   - 브라우저 개발자 도구에서 네트워크 탭 확인
   - 로그인 요청의 응답 확인

---

## ✅ 확인 체크리스트

- [ ] Email Provider 활성화됨
- [ ] 기존 사용자 비밀번호 재설정 또는 삭제 후 재가입
- [ ] 올바른 비밀번호로 로그인 성공
- [ ] 잘못된 비밀번호로 로그인 실패 (에러 메시지 표시)
- [ ] 회원가입 시 비밀번호 제대로 저장됨

---

## 💡 중요 사항

1. **비밀번호는 해시로 저장됨**
   - Supabase는 비밀번호를 평문으로 저장하지 않음
   - `auth.users` 테이블의 `encrypted_password` 컬럼에 해시로 저장됨
   - 이는 보안상 정상적인 동작입니다

2. **Email Provider가 필수**
   - 비밀번호 인증을 사용하려면 반드시 Email Provider가 활성화되어 있어야 함
   - Email Provider 없이는 비밀번호 인증이 작동하지 않음

3. **기존 사용자 처리**
   - 기존에 Email Provider 없이 생성된 사용자는 비밀번호가 없을 수 있음
   - 비밀번호 재설정 또는 삭제 후 재가입 필요

---

## 🆘 추가 도움말

문제가 계속되면:
1. Supabase 대시보드의 **Settings → API**에서 프로젝트 설정 확인
2. Supabase 공식 문서: [Password Authentication](https://supabase.com/docs/guides/auth/auth-password)
3. 브라우저 콘솔의 에러 메시지 확인

---

이 가이드를 따라 설정하면 비밀번호 인증이 정상적으로 작동합니다! 🔐






