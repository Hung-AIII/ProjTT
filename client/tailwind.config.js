/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        goldHover: '#e8c84a',
        dark: '#0a0a0a',
        dark2: '#141414',
        dark3: '#1a1a1a',
        light: '#f0ede8',
        muted: '#a89888',
        border: '#2a2520',
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}