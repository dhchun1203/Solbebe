-- ============================================
-- 상품 이미지 INSERT 방식 SQL
-- ============================================
-- 
-- 테이블 구조:
-- products (
--   id uuid DEFAULT uuid_generate_v4(),
--   name text NOT NULL,
--   price integer NOT NULL,
--   category text NOT NULL,
--   sizes text[],
--   colors text[],
--   images text[],  -- 이미지 URL 배열
--   description text,
--   material text,
--   care text,
--   created_at timestamp DEFAULT now()
-- )
--
-- 방법 1: UPDATE (기존 상품의 images 배열 업데이트) - 권장
-- 방법 2: INSERT (새 상품 행 추가)
-- ============================================

-- ============================================
-- 방법 1: UPDATE - 기존 상품의 images 배열 업데이트
-- ============================================
-- 이 방법은 기존 상품 데이터가 있을 때 사용합니다.

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
-- 방법 2: INSERT - 새 상품 행 추가 (이미지 포함)
-- ============================================
-- 이 방법은 새로운 상품을 추가할 때 사용합니다.

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
  '부드러운 베이비 바디슈트',
  29000,
  'top',
  ARRAY['70', '80', '90'],
  ARRAY['크림', '핑크', '블루'],
  ARRAY[
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-detail.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-detail.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-detail.png'
  ],
  '아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다. 신축성 있는 소재로 편안한 착용감을 제공합니다.',
  '순면 100%, 인체에 무해한 염료 사용',
  '30도 이하 세탁, 중성세제 사용, 그늘에서 건조'
);

-- ============================================
-- 방법 3: INSERT ... ON CONFLICT (중복 방지)
-- ============================================
-- 상품명이 이미 있으면 업데이트, 없으면 추가

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
  '부드러운 베이비 바디슈트',
  29000,
  'top',
  ARRAY['70', '80', '90'],
  ARRAY['크림', '핑크', '블루'],
  ARRAY[
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-beige-detail.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-pink-detail.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-front.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-side.png',
    'https://ougzjptxjnoihgdgagyi.supabase.co/storage/v1/object/public/product-images/top/top-bodysuit-blue-detail.png'
  ],
  '아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다. 신축성 있는 소재로 편안한 착용감을 제공합니다.',
  '순면 100%, 인체에 무해한 염료 사용',
  '30도 이하 세탁, 중성세제 사용, 그늘에서 건조'
)
ON CONFLICT (name) DO UPDATE 
SET images = EXCLUDED.images;

-- 주의: 위 쿼리는 name에 UNIQUE 제약이 있을 때만 작동합니다.
-- name에 UNIQUE 제약이 없다면 방법 1 (UPDATE)을 사용하세요.

-- ============================================
-- 확인 쿼리
-- ============================================

SELECT 
  id,
  name,
  category,
  price,
  array_length(images, 1) as image_count,
  images
FROM products
WHERE name = '부드러운 베이비 바디슈트';










