# Supabase 사용자 정보 수정 설정 가이드

## 📌 문제 상황

`updateUser` API 호출이 타임아웃되거나 응답이 없는 경우, 다음 설정들을 확인하세요.

---

## 1. Supabase 대시보드에서 확인할 사항

### 1-1. Authentication 설정 확인

1. **Supabase 대시보드** → **Authentication** → **Settings** 이동
2. 다음 항목들을 확인:

#### ✅ Email Auth 활성화 확인
- **Enable Email Signup**: 활성화되어 있어야 함
- **Enable Email Confirmations**: 선택 사항 (개발 중에는 비활성화 가능)

#### ✅ User Management 설정
- **Enable Custom SMTP**: 선택 사항
- **Site URL**: `http://localhost:5173` (개발 환경) 또는 실제 도메인 설정

### 1-2. API 설정 확인

1. **Settings** → **API** 이동
2. 확인 사항:
   - **Project URL**: 올바르게 설정되어 있는지 확인
   - **anon/public key**: `.env` 파일의 `VITE_SUPABASE_ANON_KEY`와 일치하는지 확인
   - **service_role key**: (관리자용, 클라이언트에서는 사용하지 않음)

### 1-3. 프로젝트 상태 확인

1. **Settings** → **General** 이동
2. 확인 사항:
   - 프로젝트가 **Active** 상태인지 확인
   - 프로젝트가 **Paused** 상태가 아닌지 확인

### 1-4. Rate Limiting 확인

1. **Settings** → **API** → **Rate Limiting** 확인
2. 무료 플랜의 경우 API 호출 제한이 있을 수 있음
3. 타임아웃이 발생하는 경우 Rate Limit에 도달했을 가능성

---

## 2. 네트워크/방화벽 확인

### 2-1. 브라우저 개발자 도구에서 확인

1. **Network 탭** 열기
2. 저장 버튼 클릭
3. 다음 요청이 보이는지 확인:
   - `auth/v1/user` (PUT 요청)
   - 응답 상태 코드 확인 (200, 400, 401, 403 등)

### 2-2. CORS 설정 확인

Supabase는 기본적으로 모든 도메인에서의 요청을 허용하지만, 확인이 필요한 경우:

1. **Settings** → **API** → **CORS** 확인
2. 개발 환경에서는 `*` 또는 `http://localhost:5173` 추가

---

## 3. 대안: 직접 REST API 호출

Supabase 클라이언트가 작동하지 않는 경우, 직접 REST API를 호출하는 방법:

### 3-1. 코드 수정 예시

```javascript
const handleSave = async () => {
  try {
    // 현재 세션의 access token 가져오기
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('세션이 없습니다.')
    }

    // 직접 REST API 호출
    const response = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: editForm.name,
            phone: editForm.phone,
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '업데이트 실패')
    }

    const data = await response.json()
    console.log('✅ 업데이트 성공:', data)
  } catch (error) {
    console.error('❌ 업데이트 실패:', error)
  }
}
```

---

## 4. 문제 해결 체크리스트

- [ ] Supabase 프로젝트가 Active 상태인가?
- [ ] Authentication이 활성화되어 있는가?
- [ ] API 키가 올바르게 설정되어 있는가?
- [ ] 네트워크 탭에서 요청이 보이는가?
- [ ] 요청이 타임아웃되는가? (30초 이상)
- [ ] Rate Limit에 도달했는가?
- [ ] 브라우저 콘솔에 CORS 에러가 있는가?

---

## 5. 추가 디버깅

### 5-1. Supabase 로그 확인

1. **Logs** → **API Logs** 이동
2. `updateUser` 호출 시 로그가 기록되는지 확인
3. 에러 메시지 확인

### 5-2. 테스트 방법

Supabase 대시보드에서 직접 테스트:

1. **Authentication** → **Users** 이동
2. 사용자 선택
3. **Edit** 클릭
4. **User Metadata** 섹션에서 직접 수정 테스트
5. 저장 후 클라이언트에서 반영되는지 확인

---

## 6. 권장 해결 방법

1. **먼저 Supabase 대시보드에서 직접 수정 테스트**
2. **대시보드에서 수정이 가능하다면**: 클라이언트 코드 문제
3. **대시보드에서도 수정이 안 된다면**: Supabase 프로젝트 설정 문제
4. **네트워크 탭에서 요청이 보이지 않는다면**: 클라이언트 코드 실행 문제

---

## 7. 문의

위 방법으로도 해결되지 않으면:
- Supabase 공식 문서: https://supabase.com/docs
- Supabase Discord 커뮤니티: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

