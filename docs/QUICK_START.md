# 빠른 시작 가이드

Solbebe 프로젝트를 빠르게 시작하는 방법입니다.

## 1단계: 의존성 설치

```bash
npm install
```

## 2단계: Supabase 설정

### 방법 A: 가이드 문서 따라하기 (권장)

1. [Supabase 설정 가이드](./SUPABASE_SETUP.md) 문서를 열어서 단계별로 따라하기
2. 약 10분 소요

### 방법 B: SQL 파일로 빠르게 설정

1. [Supabase](https://supabase.com)에 로그인 및 프로젝트 생성
2. SQL Editor 열기
3. `docs/SUPABASE_SQL.sql` 파일 내용 복사 → 붙여넣기 → 실행
4. Settings → API에서 URL과 Key 복사
5. 프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=여기에_프로젝트_URL_붙여넣기
VITE_SUPABASE_ANON_KEY=여기에_anon_key_붙여넣기
```

## 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 4단계: 확인하기

- ✅ 홈 페이지에서 추천 상품 6개가 표시되는가?
- ✅ 상품 목록 페이지에서 필터링이 동작하는가?
- ✅ 상품 상세 페이지에서 이미지와 옵션이 표시되는가?
- ✅ 문의 폼 제출 후 Supabase에 데이터가 저장되는가?

## 문제가 발생하면?

1. 브라우저 콘솔(F12)에서 에러 확인
2. [Supabase 설정 가이드](./SUPABASE_SETUP.md)의 "문제 해결" 섹션 참고
3. 환경 변수가 제대로 설정되었는지 확인 (`.env` 파일 존재 및 값 확인)
4. 개발 서버 재시작

## 다음 단계

- [ ] Supabase Storage에 실제 상품 이미지 업로드
- [ ] 관리자 페이지 구현 (선택사항)
- [ ] Vercel에 배포










