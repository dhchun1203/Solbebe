import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
      setSearchQuery('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 md:pt-20 px-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl border border-transparent dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품을 검색하세요..."
                className="w-full px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-text bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                검색
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchModal



