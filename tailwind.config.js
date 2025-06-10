/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B47E0',
        secondary: '#8B7FE8',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F7F9FC',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'draw-check': 'draw-check 0.3s ease-in-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out'
      },
      keyframes: {
        'draw-check': {
          '0%': { strokeDasharray: '0 16', strokeDashoffset: '0' },
          '100%': { strokeDasharray: '16 16', strokeDashoffset: '0' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}