/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./app.js",
  ],
  theme: {
    extend: {
      screens: {
        'fhd': { 'raw': '(width: 1920px) and (height: 1080px)' },
      },
      gridTemplateColumns: {
        'asymmetric': '320px 960px 640px',
      },
      height: {
        'screen-1080': '1080px',
      },
      maxHeight: {
        'api-response': '400px',
        'iframe': '700px',
      },
      colors: {
        '3ds': {
          primary: '#3498db',
          secondary: '#2c3e50',
          success: '#2ecc71',
          danger: '#e74c3c',
          warning: '#f39c12',
          info: '#3498db',
        }
      },
      animation: {
        'spin-slow': 'spin 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}