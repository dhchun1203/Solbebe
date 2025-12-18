-- ============================================
-- inquiries 테이블 스키마 개선
-- email, status, user_id 컬럼 추가
-- ============================================

-- 1. email 컬럼 추가
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. status 컬럼 추가 (처리 상태)
-- 'pending': 접수 대기
-- 'processing': 처리 중
-- 'completed': 처리 완료
-- 'cancelled': 취소됨
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 3. user_id 컬럼 추가 (로그인한 사용자의 경우)
-- auth.users 테이블과의 외래키 관계는 선택사항
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- 4. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);

-- 5. 기존 데이터의 email 필드 업데이트 (phone 필드에 이메일이 있는 경우)
-- 주의: 이 쿼리는 phone 필드에 이메일 형식이 포함된 경우에만 실행
UPDATE inquiries 
SET email = phone 
WHERE phone LIKE '%@%' AND email IS NULL;

-- 6. 기존 데이터의 status 필드 업데이트 (기본값 설정)
UPDATE inquiries 
SET status = 'pending' 
WHERE status IS NULL;

-- 7. 코멘트 추가
COMMENT ON COLUMN inquiries.email IS '고객 이메일 주소';
COMMENT ON COLUMN inquiries.status IS '처리 상태: pending(접수 대기), processing(처리 중), completed(처리 완료), cancelled(취소됨)';
COMMENT ON COLUMN inquiries.user_id IS '로그인한 사용자의 경우 auth.users.id 참조';

-- 8. 제약 조건 추가 (status 값 검증)
-- PostgreSQL에서는 CHECK 제약 조건 사용
ALTER TABLE inquiries 
ADD CONSTRAINT check_status 
CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));

-- ============================================
-- 완료 후 확인 쿼리
-- ============================================
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'inquiries'
-- ORDER BY ordinal_position;

