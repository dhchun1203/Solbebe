import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { inquiryApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../services/supabase'
import Toast from '../components/common/Toast'
import { ROUTES } from '../constants'

const Profile = () => {
  const { user, checkSession } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info') // 'info', 'edit', 'inquiries'
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [inquiriesLoading, setInquiriesLoading] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  
  // 회원 정보 수정 폼
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOME)
      return
    }
    
    // 초기 데이터 로드 (최신 사용자 정보 가져오기)
    // user.id만 의존성으로 사용하여 무한 루프 방지
    loadUserInfo()
    if (activeTab === 'inquiries') {
      fetchInquiries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, navigate, activeTab])

  const loadUserInfo = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      console.log('📝 최신 사용자 정보 가져오기 시작...')
      
      let latestUser = user
      let fetchedUser = null
      
      // 1단계: authStore에서 세션 토큰 가져오기 (타임아웃 없이)
      console.log('📝 Supabase Auth API 직접 호출 시작...')
      
      const { session: authStoreSession } = useAuthStore.getState()
      let currentSession = authStoreSession
      
      // authStore에 세션이 없으면 getSession 시도 (타임아웃 짧게)
      if (!currentSession?.access_token) {
        try {
          const getSessionPromise = supabase.auth.getSession()
          const sessionTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('getSession 타임아웃')), 2000)
          })
          
          const sessionResult = await Promise.race([getSessionPromise, sessionTimeoutPromise])
          const { data: { session }, error: sessionError } = sessionResult
          
          if (!sessionError && session?.access_token) {
            currentSession = session
            console.log('✅ getSession으로 세션 가져오기 성공')
          } else {
            console.warn('⚠️ getSession 실패:', sessionError?.message || '세션 없음')
          }
        } catch (sessionTimeoutError) {
          console.warn('⚠️ getSession 타임아웃, authStore 세션 사용')
        }
      } else {
        console.log('✅ authStore에서 세션 토큰 가져오기 성공')
      }
      
      // 2단계: Supabase Auth API 직접 호출
      if (currentSession?.access_token) {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
          const fetchPromise = fetch(`${supabaseUrl}/auth/v1/user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${currentSession.access_token}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json'
            }
          })
          
          const fetchTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('fetch 타임아웃')), 8000)
          })
          
          const response = await Promise.race([fetchPromise, fetchTimeoutPromise])
          
          if (response.ok) {
            const userData = await response.json()
            console.log('✅ Supabase Auth API로 최신 사용자 정보 가져오기 성공')
            fetchedUser = userData
            latestUser = userData
            
            // authStore 업데이트 (user_metadata가 실제로 변경되었을 때만)
            const { user: currentUser, setUser, setSession } = useAuthStore.getState()
            const currentMetadataStr = JSON.stringify(currentUser?.user_metadata || {})
            const newMetadataStr = JSON.stringify(userData?.user_metadata || {})
            
            if (currentMetadataStr !== newMetadataStr || !currentUser) {
              setUser(latestUser)
              setSession(currentSession)
              console.log('✅ authStore 업데이트 완료')
            } else {
              console.log('⚠️ user_metadata 변경 없음, authStore 업데이트 스킵')
            }
          } else {
            const errorText = await response.text()
            console.warn('⚠️ Supabase Auth API 호출 실패:', response.status, errorText)
          }
        } catch (fetchError) {
          console.warn('⚠️ Supabase Auth API 호출 실패:', fetchError.message || fetchError)
        }
      } else {
        console.warn('⚠️ 세션 토큰 없음, getUser 시도')
      }
      
      // 2단계: 최신 데이터가 없으면 getUser() 시도
      if (!fetchedUser) {
        try {
          const getUserPromise = supabase.auth.getUser()
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('getUser 타임아웃')), 5000)
          })
          
          const result = await Promise.race([getUserPromise, timeoutPromise])
          const { data: { user: fetchedUserData }, error: getUserError } = result
          
          if (!getUserError && fetchedUserData) {
            fetchedUser = fetchedUserData
            latestUser = fetchedUser
            console.log('✅ getUser로 최신 사용자 정보 가져오기 성공')
            
            // authStore 업데이트 (user_metadata가 실제로 변경되었을 때만)
            const { user: currentUser, setUser, setSession } = useAuthStore.getState()
            const currentMetadataStr = JSON.stringify(currentUser?.user_metadata || {})
            const newMetadataStr = JSON.stringify(fetchedUserData?.user_metadata || {})
            
            if (currentMetadataStr !== newMetadataStr || !currentUser) {
              setUser(latestUser)
              console.log('✅ authStore 업데이트 완료')
              
              // 세션도 업데이트 (타임아웃 포함)
              try {
                const getSessionPromise = supabase.auth.getSession()
                const sessionTimeoutPromise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('세션 업데이트 타임아웃')), 3000)
                })
                const { data: { session: updatedSession } } = await Promise.race([
                  getSessionPromise,
                  sessionTimeoutPromise
                ])
                if (updatedSession) {
                  setSession(updatedSession)
                }
              } catch (sessionError) {
                console.warn('⚠️ 세션 업데이트 실패 (계속 진행):', sessionError.message || sessionError)
              }
            } else {
              console.log('⚠️ user_metadata 변경 없음, authStore 업데이트 스킵')
            }
          } else if (getUserError) {
            console.warn('⚠️ getUser 실패:', getUserError)
          }
        } catch (timeoutError) {
          console.warn('⚠️ getUser 타임아웃:', timeoutError.message || timeoutError)
        }
      }
      
      // 3단계: 여전히 최신 데이터가 없으면 authStore에서 가져오기
      if (!fetchedUser) {
        const { user: latestUserFromStore } = useAuthStore.getState()
        if (latestUserFromStore) {
          latestUser = latestUserFromStore
          console.log('⚠️ authStore에서 사용자 정보 사용 (최신 데이터 아님)')
        }
      }
      
      // 중첩된 user_metadata 정리 (재귀적으로 처리)
      // 가장 깊은 중첩 구조의 값을 우선적으로 가져오기
      const extractDeepestValue = (obj, key, depth = 0) => {
        if (!obj || typeof obj !== 'object') {
          console.log(`📝 extractDeepestValue [depth ${depth}]: obj가 유효하지 않음`)
          return ''
        }
        
        console.log(`📝 extractDeepestValue [depth ${depth}]:`, {
          hasKey: key in obj,
          keyValue: obj[key],
          hasUserMetadata: !!obj.user_metadata,
          userMetadataKeys: obj.user_metadata ? Object.keys(obj.user_metadata) : []
        })
        
        // 1. 가장 깊은 중첩 구조에서 찾기 (우선순위 1 - 재귀적으로)
        if (obj.user_metadata && typeof obj.user_metadata === 'object') {
          console.log(`📝 extractDeepestValue [depth ${depth}]: user_metadata 발견, 재귀 호출`)
          const nestedValue = extractDeepestValue(obj.user_metadata, key, depth + 1)
          // 중첩된 값이 있으면 우선 반환 (빈 문자열이 아닌 경우)
          if (nestedValue && nestedValue !== '') {
            console.log(`📝 extractDeepestValue [depth ${depth}]: 중첩된 값 발견:`, nestedValue)
            return nestedValue
          }
        }
        
        // 2. 현재 레벨에서 직접 찾기 (우선순위 2 - 중첩된 값이 없을 때만)
        if (obj[key] && obj[key] !== null && obj[key] !== '') {
          console.log(`📝 extractDeepestValue [depth ${depth}]: 현재 레벨에서 값 발견:`, obj[key])
          return obj[key]
        }
        
        console.log(`📝 extractDeepestValue [depth ${depth}]: 값 없음`)
        return ''
      }
      
      // 평탄화 함수 (가장 깊은 값을 상위로 올리기)
      const flattenUserMetadata = (metadata) => {
        if (!metadata || typeof metadata !== 'object') {
          return {}
        }
        
        // 중첩 구조가 있으면 재귀적으로 평탄화
        if (metadata.user_metadata && typeof metadata.user_metadata === 'object') {
          const nested = flattenUserMetadata(metadata.user_metadata)
          // 중첩된 값이 우선 (덮어쓰기) - 중첩된 값으로 시작
          const result = { ...nested }
          // 상위 값은 중첩된 값이 없을 때만 추가
          Object.keys(metadata).forEach(key => {
            if (key !== 'user_metadata' && !result[key] && metadata[key] !== undefined && metadata[key] !== null && metadata[key] !== '') {
              result[key] = metadata[key]
            }
          })
          return result
        }
        
        // 중첩 구조가 없으면 그대로 반환
        return { ...metadata }
      }
      
      let userMetadata = flattenUserMetadata(latestUser.user_metadata || {})
      
      // 가장 깊은 중첩 구조에서 값을 가져오기 (우선순위: 중첩 > 직접)
      const extractDeepestName = extractDeepestValue(latestUser.user_metadata, 'name')
      const extractDeepestPhone = extractDeepestValue(latestUser.user_metadata, 'phone')
      const finalName = extractDeepestName || userMetadata?.name || ''
      const finalPhone = extractDeepestPhone || userMetadata?.phone || ''
      
      console.log('📝 값 추출 디버깅:', {
        rawMetadata: latestUser.user_metadata,
        hasUserMetadata: !!latestUser.user_metadata?.user_metadata,
        userMetadataUserMetadata: latestUser.user_metadata?.user_metadata,
        extractDeepestName,
        extractDeepestPhone,
        flattenedMetadata: userMetadata,
        flattenedName: userMetadata?.name,
        flattenedPhone: userMetadata?.phone,
        finalName,
        finalPhone
      })
      
      setEditForm({
        name: finalName,
        phone: finalPhone,
      })
      
      console.log('✅ 사용자 정보 로드 완료:', {
        name: finalName,
        phone: finalPhone,
        source: fetchedUser ? 'getUser' : 'authStore',
        rawMetadata: latestUser.user_metadata,
        flattenedMetadata: userMetadata,
        latestUserHasMetadata: !!latestUser.user_metadata,
        latestUserMetadataKeys: latestUser.user_metadata ? Object.keys(latestUser.user_metadata) : [],
        userMetadataKeys: Object.keys(userMetadata),
        rawMetadataString: JSON.stringify(latestUser.user_metadata, null, 2),
        flattenedMetadataString: JSON.stringify(userMetadata, null, 2),
        extractDeepestValueName: extractDeepestName,
        extractDeepestValuePhone: extractDeepestPhone,
        directAccessName: userMetadata?.name,
        directAccessPhone: userMetadata?.phone
      })
    } catch (error) {
      console.error('❌ 사용자 정보 로드 실패:', error)
      // 에러 발생 시 기존 user 사용 (중첩 구조 처리 포함)
      const extractDeepestValue = (obj, key) => {
        if (!obj || typeof obj !== 'object') return ''
        
        // 1. 가장 깊은 중첩 구조에서 찾기 (우선순위 1)
        if (obj.user_metadata && typeof obj.user_metadata === 'object') {
          const nestedValue = extractDeepestValue(obj.user_metadata, key)
          if (nestedValue) return nestedValue
        }
        
        // 2. 현재 레벨에서 직접 찾기 (우선순위 2)
        if (obj[key]) return obj[key]
        
        return ''
      }
      
      const flattenUserMetadata = (metadata) => {
        if (!metadata || typeof metadata !== 'object') {
          return {}
        }
        const result = { ...metadata }
        if (metadata.user_metadata && typeof metadata.user_metadata === 'object') {
          const nested = flattenUserMetadata(metadata.user_metadata)
          Object.keys(nested).forEach(key => {
            if (key !== 'user_metadata' && nested[key] !== undefined && nested[key] !== null && nested[key] !== '') {
              result[key] = nested[key]
            }
          })
          delete result.user_metadata
        }
        return result
      }
      
      const userMetadata = flattenUserMetadata(user.user_metadata || {})
      const finalName = extractDeepestValue(user.user_metadata, 'name') || userMetadata?.name || ''
      const finalPhone = extractDeepestValue(user.user_metadata, 'phone') || userMetadata?.phone || ''
      
      setEditForm({
        name: finalName,
        phone: finalPhone,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInquiries = async () => {
    if (!user?.email) {
      setInquiriesLoading(false)
      return
    }

    try {
      setInquiriesLoading(true)
      const data = await inquiryApi.getUserInquiries(user.email, user.id)
      setInquiries(data || [])
    } catch (error) {
      console.error('문의 조회 실패:', error)
      setInquiries([])
      setToast({
        isVisible: true,
        message: '문의를 불러오는데 실패했습니다.',
        type: 'error',
      })
    } finally {
      setInquiriesLoading(false)
    }
  }

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '')
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    } else {
      // 11자리 이상 (휴대폰 번호)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    
    // 전화번호 필드인 경우 자동 포맷팅
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value)
      setEditForm({
        ...editForm,
        [name]: formatted,
      })
    } else {
      setEditForm({
        ...editForm,
        [name]: value,
      })
    }
  }

  const handleSave = async (e) => {
    // 이벤트 전파 방지
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('🚀 handleSave 함수 호출됨!')
    console.log('🚀 이벤트:', e)
    console.log('🚀 현재 상태:', {
      user: !!user,
      saving,
      isEditing,
      editForm
    })
    
    if (!user) {
      console.error('❌ 사용자가 없습니다!')
      setToast({
        isVisible: true,
        message: '로그인이 필요합니다.',
        type: 'error',
      })
      return
    }

    try {
      console.log('📝 setSaving(true) 호출 전...')
      setSaving(true)
      console.log('📝 setSaving(true) 호출 후...')
      
      console.log('📝 회원 정보 수정 시작:', { 
        name: editForm.name, 
        phone: editForm.phone,
        currentUser: user.email 
      })
      
      // 세션 확인 (타임아웃 추가 및 authStore에서 가져오기)
      console.log('📝 세션 확인 중...')
      
      // authStore에서 세션 정보 가져오기 (이미 로드된 정보 사용)
      const { session: authStoreSession } = useAuthStore.getState()
      console.log('📝 authStore 세션 확인:', !!authStoreSession)
      
      let session = authStoreSession
      
      // authStore에 세션이 없으면 getSession 시도 (타임아웃 포함)
      if (!session) {
        console.log('📝 authStore에 세션 없음, getSession 시도...')
        const getSessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('세션 확인 타임아웃')), 5000)
        })
        
        try {
          const result = await Promise.race([getSessionPromise, timeoutPromise])
          const { data: { session: fetchedSession }, error: sessionCheckError } = result
          
          if (sessionCheckError) {
            console.error('❌ 세션 확인 실패:', sessionCheckError)
            throw new Error('세션이 유효하지 않습니다. 다시 로그인해주세요.')
          }
          
          session = fetchedSession
        } catch (timeoutError) {
          console.error('❌ 세션 확인 타임아웃:', timeoutError)
          // 타임아웃이 발생해도 계속 진행 (localStorage에서 토큰 가져오기 시도)
          console.log('📝 localStorage에서 토큰 가져오기 시도...')
        }
      }
      
      // 세션이 여전히 없으면 localStorage에서 직접 가져오기
      if (!session) {
        console.log('📝 localStorage에서 직접 토큰 가져오기...')
        try {
          const authData = localStorage.getItem('auth-storage')
          if (authData) {
            const parsed = JSON.parse(authData)
            if (parsed.state?.session) {
              session = parsed.state.session
              console.log('✅ localStorage에서 세션 복원 성공')
            }
          }
        } catch (storageError) {
          console.error('❌ localStorage 읽기 실패:', storageError)
        }
      }
      
      if (!session) {
        console.error('❌ 세션이 없습니다.')
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.')
      }
      
      if (!session.access_token) {
        console.error('❌ Access Token이 없습니다.')
        throw new Error('세션 토큰이 없습니다. 다시 로그인해주세요.')
      }
      
      console.log('✅ 세션 확인 완료:', session.user?.email)
      console.log('✅ Access Token 존재:', !!session.access_token)
      
      // Supabase user metadata 업데이트 (직접 REST API 호출)
      console.log('📝 updateUser 호출 중...')
      console.log('📝 업데이트할 데이터:', {
        name: editForm.name,
        phone: editForm.phone
      })
      
      // Supabase URL과 키 가져오기
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      console.log('📝 환경 변수 확인:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '없음'
      })
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
      }

      if (!session || !session.access_token) {
        throw new Error('세션 토큰이 없습니다.')
      }

      // 직접 REST API 호출 (updateUser가 타임아웃되므로 REST API만 사용)
      const updateUrl = `${supabaseUrl}/auth/v1/user`
      console.log('📝 REST API 직접 호출 시작...')
      console.log('📝 요청 URL:', updateUrl)
      console.log('📝 Access Token 존재:', !!session.access_token)
      
      // 기존 user_metadata 가져오기 (중첩된 user_metadata 제거)
      const currentMetadata = user?.user_metadata || {}
      // 중첩된 user_metadata가 있으면 제거하고 평탄화
      let cleanMetadata = { ...currentMetadata }
      if (cleanMetadata.user_metadata) {
        // 중첩된 user_metadata의 내용을 상위로 병합
        const nested = cleanMetadata.user_metadata
        cleanMetadata = { ...nested }
        // 중첩 구조 완전히 제거
        if (cleanMetadata.user_metadata) {
          delete cleanMetadata.user_metadata
        }
      }
      
      // 사용자 입력 필드만 포함 (시스템 필드 제외)
      const userMetadata = {
        name: editForm.name || null,
        phone: editForm.phone || null,
      }
      
      // email_verified 같은 시스템 필드만 유지
      if (cleanMetadata.email_verified !== undefined) {
        userMetadata.email_verified = cleanMetadata.email_verified
      }
      
      // Supabase Auth API 형식: { data: { user_metadata: { ... } } }
      const requestBody = {
        data: {
          user_metadata: userMetadata
        }
      }
      
      console.log('📝 요청 Body:', JSON.stringify(requestBody))
      
      const fetchStartTime = Date.now()
      console.log('📝 Fetch 호출 시작 시간:', new Date().toISOString())
      
      let updateData
      try {
        console.log('📝 Fetch 실행 직전...')
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        const fetchEndTime = Date.now()
        console.log('📝 Fetch 응답 받음 (소요 시간:', fetchEndTime - fetchStartTime, 'ms)')
        console.log('📝 응답 상태:', updateResponse.status, updateResponse.statusText)
        console.log('📝 응답 Headers:', Object.fromEntries(updateResponse.headers.entries()))

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          console.error('❌ 응답 본문 (텍스트):', errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { message: errorText || '알 수 없는 오류' }
          }
          console.error('❌ 회원 정보 업데이트 에러:', errorData)
          throw new Error(errorData.message || `HTTP ${updateResponse.status}: ${updateResponse.statusText}`)
        }

        const responseText = await updateResponse.text()
        console.log('📝 응답 본문 (텍스트):', responseText)
        try {
          updateData = JSON.parse(responseText)
        } catch (parseError) {
          console.error('❌ JSON 파싱 실패:', parseError)
          throw new Error('응답 파싱 실패: ' + responseText.substring(0, 100))
        }
        
        console.log('📝 파싱된 데이터:', updateData)
        console.log('📝 데이터 구조 확인:', {
          hasId: !!updateData.id,
          hasUserMetadata: !!updateData.user_metadata,
          hasEmail: !!updateData.email
        })
        
        // Supabase API는 직접 user 객체를 반환하므로, user 속성이 없을 수 있음
        const updatedUser = updateData.user || updateData
        
        if (!updatedUser || !updatedUser.id) {
          console.error('❌ 업데이트 데이터 구조 오류:', updateData)
          throw new Error('업데이트 응답이 올바르지 않습니다.')
        }

        console.log('✅ 회원 정보 업데이트 성공 (REST API)')
        console.log('✅ 업데이트된 사용자:', updatedUser.user_metadata)
        
        // updateData를 user 객체 형태로 정규화
        updateData = { user: updatedUser }
      } catch (fetchError) {
        const fetchErrorTime = Date.now()
        console.error('❌ Fetch 에러 발생 (소요 시간:', fetchErrorTime - fetchStartTime, 'ms)')
        console.error('❌ Fetch 에러 타입:', fetchError.constructor.name)
        console.error('❌ Fetch 에러 메시지:', fetchError.message)
        console.error('❌ Fetch 에러 스택:', fetchError.stack)
        throw fetchError
      }

      // 업데이트된 사용자 정보로 로컬 상태 업데이트
      const updatedUser = updateData.user || updateData
      
      // 중첩된 user_metadata 재귀적으로 평탄화
      const flattenUserMetadata = (metadata) => {
        if (!metadata || typeof metadata !== 'object') {
          return {}
        }
        if (metadata.user_metadata) {
          const nested = flattenUserMetadata(metadata.user_metadata)
          return {
            ...metadata,
            ...nested,
            user_metadata: undefined
          }
        }
        return metadata
      }
      
      // 모든 가능한 경로에서 name, phone 찾기
      const extractValue = (obj, key) => {
        if (!obj || typeof obj !== 'object') return ''
        if (obj[key]) return obj[key]
        if (obj.user_metadata && obj.user_metadata[key]) {
          return obj.user_metadata[key]
        }
        for (const value of Object.values(obj)) {
          if (value && typeof value === 'object' && value[key]) {
            return value[key]
          }
        }
        return ''
      }
      
      if (updatedUser && updatedUser.user_metadata) {
        const flattenedMetadata = flattenUserMetadata(updatedUser.user_metadata)
        const finalName = extractValue(flattenedMetadata, 'name') || extractValue(updatedUser.user_metadata, 'name') || ''
        const finalPhone = extractValue(flattenedMetadata, 'phone') || extractValue(updatedUser.user_metadata, 'phone') || ''
        
        setEditForm({
          name: finalName,
          phone: finalPhone,
        })
        console.log('✅ 로컬 상태 업데이트 완료')
      }
      
      // authStore의 사용자 정보 업데이트 - 응답 데이터로 직접 업데이트
      console.log('📝 authStore 상태 업데이트 중...')
      
      // 응답 데이터로 직접 업데이트 (getUser 호출 없이)
      if (updatedUser) {
        // 중첩된 user_metadata 재귀적으로 평탄화
        if (updatedUser.user_metadata) {
          updatedUser.user_metadata = flattenUserMetadata(updatedUser.user_metadata)
        }
        
        const { setUser, setSession } = useAuthStore.getState()
        setUser(updatedUser)
        
        // 세션도 업데이트 (타임아웃 포함)
        try {
          const getSessionPromise = supabase.auth.getSession()
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('세션 가져오기 타임아웃')), 2000)
          })
          const { data: { session: currentSession } } = await Promise.race([
            getSessionPromise,
            timeoutPromise
          ])
          if (currentSession) {
            setSession(currentSession)
            console.log('✅ 세션 업데이트 완료')
          }
        } catch (sessionError) {
          console.warn('⚠️ 세션 업데이트 실패 (계속 진행):', sessionError)
        }
        
        console.log('✅ authStore user 직접 업데이트 완료')
        console.log('✅ 업데이트된 user_metadata:', updatedUser.user_metadata)
      }
      
      setToast({
        isVisible: true,
        message: '회원 정보가 수정되었습니다.',
        type: 'success',
      })
      setIsEditing(false)
      
      console.log('✅ 회원 정보 수정 프로세스 완료')
      
    } catch (error) {
      console.error('❌ 회원 정보 수정 실패:', error)
      console.error('❌ 에러 타입:', error.constructor.name)
      console.error('❌ 에러 메시지:', error.message)
      
      let errorMessage = '회원 정보 수정에 실패했습니다.'
      if (error.message) {
        if (error.message.includes('세션')) {
          errorMessage = error.message
        } else if (error.message.includes('시간이 초과')) {
          errorMessage = '요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
        } else {
          errorMessage += ` (${error.message})`
        }
      }
      
      setToast({
        isVisible: true,
        message: errorMessage,
        type: 'error',
      })
    } finally {
      setSaving(false)
      console.log('📝 저장 프로세스 종료 (saving: false)')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">내 프로필</h1>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 text-sm md:text-base font-medium transition-colors ${
            activeTab === 'info'
              ? 'text-pastel-pink-text border-b-2 border-pastel-pink-text'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          가입정보
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-sm md:text-base font-medium transition-colors ${
            activeTab === 'edit'
              ? 'text-pastel-pink-text border-b-2 border-pastel-pink-text'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          정보 수정
        </button>
        <button
          onClick={() => {
            setActiveTab('inquiries')
            if (inquiries.length === 0) {
              fetchInquiries()
            }
          }}
          className={`px-4 py-2 text-sm md:text-base font-medium transition-colors ${
            activeTab === 'inquiries'
              ? 'text-pastel-pink-text border-b-2 border-pastel-pink-text'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          구매(문의) 내역
        </button>
      </div>

      {/* 가입정보 탭 */}
      {activeTab === 'info' && (() => {
        // 중첩 구조 평탄화 헬퍼 함수
        const flattenUserMetadata = (metadata) => {
          if (!metadata || typeof metadata !== 'object') return {}
          if (metadata.user_metadata) {
            const nested = flattenUserMetadata(metadata.user_metadata)
            return { ...metadata, ...nested, user_metadata: undefined }
          }
          return metadata
        }
        const extractValue = (obj, key) => {
          if (!obj || typeof obj !== 'object') return ''
          if (obj[key]) return obj[key]
          if (obj.user_metadata && obj.user_metadata[key]) return obj.user_metadata[key]
          return ''
        }
        const flattened = flattenUserMetadata(user.user_metadata || {})
        const displayName = extractValue(flattened, 'name') || extractValue(user.user_metadata, 'name') || '미입력'
        const displayPhone = extractValue(flattened, 'phone') || extractValue(user.user_metadata, 'phone') || '미입력'
        
        return (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">이름</label>
                <p className="text-base text-gray-800">{displayName}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">이메일</label>
                <p className="text-base text-gray-800">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">전화번호</label>
                <p className="text-base text-gray-800">{displayPhone}</p>
              </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">가입일</label>
              <p className="text-base text-gray-800">
                {new Date(user.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">이메일 인증 상태</label>
              <p className="text-base">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.email_confirmed_at
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.email_confirmed_at ? '인증 완료' : '인증 대기'}
                </span>
              </p>
            </div>
          </div>
        </div>
        )
      })()}

      {/* 정보 수정 탭 */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">이름</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink-text focus:border-transparent"
                  placeholder="이름을 입력하세요"
                />
              ) : (
                <p className="text-base text-gray-800">{editForm.name || '미입력'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">이메일</label>
              <p className="text-base text-gray-800">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">전화번호</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink-text focus:border-transparent"
                  placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                />
              ) : (
                <p className="text-base text-gray-800">{editForm.phone || '미입력'}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      console.log('🔘 저장 버튼 클릭됨!', e)
                      handleSave(e)
                    }}
                    disabled={saving}
                    className="px-6 py-2.5 bg-pastel-pink-text text-white rounded-lg hover:bg-pastel-pink-text/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      loadUserInfo() // 원래 값으로 복원
                    }}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-pastel-pink-text text-white rounded-lg hover:bg-pastel-pink-text/90 transition-colors font-medium"
                >
                  수정하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 구매(문의) 내역 탭 */}
      {activeTab === 'inquiries' && (
        <div>
          {inquiriesLoading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-4xl md:text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-base md:text-lg mb-4">등록된 문의가 없습니다.</p>
              <button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                className="inline-block bg-pastel-pink-text text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-sm md:text-base hover:bg-pastel-pink-text/90 transition-colors"
              >
                상품 보러가기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                        {inquiry.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">{inquiry.phone}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {inquiry.product && (
                    <div className="mb-3 pb-3 border-b border-gray-100">
                      <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">상품:</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {inquiry.product.name || '상품 정보 없음'}
                      </p>
                      {inquiry.product.images && inquiry.product.images.length > 0 && (
                        <img
                          src={inquiry.product.images[0]}
                          alt={inquiry.product.name}
                          className="w-16 h-16 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                  )}

                  {inquiry.options && (
                    <div className="mb-3">
                      <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">옵션:</p>
                      <div className="flex flex-wrap gap-2">
                        {inquiry.options.size && (
                          <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                            사이즈: {inquiry.options.size}
                          </span>
                        )}
                        {inquiry.options.color && (
                          <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                            색상: {inquiry.options.color}
                          </span>
                        )}
                        {inquiry.options.quantity && (
                          <span className="text-xs bg-pastel-beige text-gray-700 px-2 py-1 rounded">
                            수량: {inquiry.options.quantity}개
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {inquiry.message && (
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">요청사항:</p>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                    </div>
                  )}

                  {/* 처리 상태 표시 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      inquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                      inquiry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inquiry.status === 'completed' ? '처리 완료' :
                       inquiry.status === 'processing' ? '처리 중' :
                       inquiry.status === 'cancelled' ? '취소됨' :
                       '접수 대기'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  )
}

export default Profile

