/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs"
  ],
  theme: {
    extend: {
      minWidth: {
        '45': '11.25rem',
      },
    },
  },
  daisyui: {
    themes: ['cupcake'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
  
}

