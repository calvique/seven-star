/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#badeff',
          300: '#7cc4ff',
          400: '#36a6ff',
          500: '#0c8ce9',
          600: '#0070cc',
          700: '#0058a3',
          800: '#074b86',
          900: '#0b406d',
          950: '#072744',
        },
        secondary: {
          50: '#fdf8f1',
          100: '#faefdc',
          200: '#f5deb7',
          300: '#ecc684',
          400: '#e2a34d',
          500: '#d98324',
          600: '#c6631a',
          700: '#a04817',
          800: '#813b19',
          900: '#693218',
          950: '#38150a',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}