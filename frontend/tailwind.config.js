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
        mono: ['"Overpass Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        black: '#1E1E1E',
        blue: '#3C70FF',
        green: '#02B07C',
        orange: '#FD8E28',
        violet: '#AD6CFF',
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
        'in-absolute': {
          from: {
            transform:
              'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))',
            position: 'absolute',
          },
          to: {
            position: 'absolute',
          },
        },
        'out-absolute': {
          from: {
            position: 'absolute',
          },
          to: {
            transform:
              'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))',
            position: 'absolute',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'in-absolute': 'in-absolute 0.5s ease-out',
        'out-absolute': 'out-absolute 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
