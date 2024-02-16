/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['cupcake'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
  
}

