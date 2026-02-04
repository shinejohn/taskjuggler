/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4F72', // 4calls.ai brand color
          hover: '#153e5a',
          light: 'rgba(27, 79, 114, 0.1)',
        },
        accent: {
          DEFAULT: '#F59E0B', // Orange accent
          hover: '#D97706',
        },
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

