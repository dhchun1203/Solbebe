import { useState, useEffect } from 'react'
import { handleApiCall } from '../utils/errorHandler'

/**
 * API 호출을 위한 커스텀 훅
 * @param {Function} apiFunction - API 호출 함수
 * @param {Array} dependencies - useEffect 의존성 배열
 * @param {boolean} immediate - 마운트 시 즉시 실행 여부
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!apiFunction) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await handleApiCall(apiFunction)
      setData(result)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}







