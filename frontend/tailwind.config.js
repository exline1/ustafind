/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#5aff91',
          500: '#3eb265',
          600: '#2d7f48',
          700: '#1e5c34',
          800: '#164a29',
          900: '#0f3a1e',
        },
        neutral: {
          0:   '#ffffff',
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4rem)',   { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)',     { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.75' }],
        'body-md':    ['1rem',     { lineHeight: '1.625' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.5' }],
        'label':      ['0.75rem',  { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'brand': '0 4px 14px rgba(62,178,101,0.4)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3eb265 0%, #2d7f48 100%)',
        'gradient-brand-light': 'linear-gradient(135deg, #5aff91 0%, #3eb265 100%)',
        'gradient-section-bg': 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
      }
    },
  },
  plugins: [],
}
