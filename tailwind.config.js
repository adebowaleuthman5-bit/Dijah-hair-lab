/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFFDF9',
          50: '#FFFDF9',
          100: '#FFF8ED',
        },
        ink: {
          DEFAULT: '#1A1520',
          700: '#2B2432',
          500: '#4A4152',
        },
        gold: {
          DEFAULT: '#D9A94E',
          50: '#FBF3E2',
          100: '#F5E4BD',
          400: '#E2BC70',
          500: '#D9A94E',
          600: '#B98A34',
          700: '#8F6A26',
        },
        rose: {
          DEFAULT: '#E0537D',
          50: '#FDF0F4',
          100: '#FADCE6',
          400: '#EC7A9C',
          500: '#E0537D',
          600: '#C13A63',
        },
        violet: {
          DEFAULT: '#6B5B95',
          100: '#E7E3F1',
          400: '#8B7BB0',
          500: '#6B5B95',
          600: '#544877',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(26, 21, 32, 0.25)',
      },
      keyframes: {
        drawline: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        drawline: 'drawline 1.1s cubic-bezier(0.65,0,0.35,1) forwards',
        fadeup: 'fadeup 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
