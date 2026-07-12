/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Active accents per design spec.
        crimson: {
          DEFAULT: '#e11d48',
          dim: '#9f1239',
        },
        teal: {
          DEFAULT: '#2dd4bf',
          dim: '#0f766e',
        },
        // Aged-paper tones for the filing-cabinet folders.
        paper: {
          DEFAULT: '#e8e3d5',
          drift: '#b8bec6',
          fall: '#c9a56b',
          signal: '#1a1a1a',
          work: '#3d4a3a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.82' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        flicker: 'flicker 4s ease-in-out infinite',
        blink: 'blink 1.1s step-end infinite',
        scanline: 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [],
}
