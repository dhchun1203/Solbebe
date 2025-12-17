# 이메일 인증 설정 가이드

이 가이드는 Solbebe 프로젝트에서 이메일 인증이 제대로 작동하도록 Supabase 설정을 안내합니다.

---

## 📌 문제 상황

- 이메일 인증 링크를 클릭했는데 확인이 되지 않음
- `http://localhost:5173/`로 리다이렉트되지만 인증이 완료되지 않음

---

## 🔧 해결 방법

### 1. Supabase 대시보드에서 Redirect URL 설정

1. **Supabase 대시보드 접속**
   - [Supabase](https://supabase.com) 로그인
   - 프로젝트 선택

2. **Authentication → URL Configuration 메뉴로 이동**
   - 왼쪽 사이드바에서 **"Authentication"** 클릭
   - **"URL Configuration"** 탭 선택

3. **Site URL 설정**
   - **Site URL**: `http://localhost:5173` (개발 환경)
   - 또는 프로덕션 URL: `https://your-domain.com`

4. **Redirect URLs 추가**
   - **Redirect URLs** 섹션에서 **"Add URL"** 클릭
   - 다음 URL들을 추가:
     ```
     http://localhost:5173/auth/confirm
     http://localhost:5173/reset-password
     ```
   - 프로덕션 환경의 경우:
     ```
     https://your-domain.com/auth/confirm
     https://your-domain.com/reset-password
     ```

5. **저장**
   - **"Save"** 버튼 클릭

---

### 2. 이메일 템플릿 확인

1. **Authentication → Email Templates 메뉴로 이동**

2. **Confirm signup 템플릿 확인**
   - **Subject**: 이메일 제목 확인
   - **Body**: 이메일 본문 확인
   - **Confirmation URL**이 올바르게 설정되어 있는지 확인

3. **템플릿 예시**:
   ```
   Subject: Solbebe 회원가입을 확인해주세요
   
   Body:
   안녕하세요!
   
   Solbebe 회원가입을 환영합니다.
   아래 링크를 클릭하여 이메일을 확인해주세요:
   
   {{ .ConfirmationURL }}
   
   감사합니다.
   Solbebe 팀
   ```

---

### 3. 이메일 인증 플로우 확인

이메일 인증 링크를 클릭하면:

1. **이메일 링크 형식**:
   ```
   http://localhost:5173/#access_token=xxx&refresh_token=xxx&type=signup
   ```

2. **자동 처리**:
   - App.jsx에서 해시를 감지
   - `/auth/confirm` 페이지로 리다이렉트
   - EmailConfirm 페이지에서 토큰 처리
   - 세션 설정 및 인증 완료

3. **성공 시**:
   - "이메일 인증이 완료되었습니다!" 메시지 표시
   - 2초 후 홈으로 자동 이동

---

## 🔍 문제 진단

### 인증이 되지 않는 경우 확인사항

1. **Redirect URL 설정 확인**
   - Supabase 대시보드 → Authentication → URL Configuration
   - `http://localhost:5173/auth/confirm`이 추가되어 있는지 확인

2. **브라우저 콘솔 확인**
   - 개발자 도구(F12) → Console 탭
   - 에러 메시지 확인

3. **네트워크 탭 확인**
   - 개발자 도구 → Network 탭
   - `/auth/v1/verify` 요청 확인
   - 응답 상태 코드 확인

4. **URL 해시 확인**
   - 이메일 링크 클릭 후 URL에 `#access_token=...`이 포함되어 있는지 확인
   - 해시가 없으면 Supabase 설정 문제일 수 있음

---

## ✅ 테스트 방법

### 1. 회원가입 테스트

1. 앱에서 회원가입
2. 이메일 확인 (받은편지함 또는 스팸함)
3. 이메일의 "Confirm your mail" 링크 클릭
4. **예상 결과**:
   - `/auth/confirm` 페이지로 이동
   - "이메일 인증이 완료되었습니다!" 메시지 표시
   - 2초 후 홈으로 이동
   - 프로필 아이콘이 꽉 찬 아이콘으로 변경됨

### 2. 인증 상태 확인

1. 로그인 시도
2. **예상 결과**:
   - 인증 완료된 계정: 정상 로그인
   - 인증 미완료 계정: "이메일 인증이 완료되지 않았습니다." 메시지

---

## 🛠️ 수동 인증 확인 (개발용)

개발 단계에서 이메일 확인을 비활성화하려면:

1. **Supabase 대시보드** → **Authentication** → **Providers**
2. **Email** 섹션에서:
   - ❌ **"Confirm email"** 체크박스 비활성화
3. 이렇게 하면 회원가입 시 즉시 로그인 가능

---

## 📝 중요 사항

1. **Redirect URL은 반드시 설정해야 함**
   - 설정하지 않으면 인증 링크가 작동하지 않음
   - 개발 환경과 프로덕션 환경 모두 설정 필요

2. **해시 기반 인증**
   - Supabase는 보안상 토큰을 URL 해시(`#`)로 전달
   - 서버로 전송되지 않아 보안이 강화됨

3. **토큰 만료 시간**
   - 기본적으로 24시간 후 만료
   - 만료된 링크는 재발송 필요

---

## 🆘 추가 도움말

문제가 계속되면:
1. Supabase 대시보드의 **Settings → API**에서 프로젝트 설정 확인
2. Supabase 공식 문서: [Email Auth](https://supabase.com/docs/guides/auth/auth-email)
3. 브라우저 콘솔의 에러 메시지 확인

---

이 가이드를 따라 설정하면 이메일 인증이 정상적으로 작동합니다! ✉️

