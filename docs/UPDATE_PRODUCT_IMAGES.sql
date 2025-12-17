-- ============================================
-- 상품 이미지 URL 업데이트 SQL
-- ============================================

-- 방법 1: "부드러운 베이비 바디슈트" 상품의 images 배열을 전체 교체
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
-- 방법 2: 기존 이미지에 추가 (기존 이미지가 있는 경우)
-- ============================================

-- 기존 images 배열에 새 이미지들을 추가하려면:
-- UPDATE products 
-- SET images = images || ARRAY[
--   'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-front.png',
--   'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-side.png',
--   -- ... 나머지 URL들
-- ]
-- WHERE name = '부드러운 베이비 바디슈트';

-- ============================================
-- 확인 쿼리: 업데이트된 이미지 확인
-- ============================================

SELECT id, name, images 
FROM products 
WHERE name = '부드러운 베이비 바디슈트';

-- ============================================
-- 참고: 파일명 오타 수정
-- ============================================
-- 
-- 주의: 하나의 URL에 .png.png가 중복되어 있습니다:
-- 'top-bodysuit-pink-detail.png.png'
-- 
-- 이 파일명을 Supabase Storage에서 수정하거나,
-- 아래와 같이 올바른 URL로 수정하세요:
-- 
-- 'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-detail.png'
-- 
-- (위의 .png.png를 .png로 수정)






