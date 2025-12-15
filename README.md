# Solbebe - 아기 의류 쇼핑몰 MVP

React + Vite + Tailwind CSS + Supabase 기반의 아기 의류 쇼핑몰 MVP 프로젝트입니다.

파스텔톤의 감성적인 UI/UX로 구현된 포트폴리오용 이커머스 사이트입니다.

---

## 📌 프로젝트 개요

**Baby Apparel Store – MVP Portfolio Version**

- **목적**: React 기반 쇼핑몰 UI/UX 구현 및 프론트엔드 실력 포트폴리오 제작
- **타겟**: 아기/유아 의류에 관심 있는 고객, 모바일 쇼핑 선호 사용자
- **핵심 플로우**: Home → Product List → Product Detail → Inquiry Form → Success Page

---

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치

```bash
# 저장소 클론 (또는 프로젝트 다운로드)
git clone <repository-url>
cd Solbebe

# 의존성 설치
npm install
```

### 2. Supabase 설정

**상세 가이드는 [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) 참고**

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `docs/SUPABASE_SQL.sql` 실행
3. Settings → API에서 URL과 Key 복사
4. 프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 📁 프로젝트 구조

```
Solbebe/
├── docs/                          # 문서
│   ├── SUPABASE_SETUP.md         # Supabase 설정 가이드
│   ├── SUPABASE_SQL.sql          # 데이터베이스 SQL 파일
│   └── QUICK_START.md            # 빠른 시작 가이드
│
├── src/
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── common/              # 공통 컴포넌트
│   │   │   ├── CategoryCard.jsx # 카테고리 카드
│   │   │   └── InquiryButton.jsx # 문의 버튼
│   │   ├── layout/              # 레이아웃 컴포넌트
│   │   │   ├── Header.jsx       # 헤더
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
│   │   └── Admin/               # 관리자 페이지 (예정)
│   │
│   ├── services/                # API 서비스
│   │   ├── supabase.js          # Supabase 클라이언트 설정
│   │   └── api.js               # API 함수 (상품, 문의)
│   │
│   ├── store/                   # Zustand 상태 관리
│   │   └── productStore.js      # 상품 상태 관리
│   │
│   ├── router/                  # 라우터 설정
│   │   └── index.jsx            # React Router 설정
│   │
│   ├── styles/                  # 전역 스타일
│   │   └── index.css            # Tailwind CSS + 전역 스타일
│   │
│   ├── hooks/                   # 커스텀 훅 (예정)
│   ├── utils/                   # 유틸리티 함수 (예정)
│   ├── types/                   # TypeScript 타입 (예정)
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

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅
- **Zustand** - 상태 관리 라이브러리

### Backend / Database
- **Supabase** - 백엔드 서비스
  - PostgreSQL 데이터베이스
  - RESTful API
  - Storage (이미지 저장용)

### 배포
- **Vercel** - 프론트엔드 배포
- **Supabase** - 백엔드 및 데이터베이스

---

## 📄 페이지 구성 및 기능

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
  - 상품 정보 자동 표시 (읽기 전용)
  - 입력 필드: 이름, 연락처, 요청사항
  - 선택 옵션 표시 (사이즈, 색상)
  - Supabase에 데이터 저장
  - 제출 후 성공 페이지로 이동
- **데이터 저장**: `inquiries` 테이블에 INSERT

### 5. Inquiry Success (문의 성공)
- **경로**: `/inquiry/success`
- **기능**:
  - 성공 메시지 표시
  - "홈으로 돌아가기" 버튼

### 6. Admin (관리자 페이지 - 예정)
- **경로**: `/admin`
- **예정 기능**:
  - Supabase Auth를 통한 로그인
  - 상품 CRUD (생성, 조회, 수정, 삭제)
  - 문의 리스트 조회
  - 문의 처리 상태 변경

---

## 🧩 컴포넌트 설명

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

## 🗄 데이터베이스 구조

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
| product_id | UUID | 상품 ID (Foreign Key) |
| options | JSONB | 선택 옵션 (size, color 등) |
| message | TEXT | 요청사항 |
| created_at | TIMESTAMP | 생성일시 |

---

## 🎨 디자인 가이드

### 컬러 팔레트
- **Cream**: `#FFF8F0` - 배경색
- **Beige**: `#F5E6D3` - 보조 배경
- **Pink**: `#FFE5E5` - 주요 액센트 (버튼, 링크)
- **Blue**: `#E5F3FF` - 보조 액센트

### 타이포그래피
- **폰트**: Pretendard (한글 최적화)
- **Fallback**: -apple-system, BlinkMacSystemFont, system-ui

### 스타일 규칙
- **모서리**: `rounded-xl` (둥근 모서리)
- **그림자**: `shadow-md` (은은한 그림자)
- **반응형**: 모바일 퍼스트 (Mobile First)
- **그리드**: 모바일 2열, 데스크탑 4열

### 레이아웃
- **컨테이너**: `container mx-auto px-4`
- **여백**: 넉넉한 패딩과 마진 사용
- **이미지**: 큰 이미지 + 얇은 텍스트 조합

---

## 🔌 API 구조

### 상품 API (`productApi`)

```javascript
// 모든 상품 조회
productApi.getAllProducts()

// 카테고리별 상품 조회
productApi.getProductsByCategory(category)

// 상품 상세 조회
productApi.getProductById(id)

// 추천 상품 조회
productApi.getRecommendedProducts(limit)

// 관리자: 상품 생성
productApi.createProduct(product)

// 관리자: 상품 수정
productApi.updateProduct(id, product)

// 관리자: 상품 삭제
productApi.deleteProduct(id)
```

### 문의 API (`inquiryApi`)

```javascript
// 문의 생성
inquiryApi.createInquiry(inquiry)

// 관리자: 모든 문의 조회
inquiryApi.getAllInquiries()

// 관리자: 문의 상세 조회
inquiryApi.getInquiryById(id)
```

---

## 🔐 환경 변수

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ 주의**: `.env` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)

---

## 📚 상태 관리 (Zustand)

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

---

## 🚀 배포 가이드

### Vercel 배포

1. **Vercel 계정 생성**
   - [Vercel](https://vercel.com) 접속 및 GitHub 연동

2. **프로젝트 연결**
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정 확인

3. **환경 변수 설정**
   - Project Settings → Environment Variables
   - `VITE_SUPABASE_URL` 추가
   - `VITE_SUPABASE_ANON_KEY` 추가

4. **배포 완료**
   - 자동 배포 실행
   - 배포 완료 후 URL 확인

### Supabase 설정

1. **RLS 설정** (프로덕션용)
   - SQL Editor에서 RLS 활성화
   - 정책(Policy) 생성

2. **Storage 설정** (선택사항)
   - Storage 버킷 생성
   - 이미지 업로드 기능 추가

---

## 🐛 문제 해결

### 개발 서버 실행 오류

**문제**: `'vite'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.`

**해결**:
```bash
npm install
```

### 환경 변수가 적용되지 않는 경우

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수명이 `VITE_`로 시작하는지 확인
3. 개발 서버 재시작

### Supabase 연결 오류

1. **"Invalid API key"**
   - `.env` 파일의 키 확인
   - 개발 서버 재시작

2. **"Failed to fetch"**
   - Supabase 프로젝트 URL 확인
   - 네트워크 연결 확인

3. **"relation does not exist"**
   - 테이블이 생성되었는지 확인
   - SQL 파일 다시 실행

---

## 📖 문서

- **[Supabase 설정 가이드](./docs/SUPABASE_SETUP.md)** - 상세한 Supabase 설정 방법
- **[빠른 시작 가이드](./docs/QUICK_START.md)** - 빠른 시작 가이드
- **[Supabase SQL 파일](./docs/SUPABASE_SQL.sql)** - 데이터베이스 설정 SQL

---

## 🔄 개발 워크플로우

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

## ✅ 체크리스트

### 초기 설정
- [ ] Node.js 설치 (v18 이상)
- [ ] `npm install` 실행
- [ ] Supabase 프로젝트 생성
- [ ] SQL 파일 실행 (테이블 생성)
- [ ] `.env` 파일 생성 및 환경 변수 설정
- [ ] 개발 서버 실행 확인

### 기능 테스트
- [ ] 홈 페이지 상품 표시 확인
- [ ] 상품 목록 필터링 동작 확인
- [ ] 상품 상세 페이지 옵션 선택 확인
- [ ] 문의 폼 제출 및 데이터 저장 확인
- [ ] 반응형 디자인 확인 (모바일/데스크탑)

### 배포 준비
- [ ] 프로덕션 빌드 테스트
- [ ] 환경 변수 설정 (Vercel)
- [ ] RLS 정책 설정 (Supabase)
- [ ] 도메인 연결 (선택사항)

---

## 🎯 향후 개선 사항

### 기능 추가
- [ ] 관리자 페이지 구현
- [ ] Supabase Auth를 통한 로그인
- [ ] 상품 검색 기능
- [ ] 장바구니 기능
- [ ] 찜하기 기능
- [ ] 상품 리뷰 기능

### UI/UX 개선
- [ ] 로딩 스피너 추가
- [ ] 에러 메시지 개선
- [ ] 애니메이션 효과 추가
- [ ] 이미지 lazy loading
- [ ] 무한 스크롤

### 성능 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 캐싱 전략
- [ ] SEO 최적화

---

## 📄 라이선스

MIT License

---

## 👥 기여

이 프로젝트는 포트폴리오용 MVP 프로젝트입니다. 개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using React, Vite, Tailwind CSS, and Supabase**
