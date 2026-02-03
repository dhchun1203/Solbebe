# Solbebe - 아기 의류 쇼핑몰 MVP

React + Vite + Tailwind CSS 기반의 아기 의류 쇼핑몰 MVP 프로젝트입니다.

파스텔톤의 감성적인 UI/UX로 구현된 포트폴리오용 이커머스 사이트입니다.

## 주요 기능

- **상품 탐색**: 상품 목록, 상세 페이지, 카테고리 필터링, 정렬 기능
- **구매 문의**: 단일 상품 문의 폼 제출 및 성공 페이지
- **다크모드**: 라이트/다크 모드 전환, 시스템 설정 자동 감지, 설정 저장
- **반응형 디자인**: 모바일 퍼스트 디자인, 모바일/태블릿/데스크탑 지원
- **성능 최적화**: 코드 스플리팅, 레이지 로딩, 에러 핸들링

## 현재 상태 요약 (2026-02-03)

- **Supabase 연동 제거**: 인증/프로필/관리자/장바구니 기능 비활성화
- **정적 데이터 사용**: 상품 데이터는 `src/data/products.js`의 더미 데이터로 제공
- **배포 유지**: Vercel 배포 구조 유지, GitHub Pages 브랜치 제거
- **문서 참고**: Supabase 관련 문서는 레거시 참고용

---

## 프로젝트 개요

**Baby Apparel Store – MVP Portfolio Version**

- **목적**: React 기반 쇼핑몰 UI/UX 구현 및 프론트엔드 실력 포트폴리오 제작
- **타겟**: 아기/유아 의류에 관심 있는 고객, 모바일 쇼핑 선호 사용자
- **핵심 플로우**: 
  - **일반 사용자**: Home → Product List → Product Detail → Inquiry → Success
- **주요 특징**:
  - 파스텔톤 감성 UI/UX
  - 다크모드 지원 (라이트/다크 자동 전환)
  - 모바일 퍼스트 반응형 디자인
  - 코드 스플리팅 및 레이지 로딩으로 최적화된 성능
  - 정적 데이터 기반 데모 플로우

---

## 빠른 시작

### 1. 프로젝트 클론 및 설치

```bash
# 저장소 클론 (또는 프로젝트 다운로드)
git clone <repository-url>
cd Solbebe

# 의존성 설치
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 프로젝트 구조

```
Solbebe/
├── docs/                          # 문서 (일부 Supabase 관련 문서는 레거시)
│   ├── QUICK_START.md            # 빠른 시작 가이드
│
├── src/
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── common/              # 공통 컴포넌트
│   │   │   ├── CategoryCard.jsx # 카테고리 카드
│   │   │   ├── InquiryButton.jsx # 문의 버튼
│   │   │   ├── Toast.jsx         # 토스트 알림
│   │   │   ├── SearchModal.jsx  # 검색 모달
│   │   │   ├── PrivacyModal.jsx # 개인정보처리방침 모달
│   │   │   ├── TermsModal.jsx   # 이용약관 모달
│   │   │   └── ScrollToTop.jsx  # 스크롤 상단 이동
│   │   ├── layout/              # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx       # 헤더 (네비게이션, 검색, 다크모드 토글)
│   │   │   ├── Footer.jsx       # 푸터
│   │   │   └── Layout.jsx       # 레이아웃 래퍼
│   │   └── product/             # 상품 관련 컴포넌트
│   │       └── ProductCard.jsx  # 상품 카드
│   │
│   ├── pages/                   # 페이지 컴포넌트
│   │   ├── Home.jsx             # 홈 페이지
│   │   ├── ProductList.jsx      # 상품 목록 페이지
│   │   ├── ProductDetail.jsx    # 상품 상세 페이지
│   │   ├── Inquiry.jsx          # 구매 문의 페이지
│   │   ├── InquirySuccess.jsx   # 문의 성공 페이지
│   │   ├── ForgotPassword.jsx   # 비밀번호 찾기 (레거시 UI)
│   │   ├── ResetPassword.jsx    # 비밀번호 재설정 (레거시 UI)
│   │
│   ├── services/                # API 서비스
│   │   └── api.js               # API 함수 (더미 상품 데이터)
│   │
│   ├── store/                   # Zustand 상태 관리
│   │   ├── productStore.js      # 상품 상태 관리
│   │   └── themeStore.js        # 테마(다크모드) 상태 관리
│   │
│   ├── router/                  # 라우터 설정
│   │   └── index.jsx            # React Router 설정
│   │
│   ├── hooks/                   # 커스텀 훅
│   │   ├── useClickOutside.js  # 외부 클릭 감지 훅
│   │   ├── useApi.js           # API 호출 훅
│   │   ├── useDebounce.js      # 디바운스 훅
│   │   ├── useCounter.js       # 카운터 훅
│   │   ├── useMousePosition.js # 마우스 위치 추적 훅
│   │   └── useScrollAnimation.js # 스크롤 애니메이션 훅
│   │
│   ├── utils/                   # 유틸리티 함수
│   │   └── errorHandler.js      # 에러 처리 유틸리티
│   │
│   ├── constants/               # 상수 정의
│   │   └── index.js             # 라우트, 에러 메시지, 관리자 이메일 등
│   │
│   ├── styles/                  # 전역 스타일
│   │   └── index.css            # Tailwind CSS + 전역 스타일
│   │
│   ├── App.jsx                  # 메인 App 컴포넌트
│   └── main.jsx                 # React 엔트리 포인트
│
├── .cursorrules                 # Cursor AI 프로젝트 규칙
├── .gitignore                   # Git 무시 파일
├── index.html                   # HTML 엔트리
├── package.json                 # 프로젝트 의존성
├── vite.config.js               # Vite 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── postcss.config.js            # PostCSS 설정
└── README.md                    # 프로젝트 문서
```

---

## 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 CSS 프레임워크 (다크모드 지원)
- **React Router v6** - 클라이언트 사이드 라우팅 (코드 스플리팅, 레이지 로딩)
- **Zustand** - 상태 관리 라이브러리 (경량, 간단한 API)

### Backend / Database
- **없음** - 정적 더미 데이터 사용

### 배포
- **Vercel** - 프론트엔드 배포

---

## 페이지 구성 및 기능

### 1. Home (홈 페이지)
- **경로**: `/`
- **기능**:
  - Hero 섹션 (배너 이미지 + 브랜드 문구)
  - 카테고리 바로가기 (상의, 하의, 원피스, 악세서리)
  - 추천 상품 4-6개 표시
  - 브랜드 스토리 섹션
- **컴포넌트**: `ProductCard`, `CategoryCard`

### 2. Product List (상품 목록)
- **경로**: `/products`
- **기능**:
  - 상품 카드 그리드 레이아웃 (모바일 2열, 데스크탑 4열)
  - 카테고리 필터 (상의/하의/원피스/악세서리)
  - 정렬 옵션 (최신순/가격 낮은순/가격 높은순)
  - 상품 이미지, 가격, 카테고리 태그 표시
- **쿼리 파라미터**: `?category=top` (카테고리 필터)

### 3. Product Detail (상품 상세)
- **경로**: `/products/:id`
- **기능**:
  - 상품 이미지 갤러리 (큰 이미지 + 썸네일 리스트)
  - 상품 정보 (제목, 가격, 별점)
  - 사이즈 선택 (버튼 형태)
  - 색상 선택 (버튼 형태)
  - 설명 탭 (Info / Material / Shipping)
  - "구매 문의하기" 버튼
- **상태 관리**: Zustand를 통한 선택 옵션 저장

### 4. Inquiry (구매 문의)
- **경로**: `/inquiry?productId=xxx`
- **기능**:
  - 단일 상품 문의: 상품 정보 자동 표시 (읽기 전용)
  - 입력 필드: 이름, 연락처, 요청사항
  - 제출 후 성공 페이지로 이동

### 5. Inquiry Success (문의 성공)
- **경로**: `/inquiry/success`
- **기능**:
  - 성공 메시지 표시
  - "홈으로 돌아가기" 버튼

---

## 컴포넌트 설명

### Layout 컴포넌트

#### Header
- 로고 (좌측)
- 네비게이션 메뉴 (우측: 홈, 상품, 카테고리)
- Sticky 헤더 (스크롤 시 상단 고정)

#### Footer
- 로고
- SNS 링크 (Instagram, Facebook, Kakao)
- 카피라이트

### Common 컴포넌트

#### ProductCard
- 상품 이미지 (aspect-square)
- 카테고리 태그
- 상품명
- 가격
- 클릭 시 상품 상세 페이지로 이동

#### CategoryCard
- 카테고리 아이콘
- 카테고리명
- 설명 텍스트
- 클릭 시 해당 카테고리 상품 목록으로 이동

#### InquiryButton
- "구매 문의하기" 버튼
- 상품 ID를 쿼리 파라미터로 전달

---

## 데이터베이스 구조

### products 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key (자동 생성) |
| name | TEXT | 상품명 |
| price | INTEGER | 가격 |
| category | TEXT | 카테고리 (top, bottom, dress, accessory) |
| sizes | TEXT[] | 사이즈 배열 |
| colors | TEXT[] | 색상 배열 |
| images | TEXT[] | 이미지 URL 배열 |
| description | TEXT | 상품 설명 |
| material | TEXT | 원단 정보 |
| care | TEXT | 세탁 방법 |
| created_at | TIMESTAMP | 생성일시 |

### inquiries 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key (자동 생성) |
| name | TEXT | 고객 이름 |
| phone | TEXT | 연락처 |
| email | TEXT | 고객 이메일 |
| user_id | UUID | 로그인한 사용자 ID (선택적) |
| product_id | UUID | 상품 ID (Foreign Key) |
| options | JSONB | 선택 옵션 (size, color, quantity 등) |
| message | TEXT | 요청사항 |
| status | TEXT | 처리 상태 (pending/processing/completed/cancelled) |
| created_at | TIMESTAMP | 생성일시 |

### cart_items 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key (자동 생성) |
| user_id | UUID | 사용자 ID (Foreign Key: auth.users) |
| product_id | UUID | 상품 ID (Foreign Key: products) |
| size | TEXT | 선택한 사이즈 (NULL 가능) |
| color | TEXT | 선택한 색상 (NULL 가능) |
| quantity | INTEGER | 수량 (기본값: 1) |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

---

## 디자인 가이드

### 컬러 팔레트

#### 라이트 모드
- **Cream**: `#FFF8F0` - 배경색
- **Beige**: `#F5E6D3` - 보조 배경
- **Pink**: `#FFE5E5` - 주요 액센트 (배경)
- **Pink Text**: `#FF6B9D` - 주요 액센트 (텍스트, 버튼)
- **Blue**: `#E5F3FF` - 보조 액센트 (배경)
- **Blue Text**: `#3B82F6` - 보조 액센트 (텍스트)
- **Beige Text**: `#B08968` - 보조 텍스트

#### 다크 모드
- **Background**: `gray-900` - 메인 배경
- **Surface**: `gray-800` - 카드/컨테이너 배경
- **Text Primary**: `gray-100` - 주요 텍스트
- **Text Secondary**: `gray-300` - 보조 텍스트
- **Border**: `gray-700` - 테두리

### 타이포그래피
- **폰트**: Gowun Dodum (한글 최적화)
- **Fallback**: -apple-system, BlinkMacSystemFont, system-ui

### 스타일 규칙
- **모서리**: `rounded-xl` (둥근 모서리)
- **그림자**: `shadow-md` (은은한 그림자)
- **반응형**: 모바일 퍼스트 (Mobile First)
- **그리드**: 모바일 2열, 데스크탑 4열
- **다크모드**: Tailwind CSS `dark:` 클래스 사용, 시스템 설정 자동 감지

### 레이아웃
- **컨테이너**: `container mx-auto px-4`
- **여백**: 넉넉한 패딩과 마진 사용
- **이미지**: 큰 이미지 + 얇은 텍스트 조합

### 다크모드 구현
- **방식**: Tailwind CSS `darkMode: 'class'` 사용
- **토글**: Header의 다크모드 버튼으로 전환
- **저장**: 로컬 스토리지에 사용자 설정 저장
- **자동 감지**: 시스템 설정(`prefers-color-scheme`) 자동 감지
- **적용 범위**: 모든 페이지 및 컴포넌트에 다크모드 스타일 적용

---

## API 구조 (정적)

### 상품 데이터 (`productApi`)

```javascript
// 모든 상품 조회
productApi.getAllProducts()

// 카테고리별 상품 조회
productApi.getProductsByCategory(category)

// 상품 상세 조회
productApi.getProductById(id)

// 추천 상품 조회
productApi.getRecommendedProducts(limit)
```

> 상품 데이터는 `src/data/products.js`의 더미 데이터로 제공됩니다.

---

## 환경 변수

별도의 환경 변수 설정 없이 실행됩니다.

---

## 상태 관리 (Zustand)

### productStore

```javascript
{
  products: [],           // 상품 목록
  selectedProduct: null,  // 선택된 상품
  selectedSize: null,     // 선택된 사이즈
  selectedColor: null,    // 선택된 색상
  loading: false,         // 로딩 상태
  error: null,            // 에러 메시지
}
```

**액션**:
- `setProducts(products)` - 상품 목록 설정
- `setSelectedProduct(product)` - 선택 상품 설정
- `setSelectedSize(size)` - 사이즈 선택
- `setSelectedColor(color)` - 색상 선택
- `resetSelection()` - 선택 초기화

### themeStore

```javascript
{
  theme: 'light' | 'dark', // 현재 테마
}
```

**액션**:
- `setTheme(theme)` - 테마 설정
- `toggleTheme()` - 테마 토글
- **자동 기능**: 시스템 설정 감지, 로컬 스토리지 저장

---

## 배포 가이드

### Vercel 배포

1. **Vercel 계정 생성**
   - [Vercel](https://vercel.com) 접속 및 GitHub 연동

2. **프로젝트 연결**
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정 확인

3. **배포 완료**
   - 자동 배포 실행
   - 배포 완료 후 URL 확인

---

## 문제 해결

### 개발 서버 실행 오류

**문제**: `'vite'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.`

**해결**:
```bash
npm install
```

### 환경 변수 관련

- 현재 버전은 환경 변수가 필요하지 않습니다.

---

## 문서

- **[빠른 시작 가이드](./docs/QUICK_START.md)** - 빠른 시작 가이드
- **[AI 이미지 생성 가이드](./docs/AI_IMAGE_GUIDE.md)** - DALL·E/Midjourney/Ideogram로 상품 이미지 생성
- **[Vercel 배포 가이드](./docs/VERCEL_DEPLOYMENT.md)** - Vercel 배포 상세 가이드
- **레거시 문서**: Supabase/관리자/장바구니 관련 문서는 참고용으로 남아 있습니다.

---

## 개발 워크플로우

### 1. 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:5173
```

### 2. 새 기능 추가

1. 컴포넌트는 `src/components/`에 추가
2. 페이지는 `src/pages/`에 추가
3. API 함수는 `src/services/api.js`에 추가
4. 상태 관리는 `src/store/`에 추가

### 3. 스타일 수정

- Tailwind CSS 유틸리티 클래스 사용
- 전역 스타일은 `src/styles/index.css` 수정
- 컬러 팔레트는 `tailwind.config.js`의 `theme.extend.colors` 수정

---

## 체크리스트

### 초기 설정
- [ ] Node.js 설치 (v18 이상)
- [ ] `npm install` 실행
- [ ] 개발 서버 실행 확인

### 기능 테스트
- [x] 홈 페이지 상품 표시 확인
- [x] 상품 목록 필터링 동작 확인
- [x] 상품 상세 페이지 옵션 선택 확인
- [x] 문의 폼 제출 및 성공 페이지 이동 확인
- [x] 다크모드 전환 기능
- [x] 반응형 디자인 확인 (모바일/데스크탑)

### 배포 준비
- [ ] 프로덕션 빌드 테스트
- [ ] 도메인 연결 (선택사항)

---

## 향후 개선 사항

### 기능 추가
- [ ] 상품 검색 기능
- [ ] 찜하기 기능
- [ ] 상품 리뷰 기능
- [ ] 주문/결제 기능
- [ ] 배송 추적 기능

### UI/UX 개선
- [x] 로딩 스피너 추가
- [x] 에러 메시지 개선
- [x] 애니메이션 효과 추가 (Hero 섹션 마우스 추적 등)
- [x] 다크모드 UI 개선
- [ ] 이미지 lazy loading
- [ ] 무한 스크롤

### 성능 최적화
- [ ] 이미지 최적화
- [x] 코드 스플리팅 (React.lazy 사용)
- [x] 레이지 로딩 (페이지별)
- [ ] 캐싱 전략
- [ ] SEO 최적화

---

## 라이선스

MIT License

---

## 기여

이 프로젝트는 포트폴리오용 MVP 프로젝트입니다. 개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

---

## 아키텍처 및 기술적 특징

### 코드 구조
- **컴포넌트 기반**: 재사용 가능한 컴포넌트로 구성
- **페이지 기반 라우팅**: React Router를 통한 SPA 구조
- **상태 관리**: Zustand를 통한 전역 상태 관리 (경량, 간단한 API)
- **데이터 레이어**: `services/api.js`에서 더미 데이터 로드
- **에러 처리**: 통합 에러 핸들러 및 Toast 알림 시스템

### 성능 최적화
- **코드 스플리팅**: React.lazy를 통한 페이지별 레이지 로딩
- **Suspense**: 로딩 상태 관리 및 사용자 경험 개선
- **이미지 최적화**: 외부 이미지 URL 사용 (향후 CDN 연동 가능)

### 접근성 및 UX
- **다크모드**: 시스템 설정 자동 감지 및 수동 전환 지원
- **반응형 디자인**: 모바일 퍼스트 접근 방식
- **로딩 상태**: 명확한 로딩 인디케이터 제공
- **에러 처리**: 사용자 친화적인 에러 메시지 표시
- **폼 검증**: 클라이언트 사이드 폼 검증

### 보안
- **정적 데모**: 인증/권한 관리 기능 미포함

---

## 개발 노트

### 최근 업데이트
- 다크모드 기능 추가 (2024)
- 코드 스플리팅 및 레이지 로딩 적용
- 커스텀 훅 추가 (useApi, useDebounce, useMousePosition 등)
- UI/UX 개선 (애니메이션, 로딩 상태 등)
- Supabase 연동 제거 및 정적 데이터 전환 (2026-02-03)

### 알려진 이슈
- 이미지 lazy loading 미구현 (향후 개선 예정)
- 검색 기능 UI만 구현됨 (백엔드 연동 필요)
- 무한 스크롤 미구현 (페이지네이션 사용 중)

---

**Made with React, Vite, and Tailwind CSS**
