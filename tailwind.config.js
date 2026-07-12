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
        // Screen/tab content easing in from just below with a soft fade.
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Toast for a verified clue: rise up from the bottom edge.
        'toast-up': {
          '0%': { opacity: '0', transform: 'translate(-50%, 12px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        // Result banner / dropdown popup pop.
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Rubber-stamp slam: overshoot large, then settle. Only scale/opacity
        // here — the stamp's own element owns the rotation, so they compose
        // without fighting over the transform property.
        'stamp-in': {
          '0%': { opacity: '0', transform: 'scale(2.4)' },
          '60%': { opacity: '1', transform: 'scale(1.4)' },
          '100%': { opacity: '1', transform: 'scale(1.5)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'toast-up': 'toast-up 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        'stamp-in': 'stamp-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}
