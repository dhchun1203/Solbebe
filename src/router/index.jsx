import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { ROUTES } from '../constants'

// 코드 스플리팅: 홈 페이지는 즉시 로드, 나머지는 레이지 로드
import Home from '../pages/Home'

// 레이지 로딩된 페이지들
const ProductList = lazy(() => import('../pages/ProductList'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Inquiry = lazy(() => import('../pages/Inquiry'))
const InquirySuccess = lazy(() => import('../pages/InquirySuccess'))
const Cart = lazy(() => import('../pages/Cart'))
const MyInquiries = lazy(() => import('../pages/MyInquiries'))
const Profile = lazy(() => import('../pages/Profile'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const EmailConfirm = lazy(() => import('../pages/EmailConfirm'))
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'))
const AdminProducts = lazy(() => import('../pages/Admin/Products'))
const AdminInquiries = lazy(() => import('../pages/Admin/Inquiries'))

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

export const router = createBrowserRouter(
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
        {
          path: 'cart',
          element: (
            <SuspenseWrapper>
              <Cart />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'my-inquiries',
          element: (
            <SuspenseWrapper>
              <MyInquiries />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'profile',
          element: (
            <SuspenseWrapper>
              <Profile />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'forgot-password',
          element: (
            <SuspenseWrapper>
              <ForgotPassword />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'reset-password',
          element: (
            <SuspenseWrapper>
              <ResetPassword />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'auth/confirm',
          element: (
            <SuspenseWrapper>
              <EmailConfirm />
            </SuspenseWrapper>
          ),
        },
      ],
    },
    {
      path: '/admin',
      element: (
        <SuspenseWrapper>
          <AdminLayout />
        </SuspenseWrapper>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
        },
        {
          path: 'dashboard',
          element: (
            <SuspenseWrapper>
              <AdminDashboard />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'products',
          element: (
            <SuspenseWrapper>
              <AdminProducts />
            </SuspenseWrapper>
          ),
        },
        {
          path: 'inquiries',
          element: (
            <SuspenseWrapper>
              <AdminInquiries />
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




