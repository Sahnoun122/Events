import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#f9f0e3',
          300: '#f3e5d0',
          400: '#ebd4b4',
          500: '#dcc194',
          600: '#c9a876',
          700: '#b08d5c',
          800: '#8f724a',
          900: '#755e3e',
        },
        beige: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#f9f0e3',
          300: '#f3e5d0',
          400: '#ebd4b4',
          500: '#dcc194',
          600: '#c9a876',
          700: '#b08d5c',
          800: '#8f724a',
          900: '#755e3e',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f4f4f3',
          200: '#e5e5e4',
          300: '#d6d6d3',
          400: '#a6a6a3',
          500: '#8b8b88',
          600: '#6f6f6c',
          700: '#56564f',
          800: '#3d3d37',
          900: '#262622',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-beige': 'linear-gradient(135deg, #fefdfb 0%, #f9f0e3 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
export default config