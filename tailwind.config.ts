import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#faf6f5',
          100: '#f4ede9',
          200: '#e9dad3',
          300: '#ddc7bd',
          400: '#d2b4a7',
          500: '#b5877e', // Primary rose
          600: '#916c65',
          700: '#6d514c',
          800: '#483632',
          900: '#241b19',
        },
        sand: {
          50: '#f9f8f6',
          100: '#f3f0ed',
          200: '#e7e2db',
          300: '#dbd3c9',
          400: '#cfc5b7',
          500: '#c4aa82', // Primary sand
          600: '#9d8868',
          700: '#76664e',
          800: '#4e4434',
          900: '#27221a',
        },
        olive: {
          50: '#f5f6f4',
          100: '#ebede9',
          200: '#d7dad3',
          300: '#c3c8bd',
          400: '#afb5a7',
          500: '#5e6b4a', // Primary olive
          600: '#4b563b',
          700: '#38402c',
          800: '#262b1e',
          900: '#13150f',
        },
        teal: {
          50: '#f5f7f8',
          100: '#ebeff0',
          200: '#d7dee1',
          300: '#c3ced2',
          400: '#afbdc3',
          500: '#6a8e92', // Primary teal
          600: '#557275',
          700: '#405558',
          800: '#2a393a',
          900: '#151c1d',
        },
        gold: {
          50: '#f9f8f5',
          100: '#f3f1eb',
          200: '#e7e3d7',
          300: '#dbd5c3',
          400: '#cfc7af',
          500: '#b5a24c', // Primary gold
          600: '#91823d',
          700: '#6d612e',
          800: '#48411e',
          900: '#24200f',
        },
        // Semantic color mapping
        primary: '#b5877e', // Rose 500
        secondary: '#c4aa82', // Sand 500
        accent: '#b5a24c', // Gold 500
      },
      fontFamily: {
        serif: ['var(--font-miller-display)', 'Georgia', 'serif'],
        sans: ['var(--font-avenir-lt)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}

export default config
