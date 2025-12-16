-- ============================================
-- Solbebe 프로젝트 Supabase 데이터베이스 설정 SQL
-- ============================================

-- 1. products 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS products (
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

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- 코멘트 추가
COMMENT ON TABLE products IS '상품 정보 테이블';
COMMENT ON COLUMN products.category IS '카테고리: top(상의), bottom(하의), dress(원피스), accessory(악세서리)';

-- ============================================
-- 2. inquiries 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  options JSONB,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- 코멘트 추가
COMMENT ON TABLE inquiries IS '구매 문의 테이블';
COMMENT ON COLUMN inquiries.options IS '선택한 옵션 (size, color 등) JSON 형식';

-- ============================================
-- 3. RLS 설정 (선택사항)
-- ============================================

-- 개발용: RLS 비활성화 (모든 사용자가 접근 가능)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- 프로덕션용: RLS 활성화 (아래 주석 해제하여 사용)
/*
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- products: 모든 사용자가 조회 가능
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- inquiries: 모든 사용자가 생성 가능
CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- inquiries: 인증된 사용자만 조회 가능 (관리자용)
CREATE POLICY "Only authenticated users can view inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');
*/

-- ============================================
-- 4. 테스트 데이터 삽입
-- ============================================

-- 기존 테스트 데이터가 있다면 삭제 (선택사항)
-- DELETE FROM inquiries;
-- DELETE FROM products;

-- 상품 테스트 데이터
INSERT INTO products (name, price, category, sizes, colors, images, description, material, care)
VALUES
  (
    '부드러운 베이비 바디슈트',
    29000,
    'top',
    ARRAY['70', '80', '90'],
    ARRAY['크림', '핑크', '블루'],
    ARRAY[
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'
    ],
    '아기의 부드러운 피부를 위한 프리미엄 바디슈트입니다. 신축성 있는 소재로 편안한 착용감을 제공합니다.',
    '순면 100%, 인체에 무해한 염료 사용',
    '30도 이하 세탁, 중성세제 사용, 그늘에서 건조'
  ),
  (
    '코지 베이비 원피스',
    35000,
    'dress',
    ARRAY['70', '80', '90'],
    ARRAY['베이지', '블루', '화이트'],
    ARRAY[
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'
    ],
    '편안하고 귀여운 원피스입니다. 다양한 스타일에 매치하기 좋은 베이직 디자인입니다.',
    '면 혼방, 부드러운 원단',
    '손세탁 권장, 그늘 건조'
  ),
  (
    '소프트 베이비 팬츠',
    25000,
    'bottom',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '그레이', '베이지'],
    ARRAY[
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    '활동하기 편한 베이비 팬츠입니다. 움직임이 많은 아기에게 최적화된 디자인입니다.',
    '면 100%, 신축성 있는 원단',
    '세탁기 사용 가능, 중성세제 사용'
  ),
  (
    '귀여운 베이비 모자',
    15000,
    'accessory',
    ARRAY['Free'],
    ARRAY['핑크', '블루', '화이트'],
    ARRAY[
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    '귀여운 베이비 모자입니다. 자외선 차단과 보온 기능을 겸비했습니다.',
    '면 소재',
    '손세탁 권장'
  ),
  (
    '베이비 긴팔 티셔츠',
    22000,
    'top',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '크림', '핑크'],
    ARRAY[
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    '편안한 긴팔 티셔츠입니다. 계절을 가리지 않고 활용 가능합니다.',
    '순면 100%',
    '세탁기 사용 가능'
  ),
  (
    '베이비 반바지',
    20000,
    'bottom',
    ARRAY['70', '80', '90'],
    ARRAY['화이트', '그레이', '블루'],
    ARRAY[
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'
    ],
    '여름에 시원한 반바지입니다. 통기성이 좋아 땀을 잘 흡수합니다.',
    '면 혼방',
    '세탁기 사용 가능'
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 완료 메시지
-- ============================================
-- 모든 테이블과 데이터가 성공적으로 생성되었습니다!
-- Supabase Table Editor에서 확인해보세요.



