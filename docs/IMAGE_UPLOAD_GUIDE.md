# 이미지 업로드 및 적용 가이드

생성한 AI 이미지를 Supabase Storage에 업로드하고 데이터베이스에 적용하는 방법입니다.

---

## 📌 목차

1. [Supabase Storage 설정](#1-supabase-storage-설정)
2. [이미지 업로드 방법](#2-이미지-업로드-방법)
3. [데이터베이스에 URL 적용](#3-데이터베이스에-url-적용)
4. [자동화 스크립트 (선택사항)](#4-자동화-스크립트-선택사항)

---

## 1. Supabase Storage 설정

### 1-1. Storage 버킷 생성

1. **Supabase 대시보드 접속**
   - 프로젝트 선택
   - 왼쪽 사이드바에서 **"Storage"** 클릭

2. **새 버킷 생성**
   - **"New bucket"** 또는 **"Create bucket"** 클릭
   - 버킷 정보 입력:
     - **Name**: `product-images`
     - **Public bucket**: ✅ 체크 (공개 접근 허용)
     - **File size limit**: `5 MB` (또는 필요에 따라 조정)
     - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

3. **"Create bucket"** 클릭

### 1-2. Storage 정책 설정 (선택사항)

개발 단계에서는 버킷을 Public으로 설정했으므로 추가 정책이 필요 없습니다.
프로덕션에서는 더 세밀한 권한 설정이 필요할 수 있습니다.

---

## 2. 이미지 업로드 방법

### 방법 1: Supabase 대시보드에서 업로드 (간단)

1. **Storage → product-images** 클릭
2. **"Upload file"** 버튼 클릭
3. 이미지 파일 선택 (여러 개 선택 가능)
4. 업로드 완료 후 파일명 클릭
5. **"Copy URL"** 버튼으로 URL 복사

**URL 형식**:
```
https://[project-id].supabase.co/storage/v1/object/public/product-images/[filename]
```

### 방법 2: 폴더 구조로 정리 (권장)

Storage 내부에 카테고리별 폴더 생성:

1. **product-images** 버킷 내에서
2. 각 카테고리별 폴더 생성:
   - `top/` - 상의
   - `bottom/` - 하의
   - `dress/` - 원피스
   - `accessory/` - 악세서리

3. 각 폴더에 해당 이미지 업로드

**URL 형식**:
```
https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-1.jpg
```

### 방법 3: 코드로 업로드 (고급)

`src/utils/uploadImage.js` 파일 생성:

```javascript
import { supabase } from '../services/supabase'

export const uploadProductImage = async (file, category, productName) => {
  try {
    // 파일명 생성: category-productname-timestamp.jpg
    const fileExt = file.name.split('.').pop()
    const fileName = `${category}-${productName}-${Date.now()}.${fileExt}`
    const filePath = `${category}/${fileName}`

    // Storage에 업로드
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw error
  }
}
```

---

## 3. 데이터베이스에 URL 적용

### 방법 1: Table Editor에서 직접 수정

1. **Table Editor → products** 클릭
2. 수정할 상품 행 클릭
3. **images** 필드 클릭
4. JSON 배열 형식으로 URL 입력:

```json
[
  "https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-main.jpg",
  "https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-detail.jpg",
  "https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-side.jpg"
]
```

5. **Save** 클릭

### 방법 2: SQL로 업데이트

#### 단일 상품 업데이트

```sql
UPDATE products 
SET images = ARRAY[
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-main.jpg',
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-detail.jpg'
]
WHERE name = '부드러운 베이비 바디슈트';
```

#### 여러 상품 일괄 업데이트

```sql
-- 상의 카테고리
UPDATE products 
SET images = ARRAY[
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/top/' || 
  LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
]
WHERE category = 'top';

-- 하의 카테고리
UPDATE products 
SET images = ARRAY[
  'https://[project-id].supabase.co/storage/v1/object/public/product-images/bottom/' || 
  LOWER(REPLACE(name, ' ', '-')) || '-main.jpg'
]
WHERE category = 'bottom';
```

### 방법 3: CSV 임포트 (많은 상품일 경우)

1. **CSV 파일 준비** (`products_update.csv`):
```csv
id,images
상품-uuid-1,"[""https://...image1.jpg"",""https://...image2.jpg""]"
상품-uuid-2,"[""https://...image3.jpg"",""https://...image4.jpg""]"
```

2. Supabase Table Editor에서 CSV 임포트

---

## 4. 자동화 스크립트 (선택사항)

### 이미지 URL 업데이트 스크립트

`scripts/updateImageUrls.js` 파일 생성:

```javascript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// 이미지 URL 매핑
const imageMapping = {
  '부드러운 베이비 바디슈트': [
    'https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-main.jpg',
    'https://[project-id].supabase.co/storage/v1/object/public/product-images/top/bodysuit-pink-detail.jpg'
  ],
  '코지 베이비 원피스': [
    'https://[project-id].supabase.co/storage/v1/object/public/product-images/dress/dress-blue-main.jpg',
    'https://[project-id].supabase.co/storage/v1/object/public/product-images/dress/dress-blue-detail.jpg'
  ],
  // ... 더 많은 매핑
}

async function updateImages() {
  for (const [productName, imageUrls] of Object.entries(imageMapping)) {
    const { data, error } = await supabase
      .from('products')
      .update({ images: imageUrls })
      .eq('name', productName)

    if (error) {
      console.error(`업데이트 실패: ${productName}`, error)
    } else {
      console.log(`✓ 업데이트 완료: ${productName}`)
    }
  }
}

updateImages()
```

실행:
```bash
node scripts/updateImageUrls.js
```

---

## 📝 작업 체크리스트

### 업로드 전
- [ ] Storage 버킷 생성 완료
- [ ] 폴더 구조 결정 (카테고리별 분리 여부)
- [ ] 파일명 규칙 정리
- [ ] 이미지 최적화 완료 (크기, 형식)

### 업로드 중
- [ ] 카테고리별로 순차 업로드
- [ ] 각 이미지 URL 복사 및 정리
- [ ] 파일명과 상품명 매핑 정리

### 데이터베이스 적용
- [ ] 각 상품의 images 필드에 URL 배열 입력
- [ ] 메인 이미지가 첫 번째 요소인지 확인
- [ ] 프론트엔드에서 이미지 표시 확인

### 확인
- [ ] 홈 페이지 상품 카드 이미지 확인
- [ ] 상품 목록 페이지 이미지 확인
- [ ] 상품 상세 페이지 갤러리 확인
- [ ] 모바일 반응형 확인
- [ ] 이미지 로딩 속도 확인

---

## 🔧 문제 해결

### 이미지가 표시되지 않는 경우

1. **URL 확인**
   - URL이 올바른지 확인
   - 버킷이 Public으로 설정되었는지 확인

2. **CORS 문제**
   - Supabase Storage는 기본적으로 CORS 설정됨
   - 문제가 지속되면 Storage 설정에서 확인

3. **파일명 문제**
   - 특수문자 포함 여부 확인
   - 공백 대신 하이픈(-) 사용 권장

### 이미지 업로드 실패

1. **파일 크기 확인**
   - 버킷의 파일 크기 제한 확인
   - 필요시 이미지 압축

2. **파일 형식 확인**
   - JPG, PNG, WebP만 허용되는지 확인
   - MIME 타입 확인

---

## 💡 최적화 팁

1. **이미지 압축**
   - 온라인 도구: [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
   - 로컬 도구: ImageOptim, JPEGmini

2. **WebP 형식 사용**
   - 더 작은 파일 크기
   - 최신 브라우저 지원

3. **CDN 활용**
   - Supabase Storage는 CDN을 통해 전송
   - 추가 CDN 설정 불필요

---

이 가이드를 따라 이미지를 업로드하고 적용하세요! 🖼️






