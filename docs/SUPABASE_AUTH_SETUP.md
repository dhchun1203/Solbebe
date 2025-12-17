# Supabase 이메일 인증 설정 가이드

이 가이드는 Solbebe 프로젝트에서 Supabase 이메일 인증을 활성화하고 설정하는 방법을 안내합니다.

---

## 📌 목차

1. [Supabase 대시보드 접속](#1-supabase-대시보드-접속)
2. [Authentication 설정 확인](#2-authentication-설정-확인)
3. [이메일 인증 활성화](#3-이메일-인증-활성화)
4. [이메일 템플릿 설정 (선택사항)](#4-이메일-템플릿-설정-선택사항)
5. [테스트 방법](#5-테스트-방법)
6. [문제 해결](#6-문제-해결)

---

## 1. Supabase 대시보드 접속

1. [Supabase 공식 사이트](https://supabase.com)에 접속
2. **"Sign in"** 클릭하여 로그인
3. 프로젝트 목록에서 **Solbebe 프로젝트** 선택

---

## 2. Authentication 설정 확인

### 2-1. Authentication 메뉴 접속

1. 왼쪽 사이드바에서 **"Authentication"** (사람 아이콘) 클릭
2. **"Providers"** 탭이 기본으로 열립니다

### 2-2. Email Provider 확인

**Email** 섹션에서 다음을 확인하세요:

- ✅ **Enable Email provider** 체크박스가 **활성화**되어 있는지 확인
- 기본적으로 활성화되어 있지만, 비활성화되어 있다면 체크박스를 클릭하여 활성화

---

## 3. 이메일 인증 활성화

### 3-1. Email 설정

**Authentication** → **Providers** → **Email** 섹션에서:

#### ✅ 기본 설정 (권장)

1. **Enable Email provider**: ✅ 활성화
2. **Confirm email**: 
   - **개발 단계**: ❌ 비활성화 (즉시 로그인 가능)
   - **프로덕션**: ✅ 활성화 (이메일 확인 필요)

#### 📧 이메일 확인 설정

**"Confirm email"** 옵션:

- **비활성화 (개발용)**: 
  - 회원가입 시 이메일 확인 없이 즉시 로그인 가능
  - 개발 및 테스트에 편리
  
- **활성화 (프로덕션용)**:
  - 회원가입 시 이메일 확인 링크가 발송됨
  - 이메일 확인 후 로그인 가능
  - 보안 강화

### 3-2. 비밀번호 설정

**Password** 섹션에서:

- **Enable Password provider**: ✅ 활성화 (기본값)
- **Minimum password length**: 6자 이상 (기본값)

---

## 4. 이메일 템플릿 설정 (선택사항)

### 4-1. 이메일 템플릿 접속

1. **Authentication** → **Email Templates** 클릭
2. 다음 템플릿을 커스터마이징할 수 있습니다:
   - **Confirm signup**: 회원가입 확인 이메일
   - **Magic Link**: 매직 링크 이메일
   - **Change Email Address**: 이메일 변경 확인
   - **Reset Password**: 비밀번호 재설정

### 4-2. 이메일 템플릿 커스터마이징

각 템플릿에서 다음을 수정할 수 있습니다:

- **Subject**: 이메일 제목
- **Body**: 이메일 본문 (HTML 지원)
- 변수 사용 가능:
  - `{{ .ConfirmationURL }}`: 확인 링크
  - `{{ .Email }}`: 사용자 이메일
  - `{{ .Token }}`: 인증 토큰

#### 예시: 회원가입 확인 이메일

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

## 5. 테스트 방법

### 5-1. 개발 환경에서 테스트 (이메일 확인 비활성화)

1. **Confirm email** 비활성화 상태에서:
   - 회원가입 시 즉시 로그인됨
   - 이메일 확인 없이 바로 사용 가능

2. 테스트 계정 생성:
   ```
   이메일: test@example.com
   비밀번호: test123456
   ```

### 5-2. 프로덕션 환경에서 테스트 (이메일 확인 활성화)

1. **Confirm email** 활성화 상태에서:
   - 회원가입 시 이메일 확인 링크 발송
   - Supabase는 기본적으로 **Supabase SMTP**를 사용
   - 개발용 이메일은 **Supabase 대시보드**에서 확인 가능

2. 이메일 확인 방법:
   - **Authentication** → **Users** 탭
   - 생성된 사용자 클릭
   - **"Resend confirmation email"** 버튼으로 재발송 가능

### 5-3. 실제 이메일 발송 설정 (프로덕션)

프로덕션 환경에서는 실제 이메일 서비스(SMTP)를 설정해야 합니다:

1. **Settings** → **Auth** → **SMTP Settings**
2. SMTP 서비스 선택:
   - **SendGrid**
   - **Mailgun**
   - **AWS SES**
   - **기타 SMTP 서비스**

3. SMTP 정보 입력:
   - Host
   - Port
   - Username
   - Password
   - Sender email

---

## 6. 문제 해결

### 문제 1: 회원가입 후 로그인이 안 됨

**원인**: 이메일 확인이 활성화되어 있지만 이메일을 확인하지 않음

**해결**:
1. **Authentication** → **Users**에서 사용자 확인
2. **"Resend confirmation email"** 클릭
3. 또는 개발 단계에서는 **"Confirm email"** 비활성화

### 문제 2: 이메일이 발송되지 않음

**원인**: SMTP 설정이 없거나 잘못됨

**해결**:
1. **Settings** → **Auth** → **SMTP Settings** 확인
2. 개발 단계에서는 Supabase 기본 SMTP 사용 (제한적)
3. 프로덕션에서는 실제 SMTP 서비스 설정 필요

### 문제 3: "Invalid login credentials" 에러

**원인**: 
- 이메일 또는 비밀번호 오류
- 이메일 확인이 필요한데 확인하지 않음

**해결**:
1. 이메일과 비밀번호 확인
2. 이메일 확인 상태 확인 (**Authentication** → **Users**)

### 문제 4: 이메일 확인 링크가 작동하지 않음

**원인**: 
- 링크 만료 (기본 24시간)
- 잘못된 토큰

**해결**:
1. **Authentication** → **Users**에서 **"Resend confirmation email"** 클릭
2. 새 링크로 다시 시도

---

## 7. 권장 설정 (개발/프로덕션)

### 개발 환경 (Development)

```
✅ Enable Email provider: 활성화
❌ Confirm email: 비활성화 (즉시 로그인)
✅ Enable Password provider: 활성화
```

### 프로덕션 환경 (Production)

```
✅ Enable Email provider: 활성화
✅ Confirm email: 활성화 (보안 강화)
✅ Enable Password provider: 활성화
✅ SMTP Settings: 실제 이메일 서비스 설정
✅ Minimum password length: 8자 이상 권장
```

---

## 8. 추가 보안 설정

### 8-1. Rate Limiting

**Settings** → **Auth** → **Rate Limits**에서:
- 로그인 시도 제한 설정
- 비밀번호 재설정 요청 제한

### 8-2. Password Requirements

**Settings** → **Auth** → **Password**에서:
- 최소 비밀번호 길이 설정
- 복잡도 요구사항 설정

### 8-3. Session Management

**Settings** → **Auth** → **Sessions**에서:
- 세션 만료 시간 설정
- 리프레시 토큰 설정

---

## 9. 확인 체크리스트

설정 완료 후 다음을 확인하세요:

- [ ] Email provider 활성화됨
- [ ] Password provider 활성화됨
- [ ] 개발 환경: Confirm email 비활성화 (선택)
- [ ] 프로덕션 환경: Confirm email 활성화 (선택)
- [ ] 테스트 계정으로 회원가입 성공
- [ ] 테스트 계정으로 로그인 성공
- [ ] 로그아웃 기능 작동 확인

---

## 10. 참고 자료

- [Supabase Auth 공식 문서](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP 설정](https://supabase.com/docs/guides/auth/auth-smtp)

---

## 💡 팁

1. **개발 단계**에서는 이메일 확인을 비활성화하여 빠르게 테스트하세요
2. **프로덕션 배포 전**에는 반드시 이메일 확인을 활성화하세요
3. 실제 이메일 발송이 필요한 경우 SMTP 서비스를 설정하세요
4. Supabase 무료 플랜에서는 이메일 발송에 제한이 있을 수 있습니다

---

이 가이드를 따라 설정하면 Solbebe 프로젝트에서 이메일 인증이 정상적으로 작동합니다! 🎉


