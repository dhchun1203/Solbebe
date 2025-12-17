import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetail'
import Inquiry from '../pages/Inquiry'
import InquirySuccess from '../pages/InquirySuccess'
import Cart from '../pages/Cart'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import EmailConfirm from '../pages/EmailConfirm'

export const router = createBrowserRouter([
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
])




