/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Tech Cyber Defense Palette (Strictly ZERO Purple/Indigo)
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
          950: '#070b14', // Deepest midnight dark
          900: '#0c1322', // Primary card background
          850: '#111b2f', // Elevated card / inner element
          800: '#16233d', // Card border
          750: '#1d2e50', // Border hover
          700: '#253962', // Active border
          600: '#344e82',
        },
        republika: {
          red: '#dc2626',
          blue: '#0284c7',
          cyan: '#06b6d4',
          navy: '#0b162c',
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
