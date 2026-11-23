/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        // Specified Luxury Palette
        primaryMaroon: '#581C2B',
        deepBurgundy: '#3D0715',
        royalGold: '#D4AF37',
        champagne: '#F5E6CC',
        ivory: '#FFF9F0',
        roseGold: '#B76E79',
        darkBrown: '#38251F',

        // Color shades for versatile utility classes
        maroon: {
          950: '#2A050E',
          900: '#3D0715', // Deep Burgundy
          800: '#581C2B', // Primary Maroon
          700: '#6D2034',
          600: '#800020', // Burgundy
          500: '#9B1135',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FBF5EC',
          200: '#F5E6CC', // Champagne
          300: '#EBD2A4',
          400: '#E0BC6C',
          500: '#D4AF37', // Royal Gold
          600: '#B89428',
          700: '#94751D',
          800: '#735B17',
          900: '#534110',
        },
        deepBrown: '#38251F',
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        heading: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Noto Serif Devanagari"', '"Rozha One"', 'serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #3D0715 0%, #581C2B 50%, #38251F 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF9F0 50%, #D4AF37 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FFF9F0 0%, #F5E6CC 100%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
