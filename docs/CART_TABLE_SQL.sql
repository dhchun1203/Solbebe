-- ============================================
-- 장바구니(cart_items) 테이블 생성 SQL
-- ============================================

-- cart_items 테이블 생성
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 같은 사용자가 같은 상품+옵션 조합을 중복으로 추가하지 못하도록 제약
  UNIQUE(user_id, product_id, size, color)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at DESC);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가
COMMENT ON TABLE cart_items IS '사용자 장바구니 아이템 테이블';
COMMENT ON COLUMN cart_items.user_id IS 'Supabase Auth 사용자 ID';
COMMENT ON COLUMN cart_items.product_id IS '상품 ID (products 테이블 참조)';
COMMENT ON COLUMN cart_items.size IS '선택한 사이즈 (NULL 가능)';
COMMENT ON COLUMN cart_items.color IS '선택한 색상 (NULL 가능)';
COMMENT ON COLUMN cart_items.quantity IS '수량 (기본값: 1)';

-- ============================================
-- RLS (Row Level Security) 설정
-- ============================================

-- RLS 활성화
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 정책 1: 사용자는 자신의 장바구니 아이템만 조회 가능
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- 정책 2: 사용자는 자신의 장바구니에만 아이템 추가 가능
CREATE POLICY "Users can insert their own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책 3: 사용자는 자신의 장바구니 아이템만 수정 가능
CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 정책 4: 사용자는 자신의 장바구니 아이템만 삭제 가능
CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 완료 메시지
-- ============================================
-- cart_items 테이블이 성공적으로 생성되었습니다!
-- RLS 정책이 적용되어 각 사용자는 자신의 장바구니만 접근할 수 있습니다.










