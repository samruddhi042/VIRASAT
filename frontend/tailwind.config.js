/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#C9A84C', light: '#E8D08A', dim: '#7A6120' },
        ink:  { DEFAULT: '#1A1108', 2: '#3D2E10', 3: '#6B5B3A' },
        cream:{ DEFAULT: '#FAF6EE', 2: '#F0E8D6', 3: '#E2D4B8' },
        bg:   { DEFAULT: '#0F0B06', 2: '#1C1507', 3: '#2A1F0A' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
