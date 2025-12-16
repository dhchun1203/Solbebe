-- ============================================
-- 모든 상품 이미지 URL 업데이트 SQL
-- ============================================
-- 
-- 테이블 구조:
-- products (
--   id uuid,
--   name text,
--   price integer,
--   category text,
--   sizes text[],
--   colors text[],
--   images text[],  -- 이미지 URL 배열
--   description text,
--   material text,
--   care text,
--   created_at timestamp
-- )
--
-- 사용 방법:
-- 1. Supabase Storage에서 각 폴더의 파일명 확인
-- 2. 아래 SQL의 URL 부분을 실제 파일명에 맞게 수정
-- 3. 각 UPDATE 문을 순차적으로 실행
--
-- 파일명 규칙: [카테고리]-[상품명]-[색상]-[뷰].png
-- ============================================

-- ============================================
-- 1. 부드러운 베이비 바디슈트 (상의)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-detail.png'
]
WHERE name = '부드러운 베이비 바디슈트';

-- ============================================
-- 2. 베이비 긴팔 티셔츠 (상의)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-long-sleeve-tshirt-blue-detail.png'
]
WHERE name = '베이비 긴팔 티셔츠';

-- ============================================
-- 3. 소프트 베이비 팬츠 (하의)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-pants-blue-detail.png'
]
WHERE name = '소프트 베이비 팬츠';

-- ============================================
-- 4. 베이비 반바지 (하의)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/bottom-shorts-blue-detail.png'
]
WHERE name = '베이비 반바지';

-- ============================================
-- 5. 코지 베이비 원피스 (원피스)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-detail.png'
]
WHERE name = '코지 베이비 원피스';

-- ============================================
-- 6. 귀여운 베이비 모자 (악세서리)
-- ============================================

UPDATE products 
SET images = ARRAY[
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-beige-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-beige-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-beige-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-pink-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-pink-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-pink-detail.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-blue-front.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-blue-side.png',
  'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/accessory-hat-blue-detail.png'
]
WHERE name = '귀여운 베이비 모자';

-- ============================================
-- 확인 쿼리: 모든 상품의 이미지 확인
-- ============================================

SELECT 
  id,
  name,
  category,
  array_length(images, 1) as image_count,
  images
FROM products
ORDER BY category, name;

-- ============================================
-- 개별 상품 확인 (필요시)
-- ============================================

-- SELECT id, name, images 
-- FROM products 
-- WHERE name = '부드러운 베이비 바디슈트';

