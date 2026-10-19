/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7EE', // Main White Cream
          200: '#F3EDE0',
          300: '#E9DFC9',
          400: '#D5C4A1',
          500: '#B8A078',
        },
        cyanlight: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          brand: '#A5F3FC', // 2nd Secondary Cyan light
          soft: '#E0F7FA',
          accent: '#0891B2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Cabinet Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'soft-cream': '0 10px 30px -10px rgba(184, 160, 120, 0.12)',
        'card-subtle': '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
