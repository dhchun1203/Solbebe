import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import ProductList from '../pages/ProductList'
import ProductDetail from '../pages/ProductDetail'
import Inquiry from '../pages/Inquiry'
import InquirySuccess from '../pages/InquirySuccess'

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
    ],
  },
])



