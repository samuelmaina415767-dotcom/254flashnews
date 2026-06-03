/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f8f7f4',
          100: '#f0ede6',
          200: '#ddd8cc',
          300: '#c4bcad',
          400: '#a89b8a',
          500: '#8f7e6c',
          600: '#7a6859',
          700: '#64564b',
          800: '#534842',
          900: '#463e3a',
          950: '#252019',
        },
        accent: {
          DEFAULT: '#c41e3a',
          50: '#fff1f2',
          100: '#ffe0e3',
          200: '#ffc6cc',
          300: '#ff9aa4',
          400: '#ff5e6e',
          500: '#ff2a3e',
          600: '#f50c22',
          700: '#c41e3a',
          800: '#a31830',
          900: '#881a2e',
          950: '#4c0813',
        },
        gold: {
          DEFAULT: '#b8962e',
          light: '#d4af55',
          dark: '#8a6e1e',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.serif').join(', '),
            maxWidth: 'none',
            color: theme('colors.ink.900'),
            a: { color: theme('colors.accent.DEFAULT'), textDecorationColor: theme('colors.accent.300') },
            'h1,h2,h3,h4': { fontFamily: theme('fontFamily.serif').join(', ') },
          },
        },
        invert: {
          css: {
            color: theme('colors.ink.100'),
            a: { color: theme('colors.accent.400') },
          },
        },
      }),
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
