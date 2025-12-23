# Vercel 배포 가이드

이 가이드는 Solbebe 프로젝트를 Vercel에 배포하는 상세한 단계별 안내입니다.

---

## 📌 목차

1. [사전 준비](#1-사전-준비)
2. [GitHub 저장소 준비](#2-github-저장소-준비)
3. [Vercel 계정 생성 및 프로젝트 연결](#3-vercel-계정-생성-및-프로젝트-연결)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [Supabase 설정 업데이트](#5-supabase-설정-업데이트)
6. [배포 확인](#6-배포-확인)
7. [문제 해결](#7-문제-해결)

---

## 1. 사전 준비

### 1-1. 프로젝트 빌드 테스트

배포 전에 로컬에서 빌드가 정상적으로 작동하는지 확인:

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

빌드가 성공하고 `dist` 폴더가 생성되면 준비 완료입니다.

### 1-2. .gitignore 확인

`.gitignore` 파일에 다음이 포함되어 있는지 확인:

```
.env
.env.local
.env.*.local
node_modules
dist
.vercel
```

---

## 2. GitHub 저장소 준비

### 2-1. Git 저장소 초기화 (아직 안 했다면)

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"
```

### 2-2. GitHub에 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. **"New repository"** 클릭
3. 저장소 이름 입력: `solbebe` (또는 원하는 이름)
4. **"Create repository"** 클릭

### 2-3. 로컬 저장소를 GitHub에 푸시

```bash
# GitHub 저장소 URL로 변경 (실제 URL 사용)
git remote add origin https://github.com/your-username/solbebe.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

---

## 3. Vercel 계정 생성 및 프로젝트 연결

### 3-1. Vercel 계정 생성

1. [Vercel](https://vercel.com) 접속
2. **"Sign Up"** 클릭
3. **GitHub 계정으로 로그인** (권장)
   - GitHub와 연동하면 자동 배포 설정이 쉬움

### 3-2. 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 클릭
3. GitHub 저장소 목록에서 **Solbebe 프로젝트** 선택
4. **"Import"** 클릭

### 3-3. 프로젝트 설정

**Configure Project** 화면에서:

1. **Project Name**: `solbebe` (또는 원하는 이름)
2. **Framework Preset**: **Vite** 자동 감지됨
3. **Root Directory**: `./` (기본값)
4. **Build Command**: `npm run build` (자동 설정됨)
5. **Output Directory**: `dist` (자동 설정됨)
6. **Install Command**: `npm install` (자동 설정됨)

**⚠️ 중요**: **"Deploy"** 버튼을 아직 클릭하지 마세요! 먼저 환경 변수를 설정해야 합니다.

---

## 4. 환경 변수 설정

### 4-1. Supabase 정보 확인

1. [Supabase 대시보드](https://supabase.com) 접속
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 정보를 복사해두세요:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4-2. Vercel에서 환경 변수 추가

**Configure Project** 화면에서:

1. **"Environment Variables"** 섹션 확장
2. 다음 환경 변수 추가:

   **변수 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Supabase Project URL (예: `https://xxxxx.supabase.co`)
   - **Environment**: Production, Preview, Development 모두 선택

   **변수 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Supabase anon public key
   - **Environment**: Production, Preview, Development 모두 선택

3. **"Add"** 버튼으로 각 변수 추가

### 4-3. 배포 실행

환경 변수 설정이 완료되면:

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (약 1-2분 소요)
3. 배포 완료 후 **"Visit"** 버튼으로 사이트 확인

---

## 5. Supabase 설정 업데이트

### 5-1. Redirect URLs 추가

배포된 사이트 URL을 Supabase에 등록해야 합니다.

1. **Supabase 대시보드** → **Authentication** → **URL Configuration**
2. **Redirect URLs**에 다음 추가:
   ```
   https://your-project.vercel.app/auth/confirm
   https://your-project.vercel.app/reset-password
   ```
   - `your-project.vercel.app`을 실제 Vercel 배포 URL로 변경
3. **"Save"** 클릭

### 5-2. Site URL 업데이트

1. **Site URL**을 프로덕션 URL로 변경:
   ```
   https://your-project.vercel.app
   ```
2. **"Save"** 클릭

### 5-3. 커스텀 도메인 사용 시 (선택사항)

커스텀 도메인을 사용하는 경우:

1. Vercel에서 커스텀 도메인 설정
2. Supabase Redirect URLs에 커스텀 도메인도 추가:
   ```
   https://yourdomain.com/auth/confirm
   https://yourdomain.com/reset-password
   ```

---

## 6. 배포 확인

### 6-1. 기본 기능 확인

배포된 사이트에서 다음을 확인:

- [ ] 홈 페이지가 정상적으로 로드됨
- [ ] 상품 목록이 표시됨
- [ ] 상품 상세 페이지가 작동함
- [ ] 검색 기능이 작동함

### 6-2. 인증 기능 확인

- [ ] 회원가입이 작동함
- [ ] 로그인이 작동함
- [ ] 이메일 인증 링크가 정상 작동함
- [ ] 비밀번호 재설정이 작동함

### 6-3. 장바구니 기능 확인

- [ ] 로그인 후 장바구니에 상품 추가 가능
- [ ] 장바구니 페이지가 정상 작동함
- [ ] 장바구니 아이템이 유지됨

---

## 7. 문제 해결

### 문제 1: 빌드 실패

**증상**: Vercel 배포 시 빌드 에러 발생

**해결**:
1. 로컬에서 `npm run build` 실행하여 에러 확인
2. 에러 메시지 확인 및 수정
3. 다시 커밋 및 푸시

### 문제 2: 환경 변수가 적용되지 않음

**증상**: 배포된 사이트에서 Supabase 연결 실패

**해결**:
1. Vercel 대시보드 → Project Settings → Environment Variables 확인
2. 변수명이 정확한지 확인 (`VITE_` 접두사 필수)
3. **"Redeploy"** 클릭하여 재배포

### 문제 3: 이메일 인증이 작동하지 않음

**증상**: 이메일 인증 링크 클릭 시 오류

**해결**:
1. Supabase 대시보드 → Authentication → URL Configuration 확인
2. Redirect URLs에 배포된 URL이 추가되어 있는지 확인
3. Site URL이 올바른지 확인

### 문제 4: 404 에러 (페이지를 찾을 수 없음)

**증상**: 직접 URL 접근 시 404 에러

**해결**:
1. Vercel 프로젝트 설정 확인
2. `vercel.json` 파일 생성 (아래 참고)

---

## 8. Vercel 설정 파일 (선택사항)

프로젝트 루트에 `vercel.json` 파일을 생성하여 추가 설정:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

이 파일은 React Router의 클라이언트 사이드 라우팅을 위해 필요합니다.

---

## 9. 자동 배포 설정

### 9-1. GitHub 연동 시 자동 배포

GitHub와 연동하면:
- `main` 브랜치에 푸시할 때마다 자동 배포
- Pull Request 생성 시 Preview 배포

### 9-2. 배포 알림 설정

1. Vercel 대시보드 → Project Settings → Notifications
2. 이메일 또는 Slack 알림 설정

---

## 10. 프로덕션 최적화

### 10-1. 환경 변수 확인

프로덕션 환경 변수가 올바르게 설정되었는지 확인:

```bash
# Vercel CLI로 확인 (선택사항)
npm i -g vercel
vercel env ls
```

### 10-2. 성능 모니터링

1. Vercel 대시보드 → Analytics 탭
2. 페이지 로드 시간, 트래픽 등 확인

### 10-3. 도메인 설정 (선택사항)

1. Vercel 대시보드 → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 안내에 따라 도메인 연결

---

## 11. 배포 후 체크리스트

배포 완료 후 다음을 확인하세요:

- [ ] 홈 페이지 로드 확인
- [ ] 상품 목록 표시 확인
- [ ] 회원가입/로그인 기능 확인
- [ ] 이메일 인증 링크 작동 확인
- [ ] 장바구니 기능 확인
- [ ] 모바일 반응형 확인
- [ ] Supabase Redirect URLs 설정 확인
- [ ] 환경 변수 설정 확인

---

## 12. 빠른 배포 명령어 (CLI 사용)

Vercel CLI를 사용하여 배포할 수도 있습니다:

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

---

## 💡 팁

1. **Preview 배포**: Pull Request마다 Preview URL이 생성되어 테스트 가능
2. **환경 변수 관리**: Production, Preview, Development 환경별로 다른 값 설정 가능
3. **빌드 로그**: Vercel 대시보드에서 상세한 빌드 로그 확인 가능
4. **롤백**: 문제 발생 시 이전 배포로 즉시 롤백 가능

---

## 🆘 추가 도움말

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel Discord 커뮤니티](https://vercel.com/discord)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

---

이 가이드를 따라 설정하면 Solbebe 프로젝트가 Vercel에 성공적으로 배포됩니다! 🚀







