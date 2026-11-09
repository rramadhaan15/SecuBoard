/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Cyber Security & Ocean Tech Palette (NO PURPLE/INDIGO)
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Vibrant Cyber Cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        navy: {
          950: '#080c14', // Deepest dark background
          900: '#0c1322', // Primary surface card
          850: '#111a2e', // Elevated card / inner element
          800: '#17233d', // Card border / divider
          750: '#1e2f52', // Hover border
          700: '#253a63', // Active border
          600: '#344e82',
        },
        republika: {
          red: '#dc2626',
          blue: '#0284c7',
          navy: '#0b192e',
          accent: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyber-sm': '0 0 10px rgba(6, 182, 212, 0.15)',
        'cyber': '0 0 20px rgba(6, 182, 212, 0.25)',
        'cyber-lg': '0 0 30px rgba(6, 182, 212, 0.35)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.25)',
        'rose-glow': '0 0 20px rgba(244, 63, 94, 0.25)',
      }
    },
  },
  plugins: [],
}
