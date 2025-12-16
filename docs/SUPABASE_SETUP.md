# Supabase 설정 가이드

이 가이드는 Solbebe 프로젝트에서 Supabase를 설정하는 상세한 단계별 안내입니다.

---

## 📌 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 테이블 생성](#2-데이터베이스-테이블-생성)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [Row Level Security (RLS) 설정](#4-row-level-security-rls-설정)
5. [테스트 데이터 입력](#5-테스트-데이터-입력)
6. [연동 확인](#6-연동-확인)

---

## 1. Supabase 프로젝트 생성

### 1-1. Supabase 가입 및 로그인

1. [Supabase 공식 사이트](https://supabase.com)에 접속
2. **"Start your project"** 또는 **"Sign in"** 클릭
3. GitHub 계정으로 가입/로그인 (또는 이메일 가입)

### 1-2. 새 프로젝트 생성

1. 대시보드에서 **"New Project"** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `solbebe` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (나중에 필요하니 저장해두세요)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서버)
   - **Pricing Plan**: Free tier 선택
3. **"Create new project"** 클릭
4. 프로젝트 생성 완료까지 약 2분 대기

---

## 2. 데이터베이스 테이블 생성

### 2-1. SQL Editor 접속

1. 왼쪽 사이드바에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭

### 2-2. products 테이블 생성

아래 SQL 코드를 복사하여 SQL Editor에 붙여넣고 **"Run"** 클릭:

```sql
-- products 테이블 생성
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  sizes TEXT[],
  colors TEXT[],
  images TEXT[],
  description TEXT,
  material TEXT,
  care TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- products 테이블에 인덱스 추가 (성능 최적화)
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- products 테이블에 코멘트 추가
COMMENT ON TABLE products IS '상품 정보 테이블';
COMMENT ON COLUMN products.category IS '카테고리: top, bottom, dress, accessory';
```

### 2-3. inquiries 테이블 생성

다음 SQL 코드를 실행:

```sql
-- inquiries 테이블 생성
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  options JSONB,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- inquiries 테이블에 인덱스 추가
CREATE INDEX idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- inquiries 테이블에 코멘트 추가
COMMENT ON TABLE inquiries IS '구매 문의 테이블';
COMMENT ON COLUMN inquiries.options IS '선택한 옵션 (size, color 등)';
```

### 2-4. 테이블 생성 확인

1. 왼쪽 사이드바에서 **"Table Editor"** 클릭
2. `products`와 `inquiries` 테이블이 보이는지 확인

---

## 3. 환경 변수 설정

### 3-1. Supabase 프로젝트 정보 확인

1. 왼쪽 사이드바에서 **"Settings"** (톱니바퀴 아이콘) 클릭
2. **"API"** 메뉴 클릭
3. 다음 정보를 복사해두세요:
   - **Project URL**: `https://ougzjptxjnoihgdgagyi.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Z3pqcHR4am5vaWhnZGdhZ3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjUxMDAsImV4cCI6MjA4MTM0MTEwMH0.Wpk-xI7tORXkqHITTrc1imXP7C2BCfVEdUi3WnBc7ls`

### 3-2. 프로젝트에 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **주의사항**:
- `.env` 파일은 `.gitignore`에 추가되어 있어 Git에 커밋되지 않습니다
- 실제 URL과 키는 위 예시를 자신의 Supabase 프로젝트 값으로 변경하세요

### 3-3. 환경 변수 적용 확인

`src/services/supabase.js` 파일이 환경 변수를 올바르게 사용하고 있는지 확인:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

---

## 4. Row Level Security (RLS) 설정

### 4-1. RLS 활성화 (선택사항)

보안을 위해 RLS를 활성화할 수 있습니다. 개발 단계에서는 비활성화해도 됩니다.

#### Option A: RLS 비활성화 (개발용 - 간단)

SQL Editor에서 실행:

```sql
-- RLS 비활성화 (모든 사용자가 접근 가능)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
```

#### Option B: RLS 활성화 (프로덕션용 - 보안)

SQL Editor에서 실행:

```sql
-- RLS 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- products 테이블: 모든 사용자가 조회 가능
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- inquiries 테이블: 모든 사용자가 생성 가능, 관리자만 조회 가능
CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## 5. 테스트 데이터 입력

### 5-1. Table Editor에서 직접 입력

1. **"Table Editor"** → **"products"** 클릭
2. **"Insert row"** 클릭
3. 다음 예시 데이터 입력:

```
name: 부드러운 베이비 바디슈트
price: 29000
category: top
sizes: ["70", "80", "90"]
colors: ["크림", "핑크", "블루"]
images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]
description: 아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다.
material: 순면 100%, 인체에 무해한 염료 사용
care: 30도 이하 세탁, 중성세제 사용, 그늘에서 건조
```

### 5-2. SQL로 일괄 입력 (더 빠름)

SQL Editor에서 실행:

```sql
-- 테스트 상품 데이터 삽입
INSERT INTO products (name, price, category, sizes, colors, images, description, material, care)
VALUES
  (
    '부드러운 베이비 바디슈트',
    29000,
    'top',
    ARRAY['70', '80', '90'],
    ARRAY['크림', '핑크', '블루'],
    ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    '아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다.',
    '순면 100%, 인체에 무해한 염료 사용',
    '30도 이하 세탁, 중성세제 사용, 그늘에서 건조'
  ),
  (
    '코지 베이비 원피스',
    35000,
    'dress',
    ARRAY['70', '80', '90'],
    ARRAY['베이지', '블루', '화이트'],
    ARRAY['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'],
    '편안하고 귀여운 원피스입니다.',
    '면 혼방, 부드러운 원단',
    '손세탁 권장, 그늘 건조'
  ),
  (
    '소프트 베이비 팬츠',
    25000,
    'bottom',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '그레이', '베이지'],
    ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
    '활동하기 편한 베이비 팬츠입니다.',
    '면 100%, 신축성 있는 원단',
    '세탁기 사용 가능, 중성세제 사용'
  ),
  (
    '귀여운 베이비 모자',
    15000,
    'accessory',
    ARRAY['Free'],
    ARRAY['핑크', '블루', '화이트'],
    ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'],
    '귀여운 베이비 모자입니다.',
    '면 소재',
    '손세탁 권장'
  ),
  (
    '베이비 긴팔 티셔츠',
    22000,
    'top',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '크림', '핑크'],
    ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    '편안한 긴팔 티셔츠입니다.',
    '순면 100%',
    '세탁기 사용 가능'
  ),
  (
    '베이비 반바지',
    20000,
    'bottom',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '그레이', '블루'],
    ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
    '여름에 시원한 반바지입니다.',
    '면 혼방',
    '세탁기 사용 가능'
  );
```

---

## 6. 연동 확인

### 6-1. 개발 서버 실행

```bash
npm install
npm run dev
```

### 6-2. 브라우저에서 확인

1. `http://localhost:5173` 접속
2. 홈 페이지에서 상품이 표시되는지 확인
3. 상품 목록 페이지에서 필터링 동작 확인
4. 상품 상세 페이지에서 데이터 로드 확인

### 6-3. 문의 기능 테스트

1. 상품 상세 페이지에서 사이즈/색상 선택
2. "구매 문의하기" 버튼 클릭
3. 문의 폼 작성 후 제출
4. Supabase Table Editor에서 `inquiries` 테이블에 데이터가 추가되었는지 확인

### 6-4. 콘솔 에러 확인

브라우저 개발자 도구(F12) → Console 탭에서 에러 메시지 확인

**일반적인 에러와 해결책**:

1. **"Invalid API key"**
   - `.env` 파일의 키가 올바른지 확인
   - 개발 서버를 재시작 (`npm run dev`)

2. **"Failed to fetch"**
   - Supabase 프로젝트 URL이 올바른지 확인
   - 네트워크 연결 확인

3. **"relation does not exist"**
   - 테이블이 제대로 생성되었는지 Table Editor에서 확인
   - SQL을 다시 실행

---

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트 가이드](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🔧 문제 해결

### 환경 변수가 적용되지 않는 경우

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버 재시작
3. Vite는 `VITE_` 접두사가 필요함 (확인)

### 테이블을 삭제하고 다시 만들고 싶은 경우

```sql
-- 주의: 모든 데이터가 삭제됩니다!
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 그 다음 위의 테이블 생성 SQL을 다시 실행
```

---

## ✅ 체크리스트

설정이 완료되면 다음을 확인하세요:

- [ ] Supabase 프로젝트 생성 완료
- [ ] `products` 테이블 생성 완료
- [ ] `inquiries` 테이블 생성 완료
- [ ] `.env` 파일 생성 및 환경 변수 입력
- [ ] 테스트 데이터 입력 완료
- [ ] 홈 페이지에서 상품 목록 표시 확인
- [ ] 상품 상세 페이지 동작 확인
- [ ] 문의 폼 제출 및 데이터 저장 확인

---

설정이 완료되면 실제 프로덕션 환경에서는 RLS를 활성화하고, 환경 변수를 Vercel 등 배포 플랫폼에 설정하는 것을 권장합니다.



