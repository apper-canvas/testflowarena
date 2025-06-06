/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#1D4ED8'
        },
        secondary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4338CA'
        },
        accent: '#F59E0B',
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
},
        border: {
          DEFAULT: '#E2E8F0', // surface-200
          light: '#F1F5F9',   // surface-100
          dark: '#334155'     // surface-700
        },
        input: {
          DEFAULT: '#F8FAFC', // surface-50
          border: '#E2E8F0'   // surface-200
        },
        ring: {
          DEFAULT: '#3B82F6', // primary
          offset: '#FFFFFF'
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC' // surface-50
        },
        foreground: {
          DEFAULT: '#1E293B', // surface-800
          muted: '#64748B'    // surface-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui'],
        content: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'neu-light': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-dark': '8px 8px 16px #0f172a, -8px -8px 16px #1e293b'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}