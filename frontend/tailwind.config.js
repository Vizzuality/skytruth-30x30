/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        mono: ['var(--font-overpass-mono)', ...defaultTheme.fontFamily.mono],
        sans: ['var(--font-figtree)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: '#000000',
        'black-300': '#666666',
        'black-400': '#333333',
        blue: '#3C70FF',
        green: '#02B07C',
        orange: '#FD8E28',
        violet: '#AD6CFF',
        'gray-300': '#999999',
      },
      maxWidth: {
        screen: '100vw',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/line-clamp')],
};
