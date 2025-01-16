/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor: '#F7F4ED',
        customYellow: '#f9ebce',
        customGray: '#a9aeae',
        customGray2: '#494a4b'
      },
      backgroundImage: {
        'front-image': "url('./pages/test.png')",
      },
    },
  },
  plugins: [],
}
