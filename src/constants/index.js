// 카테고리 매핑
export const CATEGORY_MAP = {
  all: '전체',
  top: '상의',
  bottom: '하의',
  dress: '원피스',
  accessory: '악세서리',
}

// 카테고리 리스트
export const CATEGORIES = [
  { name: '상의', value: 'top', icon: '👕', description: '편안한 상의' },
  { name: '하의', value: 'bottom', icon: '👖', description: '부드러운 하의' },
  { name: '원피스', value: 'dress', icon: '👗', description: '귀여운 원피스' },
  { name: '악세서리', value: 'accessory', icon: '🧢', description: '액세서리' },
]

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
]

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  INQUIRY: '/inquiry',
  INQUIRY_SUCCESS: '/inquiry/success',
  MY_INQUIRIES: '/my-inquiries',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  EMAIL_CONFIRM: '/auth/confirm',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_INQUIRIES: '/admin/inquiries',
}

// 에러 메시지
export const ERROR_MESSAGES = {
  // 인증 관련
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  EMAIL_NOT_CONFIRMED: '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.',
  TOO_MANY_REQUESTS: '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  EMAIL_ALREADY_EXISTS: '이미 등록된 이메일입니다. 로그인해주세요.',
  INVALID_PASSWORD: '비밀번호가 너무 짧거나 형식이 올바르지 않습니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  LOGIN_FAILED: '로그인에 실패했습니다.',
  SIGNUP_FAILED: '회원가입에 실패했습니다.',
  LOGOUT_FAILED: '로그아웃에 실패했습니다.',
  SESSION_CHECK_FAILED: '세션 확인에 실패했습니다.',
  
  // 상품 관련
  PRODUCT_NOT_FOUND: '상품을 찾을 수 없습니다.',
  PRODUCT_LOAD_FAILED: '상품을 불러오는데 실패했습니다.',
  
  // 장바구니 관련
  CART_LOAD_FAILED: '장바구니를 불러오는데 실패했습니다.',
  CART_ADD_FAILED: '장바구니에 추가하는데 실패했습니다.',
  CART_REMOVE_FAILED: '장바구니에서 삭제하는데 실패했습니다.',
  CART_UPDATE_FAILED: '수량을 업데이트하는데 실패했습니다.',
  CART_CLEAR_FAILED: '장바구니를 비우는데 실패했습니다.',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  
  // 문의 관련
  INQUIRY_CREATE_FAILED: '문의 등록에 실패했습니다. 다시 시도해주세요.',
  INQUIRY_LOAD_FAILED: '문의를 불러오는데 실패했습니다.',
  
  // 일반
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
}

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CART_ADDED: '장바구니에 추가되었습니다!',
  INQUIRY_CREATED: '문의가 정상적으로 접수되었습니다!',
  PASSWORD_RESET_EMAIL_SENT: '비밀번호 재설정 이메일이 발송되었습니다.',
  PASSWORD_RESET: '비밀번호가 성공적으로 변경되었습니다.',
  EMAIL_CONFIRMED: '이메일 인증이 완료되었습니다.',
}

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
}

// 기본값
export const DEFAULTS = {
  RECOMMENDED_PRODUCTS_LIMIT: 6,
  PRODUCTS_PER_PAGE: 20,
  MIN_PASSWORD_LENGTH: 6,
}

// 관리자 이메일 리스트 (환경변수로도 설정 가능)
export const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS
  ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
  : [
      // 기본 관리자 이메일 (환경변수에 설정하지 않으면 이 이메일 사용)
      // 예: 'admin@solbebe.com'
    ]

