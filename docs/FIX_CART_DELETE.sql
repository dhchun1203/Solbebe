-- ============================================
-- 장바구니 삭제 문제 해결을 위한 SQL
-- ============================================

-- 1. 현재 RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'cart_items';

-- 2. RLS가 활성화되어 있는지 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cart_items';

-- ============================================
-- 옵션 1: RLS 정책 수정 (권장)
-- ============================================
-- DELETE 정책이 제대로 작동하는지 확인하고 필요시 재생성

-- 기존 DELETE 정책 삭제
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

-- DELETE 정책 재생성 (더 명확하게)
CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 옵션 2: RLS 임시 비활성화 (개발/테스트용)
-- ============================================
-- 주의: 프로덕션에서는 사용하지 마세요!

-- ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 옵션 3: 서비스 역할 키 사용 (고급)
-- ============================================
-- 서비스 역할 키를 사용하면 RLS를 우회할 수 있지만,
-- 보안상 위험하므로 권장하지 않습니다.

-- ============================================
-- 테스트 쿼리
-- ============================================

-- 현재 사용자의 장바구니 아이템 확인
-- SELECT * FROM cart_items WHERE user_id = auth.uid();

-- 특정 사용자의 장바구니 아이템 수 확인
-- SELECT COUNT(*) FROM cart_items WHERE user_id = 'USER_ID_HERE';

