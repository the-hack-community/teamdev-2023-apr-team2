/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: '#FA8C61',
        arctic: '#B1DAD5',
        'dark-teal': '#29616C',
      },
    },
  },
  plugins: [],
}
module.exports = config
