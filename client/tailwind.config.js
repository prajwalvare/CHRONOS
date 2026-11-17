/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chronos: {
          bg: '#080807',
          bgSecondary: '#12110F',
          surface: '#1C1914',
          brass: '#A98143',
          gold: '#C9A45C',
          goldHighlight: '#E5C78A',
          parchment: '#D8C7A5',
          text: '#E9E0D0',
          textMuted: '#9A907E',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brass-subtle': '0 0 15px -3px rgba(169, 129, 67, 0.15)',
        'gold-glow': '0 0 25px -5px rgba(201, 164, 92, 0.25)',
      },
    },
  },
  plugins: [],
};
