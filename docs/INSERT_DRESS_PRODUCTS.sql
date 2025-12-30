-- ============================================
-- 원피스 카테고리 상품 INSERT SQL
-- ============================================
-- 원피스 상품을 추가합니다.
-- ============================================

-- ============================================
-- 원피스 상품 INSERT
-- ============================================
-- beige, blue, pink 색상, 각각 front, side, detail 이미지 포함
-- ============================================

INSERT INTO products (
  name,
  price,
  category,
  sizes,
  colors,
  images,
  description,
  material,
  care
) VALUES (
  '코지 베이비 원피스',
  35000,
  'dress',
  ARRAY['70', '80', '90'],
  ARRAY['베이지', '블루', '핑크'],
  ARRAY[
    -- 베이지 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-beige-detail.png',
    -- 블루 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-blue-detail.png',
    -- 핑크 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/dress/dress-dress-pink-detail.png'
  ],
  '편안하고 귀여운 원피스입니다. 다양한 스타일에 매치하기 좋은 베이직 디자인으로, 아기의 부드러운 피부를 고려한 소재로 제작되었습니다.',
  '면 혼방, 부드러운 원단',
  '손세탁 권장, 그늘 건조'
);

-- ============================================
-- 확인 쿼리
-- ============================================
-- 원피스 카테고리 상품이 정상적으로 추가되었는지 확인합니다.

SELECT 
  id,
  name,
  category,
  price,
  colors,
  array_length(images, 1) as image_count,
  created_at
FROM products
WHERE category = 'dress'
ORDER BY created_at DESC;

-- ============================================
-- 완료 메시지
-- ============================================
-- 원피스 카테고리 상품이 성공적으로 추가되었습니다!
-- - 코지 베이비 원피스











