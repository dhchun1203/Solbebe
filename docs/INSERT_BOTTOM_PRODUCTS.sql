-- ============================================
-- 하의 카테고리 상품 INSERT SQL
-- ============================================
-- 바지(pants)와 반바지(shorts) 상품을 추가합니다.
-- ============================================

-- ============================================
-- 1. 바지 상품 INSERT
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
  '부드러운 베이비 팬츠',
  28000,
  'bottom',
  ARRAY['70', '80', '90'],
  ARRAY['베이지', '블루', '핑크'],
  ARRAY[
    -- 베이지 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-beige-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-beige-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-beige-detail.png',
    -- 블루 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-blue-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-blue-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-blue-detail.png',
    -- 핑크 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-pink-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-pink-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/pants/bottom-pants-pink-detail.png'
  ],
  '아기의 부드러운 피부를 위한 프리미엄 팬츠입니다. 신축성 있는 소재로 편안한 착용감을 제공하며, 활동하기 편한 디자인입니다.',
  '순면 100%, 인체에 무해한 염료 사용',
  '30도 이하 세탁, 중성세제 사용, 그늘에서 건조'
);

-- ============================================
-- 2. 반바지 상품 INSERT
-- ============================================
-- beige, blue, pink 색상, 각각 front, detail 이미지 포함
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
  '시원한 베이비 반바지',
  24000,
  'bottom',
  ARRAY['70', '80', '90'],
  ARRAY['베이지', '블루', '핑크'],
  ARRAY[
    -- 베이지 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-beige-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-beige-detail.png',
    -- 블루 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-blue-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-blue-detail.png',
    -- 핑크 색상 이미지
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-pink-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/bottom/shorts/bottom-shorts-pink-detail.png'
  ],
  '여름에 시원하게 입을 수 있는 베이비 반바지입니다. 통기성이 좋아 땀을 잘 흡수하며, 활동하기 편한 디자인입니다.',
  '면 혼방, 부드러운 원단',
  '세탁기 사용 가능, 중성세제 사용, 그늘에서 건조'
);

-- ============================================
-- 확인 쿼리
-- ============================================
-- 하의 카테고리 상품이 정상적으로 추가되었는지 확인합니다.

SELECT 
  id,
  name,
  category,
  price,
  colors,
  array_length(images, 1) as image_count,
  created_at
FROM products
WHERE category = 'bottom'
ORDER BY created_at DESC;

-- ============================================
-- 완료 메시지
-- ============================================
-- 하의 카테고리 상품 2개가 성공적으로 추가되었습니다!
-- - 부드러운 베이비 팬츠 (바지)
-- - 시원한 베이비 반바지 (반바지)


