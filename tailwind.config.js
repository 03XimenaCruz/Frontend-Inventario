/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3BB8DB',
        'primary-light': '#C3E9F4',
      },
      fontFamily: {
        'times': ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}