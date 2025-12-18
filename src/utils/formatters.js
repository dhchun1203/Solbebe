/**
 * 숫자를 천 단위 구분자로 포맷팅
 * @param {number} number - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatPrice = (number) => {
  if (number == null || isNaN(number)) return '0'
  return number.toLocaleString('ko-KR')
}

/**
 * 가격에 '원' 단위 추가
 * @param {number} price - 가격
 * @returns {string} 포맷팅된 가격 문자열
 */
export const formatPriceWithUnit = (price) => {
  return `${formatPrice(price)}원`
}

/**
 * 날짜를 포맷팅
 * @param {string|Date} date - 날짜
 * @param {string} format - 포맷 형식 (기본: 'YYYY-MM-DD')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}

/**
 * 텍스트를 특정 길이로 자르고 말줄임표 추가
 * @param {string} text - 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 잘린 텍스트
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}




