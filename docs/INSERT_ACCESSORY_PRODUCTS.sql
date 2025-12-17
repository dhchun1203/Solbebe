-- ============================================
-- 악세사리 카테고리 상품 INSERT SQL
-- ============================================
-- 모자(hat)와 신발(shoes) 상품을 추가합니다.
-- ============================================

-- ============================================
-- 1. 모자 상품 INSERT
-- ============================================
-- beige, blue, pink 색상, 각각 1개 이미지
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
  '귀여운 베이비 모자',
  18000,
  'accessory',
  ARRAY['Free'],
  ARRAY['베이지', '블루', '핑크'],
  ARRAY[
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/hat/accessory-hat-beige.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/hat/accessory-hat-blue.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/hat/accessory-hat-pink.png'
  ],
  '귀여운 베이비 모자입니다. 자외선 차단과 보온 기능을 겸비하여 계절을 가리지 않고 활용 가능합니다. 부드러운 소재로 아기의 머리에 편안하게 맞습니다.',
  '면 소재',
  '손세탁 권장, 그늘 건조'
);

-- ============================================
-- 2. 신발 상품 INSERT
-- ============================================
-- beige, blue, pink 색상, 각각 1개 이미지
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
  '부드러운 베이비 신발',
  32000,
  'accessory',
  ARRAY['100', '110', '120'],
  ARRAY['베이지', '블루', '핑크'],
  ARRAY[
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/shoes/accessory-shoe-beige.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/shoes/accessory-shoe-blue.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/accessory/shoes/accessory-shoe-pink.png'
  ],
  '아기의 발을 보호하는 부드러운 베이비 신발입니다. 발 성장을 방해하지 않는 편안한 착용감과 안전한 소재로 제작되었습니다.',
  '부드러운 인조 가죽, 쿠션 인솔',
  '물로 닦기, 그늘 건조'
);

-- ============================================
-- 확인 쿼리
-- ============================================
-- 악세사리 카테고리 상품이 정상적으로 추가되었는지 확인합니다.

SELECT 
  id,
  name,
  category,
  price,
  sizes,
  colors,
  array_length(images, 1) as image_count,
  created_at
FROM products
WHERE category = 'accessory'
ORDER BY created_at DESC;

-- ============================================
-- 완료 메시지
-- ============================================
-- 악세사리 카테고리 상품 2개가 성공적으로 추가되었습니다!
-- - 귀여운 베이비 모자
-- - 부드러운 베이비 신발




