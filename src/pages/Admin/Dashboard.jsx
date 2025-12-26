import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productApi } from '../../services/api'
import { inquiryApi } from '../../services/api'
import { ROUTES } from '../../constants'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    recentInquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  const handleNavigate = (path) => {
    navigate(path)
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // 각각 독립적으로 호출하여 하나가 실패해도 다른 것은 성공할 수 있도록
        const [productsResult, inquiriesResult] = await Promise.allSettled([
          productApi.getAllProducts(),
          inquiryApi.getAllInquiries(),
        ])

        const products = productsResult.status === 'fulfilled' ? productsResult.value : []
        const inquiries = inquiriesResult.status === 'fulfilled' ? inquiriesResult.value : []

        if (productsResult.status === 'rejected') {
          console.error('상품 조회 실패:', productsResult.reason)
        }
        if (inquiriesResult.status === 'rejected') {
          console.error('문의 조회 실패:', inquiriesResult.reason)
        }

        // 최근 7일 내 문의 수 계산
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const recentInquiries = (inquiries || []).filter(
          (inquiry) => inquiry?.created_at && new Date(inquiry.created_at) >= sevenDaysAgo
        ).length

        setStats({
          totalProducts: products?.length || 0,
          totalInquiries: inquiries?.length || 0,
          recentInquiries,
        })
      } catch (error) {
        console.error('통계 조회 실패:', error)
        // 에러가 발생해도 기본값으로 설정
        setStats({
          totalProducts: 0,
          totalInquiries: 0,
          recentInquiries: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-6 lg:mb-8">
        관리자 대시보드
      </h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1">전체 상품</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalProducts}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pastel-pink rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1">전체 문의</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalInquiries}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pastel-blue rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-1">최근 7일 문의</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.recentInquiries}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pastel-beige rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 md:mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <button
            onClick={() => handleNavigate(ROUTES.ADMIN_PRODUCTS)}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-pastel-pink hover:bg-pastel-pink/5 dark:hover:bg-gray-800/60 transition-all cursor-pointer text-left w-full"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-pastel-pink rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-100">상품 관리</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">상품 추가, 수정, 삭제</p>
            </div>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => handleNavigate(ROUTES.ADMIN_INQUIRIES)}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-pastel-blue hover:bg-pastel-blue/5 dark:hover:bg-gray-800/60 transition-all cursor-pointer text-left w-full"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-pastel-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-100">문의 관리</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">고객 문의 확인 및 관리</p>
            </div>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

