import typography from '@tailwindcss/typography';

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
        // Tokyo Night Palette
        tokyo: {
          bg: '#1a1b26',         // Background default
          darker: '#16161e',     // Darkest / sidebars / modals
          card: '#1f2335',       // Panel / card background
          cardHover: '#24283b',  // Hover surface
          border: '#292e42',     // Subtle borders
          borderLight: '#3b4261',// Active / focus borders
          text: '#c0caf5',       // Primary text
          muted: '#9aa5ce',      // Secondary text
          dim: '#565f89',        // Dim / comments / disabled
          cyan: '#7dcfff',       // Vibrant Cyan accent
          blue: '#7aa2f7',       // Bright Blue accent
          purple: '#bb9af7',     // Purple
          green: '#9ece6a',      // Green / success
          orange: '#ff9e64',     // Orange
          red: '#f7768e',        // Red / error
          yellow: '#e0af68',     // Yellow / warning
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(125, 207, 255, 0.25)',
        'glow-blue': '0 0 25px -4px rgba(122, 162, 247, 0.3)',
        'cursor-card': '0 4px 20px -2px rgba(10, 10, 16, 0.6), 0 0 0 1px rgba(41, 46, 66, 0.8)',
      },
      animation: {
        'neural-pulse': 'neuralPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [typography],
}
