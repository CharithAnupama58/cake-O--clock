/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#454545',
        'custom-green': '#BCBCBC'
        
      },
    },
  },
  plugins: [],

};