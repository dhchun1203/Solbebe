import { lazy, Suspense } from 'react'
import { createHashRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'

// 코드 스플리팅: 홈 페이지는 즉시 로드, 나머지는 레이지 로드
import Home from '../pages/Home'

// 레이지 로딩된 페이지들
const ProductList = lazy(() => import('../pages/ProductList'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Inquiry = lazy(() => import('../pages/Inquiry'))
const InquirySuccess = lazy(() => import('../pages/InquirySuccess'))

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-pink-text mb-4"></div>
      <p className="text-gray-600">로딩 중...</p>
    </div>
  </div>
)

// Suspense 래퍼 컴포넌트
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
)

export const router = createHashRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'products',
          element: (
            <SuspenseWrapper>
              <ProductList />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'products/:id',
          element: (
            <SuspenseWrapper>
              <ProductDetail />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'inquiry',
          element: (
            <SuspenseWrapper>
              <Inquiry />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'inquiry/success',
          element: (
            <SuspenseWrapper>
              <InquirySuccess />
            </SuspenseWrapper>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
)




