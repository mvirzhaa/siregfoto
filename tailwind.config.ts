import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // UIKA Primary Green
        uika: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',   // Primary green UIKA
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // UIKA Accent Yellow
        kuning: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',   // Primary yellow UIKA
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Neutral for text/bg
        slate: {
          50: '#f8fafc',
          // ... (tailwind defaults)
        }
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'uika': '0 4px 24px rgba(21, 128, 61, 0.12)',
        'uika-lg': '0 8px 40px rgba(21, 128, 61, 0.18)',
      },
      backgroundImage: {
        'uika-gradient': 'linear-gradient(135deg, #15803d 0%, #166534 50%, #052e16 100%)',
        'uika-light': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      }
    },
  },
  plugins: [],
}

export default config
