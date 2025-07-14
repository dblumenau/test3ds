/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      screens: {
        'fhd': { 'raw': '(width: 1920px) and (height: 1080px)' },
      },
      gridTemplateColumns: {
        'asymmetric': '320px 960px 640px',
        'asymmetric-lg': '280px 840px 560px',
        'asymmetric-xl': '300px 900px 600px',
        'stacked': '1fr',
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