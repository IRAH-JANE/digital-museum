/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#EFE9DD',
        paper: '#FBF8F2',
        linen: '#E4DCCC',
        charcoal: '#1C1A17',
        umber: '#2E2721',
        gold: '#A9854E',
        stone: '#8B8378',
        night: '#0D0C0B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Jost', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      letterSpacing: {
        plaque: '0.18em',
        wall: '0.3em',
      },
      maxWidth: {
        reading: '64ch',
      },
      transitionTimingFunction: {
        gallery: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'label-rise': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'label-rise': 'label-rise 420ms cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}
