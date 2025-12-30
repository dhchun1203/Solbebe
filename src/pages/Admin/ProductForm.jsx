import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Toast from '../../components/common/Toast'
import { productApi } from '../../services/api'
import { CATEGORIES, ROUTES } from '../../constants'

const normalizeList = (value) => {
  if (!value) return []
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

const normalizeCommaList = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const ProductForm = ({ mode }) => {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = useMemo(() => mode === 'edit' && !!id, [mode, id])

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'top',
    sizes: '70, 80, 90',
    colors: '크림, 핑크, 블루',
    images: '',
    description: '',
    material: '',
    care: '',
  })

  useEffect(() => {
    const fetchForEdit = async () => {
      if (!isEdit) return
      try {
        setInitialLoading(true)
        const product = await productApi.getProductById(id)
        setForm({
          name: product?.name || '',
          price: String(product?.price ?? ''),
          category: product?.category || 'top',
          sizes: (product?.sizes || []).join(', '),
          colors: (product?.colors || []).join(', '),
          images: (product?.images || []).join('\n'),
          description: product?.description || '',
          material: product?.material || '',
          care: product?.care || '',
        })
      } catch (e) {
        console.error(e)
        setToast({ isVisible: true, message: '상품 정보를 불러오지 못했습니다.', type: 'error' })
      } finally {
        setInitialLoading(false)
      }
    }

    fetchForEdit()
  }, [isEdit, id])

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const priceNumber = Number(form.price)
    if (!form.name.trim()) {
      setToast({ isVisible: true, message: '상품명을 입력해주세요.', type: 'error' })
      return
    }
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setToast({ isVisible: true, message: '가격을 올바르게 입력해주세요.', type: 'error' })
      return
    }

    const payload = {
      name: form.name.trim(),
      price: Math.trunc(priceNumber),
      category: form.category,
      sizes: normalizeCommaList(form.sizes),
      colors: normalizeCommaList(form.colors),
      images: normalizeList(form.images),
      description: form.description?.trim() || '',
      material: form.material?.trim() || '',
      care: form.care?.trim() || '',
    }

    try {
      setLoading(true)
      if (isEdit) {
        await productApi.updateProduct(id, payload)
        setToast({ isVisible: true, message: '상품이 수정되었습니다.', type: 'success' })
      } else {
        await productApi.createProduct(payload)
        setToast({ isVisible: true, message: '상품이 추가되었습니다.', type: 'success' })
      }

      setTimeout(() => {
        navigate(ROUTES.ADMIN_PRODUCTS)
      }, 700)
    } catch (error) {
      console.error(error)
      setToast({
        isVisible: true,
        message: error?.message || '저장에 실패했습니다. (RLS/권한/네트워크를 확인하세요)',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600 dark:text-gray-300">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100">
            {isEdit ? '상품 수정' : '새 상품 추가'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            * 저장 후 상품 관리로 돌아갑니다.
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_PRODUCTS}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          목록으로
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 md:p-6 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              상품명 *
            </label>
            <input
              value={form.name}
              onChange={handleChange('name')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 베이비 긴팔 티셔츠"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              가격(원) *
            </label>
            <input
              value={form.price}
              onChange={handleChange('price')}
              inputMode="numeric"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 22000"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              카테고리 *
            </label>
            <select
              value={form.category}
              onChange={handleChange('category')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name} ({c.value})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              사이즈(쉼표로 구분)
            </label>
            <input
              value={form.sizes}
              onChange={handleChange('sizes')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 70, 80, 90"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              색상(쉼표로 구분)
            </label>
            <input
              value={form.colors}
              onChange={handleChange('colors')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 크림, 핑크, 블루"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              이미지 URL(줄바꿈으로 여러 개)
            </label>
            <textarea
              value={form.images}
              onChange={handleChange('images')}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="https://...&#10;https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            상품 설명
          </label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
            placeholder="예) 편안한 긴팔 티셔츠입니다."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              원단 정보
            </label>
            <input
              value={form.material}
              onChange={handleChange('material')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 순면 100%"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              세탁 정보
            </label>
            <input
              value={form.care}
              onChange={handleChange('care')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              placeholder="예) 세탁기 사용 가능"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pastel-pink-text text-white py-3 rounded-xl font-semibold hover:bg-pastel-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : isEdit ? '수정 저장' : '상품 추가'}
          </button>
          <Link
            to={ROUTES.ADMIN_PRODUCTS}
            className="flex-1 text-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  )
}

export default ProductForm




