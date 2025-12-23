# 이미지 URL SQL 자동 생성 가이드

Supabase Storage에 업로드된 이미지 파일명을 기반으로 SQL을 자동 생성하는 방법입니다.

---

## 📌 방법 1: Storage에서 파일명 확인 후 수동 입력

### 1단계: Storage 파일명 확인

1. Supabase 대시보드 → Storage → product-images
2. 각 폴더(`top/`, `bottom/`, `dress/`, `accessory/`) 클릭
3. 파일명 목록 복사

### 2단계: SQL 템플릿 사용

`docs/UPDATE_ALL_PRODUCT_IMAGES.sql` 파일을 열고, 각 상품의 파일명에 맞게 URL 수정

---

## 📌 방법 2: 파일명 목록 제공 시 자동 생성

Storage에 있는 파일명 목록을 알려주시면 SQL을 자동 생성해드립니다.

### 필요한 정보

각 폴더별로 파일명 목록:

```
top/ 폴더:
- top-bodysuit-beige-front.png
- top-bodysuit-beige-side.png
- ... (나머지 파일명들)

bottom/ 폴더:
- bottom-pants-beige-front.png
- ... (나머지 파일명들)

dress/ 폴더:
- dress-dress-beige-front.png
- ... (나머지 파일명들)

accessory/ 폴더:
- accessory-hat-beige-front.png
- ... (나머지 파일명들)
```

---

## 📌 방법 3: SQL로 Storage 파일 목록 조회 (고급)

Supabase Storage의 파일 목록을 SQL로 조회할 수 없으므로, 
Storage 대시보드에서 직접 확인하거나 Storage API를 사용해야 합니다.

### Storage API 사용 예시 (JavaScript)

```javascript
// Storage의 파일 목록 가져오기
const { data, error } = await supabase.storage
  .from('product-images')
  .list('top', {
    limit: 100,
    offset: 0,
  })

if (data) {
  console.log('top 폴더 파일 목록:', data.map(file => file.name))
}
```

---

## 🔧 파일명이 다른 경우

Storage에 업로드된 실제 파일명이 규칙과 다를 수 있습니다.

### 확인 방법

1. Storage에서 각 폴더의 파일명 확인
2. `docs/UPDATE_ALL_PRODUCT_IMAGES.sql`의 URL 부분을 실제 파일명에 맞게 수정

### 예시

만약 파일명이 `bodysuit-beige-1.png` 형식이라면:

```sql
UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/bodysuit-beige-1.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/bodysuit-beige-2.png',
  -- ... 실제 파일명에 맞게 수정
]
WHERE name = '부드러운 베이비 바디슈트';
```

---

## ✅ 체크리스트

- [ ] Storage의 각 폴더 파일명 확인
- [ ] 각 상품별로 9장의 이미지가 있는지 확인
- [ ] 파일명 규칙 확인 (카테고리-상품명-색상-뷰.png)
- [ ] SQL의 URL 부분을 실제 파일명에 맞게 수정
- [ ] SQL 실행 후 확인 쿼리로 검증

---

Storage에 있는 실제 파일명 목록을 알려주시면 정확한 SQL을 생성해드리겠습니다! 📝











