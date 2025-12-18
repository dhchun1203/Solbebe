import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetail'
import Inquiry from '../pages/Inquiry'
import InquirySuccess from '../pages/InquirySuccess'
import Cart from '../pages/Cart'
import MyInquiries from '../pages/MyInquiries'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import EmailConfirm from '../pages/EmailConfirm'
import AdminLayout from '../pages/Admin/AdminLayout'
import AdminDashboard from '../pages/Admin/Dashboard'
import AdminProducts from '../pages/Admin/Products'
import AdminInquiries from '../pages/Admin/Inquiries'
import { ROUTES } from '../constants'

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
          element: <ProductList />,
        },
        {
          path: 'products/:id',
          element: <ProductDetail />,
        },
        {
          path: 'inquiry',
          element: <Inquiry />,
        },
        {
          path: 'inquiry/success',
          element: <InquirySuccess />,
        },
        {
          path: 'cart',
          element: <Cart />,
        },
        {
          path: 'my-inquiries',
          element: <MyInquiries />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: 'reset-password',
          element: <ResetPassword />,
        },
        {
          path: 'auth/confirm',
          element: <EmailConfirm />,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
        },
        {
          path: 'dashboard',
          element: <AdminDashboard />,
        },
        {
          path: 'products',
          element: <AdminProducts />,
        },
        {
          path: 'inquiries',
          element: <AdminInquiries />,
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




