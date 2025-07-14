/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      screens: {
        'fhd': { 'raw': '(width: 1920px) and (height: 1080px)' },
        '1280': '1280px',
        '1440': '1440px',
        '1920': '1920px',
      },
      gridTemplateColumns: {
        'asymmetric': '320px 960px 640px',
        'asymmetric-flex': '320px 1fr 640px',
        'asymmetric-narrow': '280px 1fr 560px',
        'asymmetric-medium': '260px 1fr 480px',
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