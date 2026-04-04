import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Fuentes que le dan identidad visual propia al proyecto
        display: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-crimson)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        // Paleta oscura con acento dorado — estética MTG
        obsidian: {
          950: '#09090f',
          900: '#0f0f1a',
          800: '#16162a',
          700: '#1e1e38',
          600: '#2a2a4a',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
        },
        mana: {
          white:  '#f9fafb',
          blue:   '#3b82f6',
          black:  '#1f2937',
          red:    '#ef4444',
          green:  '#22c55e',
          gold:   '#f59e0b',
          colorless: '#9ca3af',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config