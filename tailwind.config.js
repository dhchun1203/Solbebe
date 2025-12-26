/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          cream: '#FFF8F0',
          beige: '#F5E6D3',
          'beige-text': '#B08968',
          pink: '#FFE5E5', // 배경용 (연한 핑크)
          'pink-text': '#FF6B9D', // 텍스트용 (진한 핑크, 시인성 향상)
          blue: '#E5F3FF',
          'blue-text': '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Gowun Dodum', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Gowun Dodum', 'sans-serif'],
      },
    },
  },
  plugins: [],
}



