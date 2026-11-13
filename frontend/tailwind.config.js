/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        onemedical: {
          forest: '#084d46',
          forestDark: '#053934',
          forestHeading: '#0a3d36',
          sage: '#ebf3ea',
          sageLight: '#f4f8f4',
          sageBorder: '#dce8dc',
          cream: '#fafaf7',
          muted: '#52616b',
        },
        health: {
          teal: '#0D9488',
          deepTeal: '#0F766E',
          navy: '#16324A',
          bg: '#F7FAF9',
          bgSecondary: '#EFF6F5',
          card: '#FFFFFF',
          border: '#E5ECEA',
          text: '#172B3A',
          textMuted: '#64748B',
          textSubtle: '#94A3B8',
          mint: '#E7F5F2',
          paleBlue: '#EFF6FF',
          amber: '#FFF7E6',
          softRed: '#FEF2F2',
          softGreen: '#ECFDF5',
        },
        saathi: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e48',
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      borderRadius: {
        'card': '16px',
        'btn': '11px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(22, 50, 74, 0.04), 0 1px 2px -1px rgba(22, 50, 74, 0.04)',
        'card': '0 4px 20px -2px rgba(22, 50, 74, 0.05)',
        'card-hover': '0 10px 25px -4px rgba(22, 50, 74, 0.08)',
        'teal-glow': '0 4px 14px 0 rgba(13, 148, 136, 0.22)',
      }
    },
  },
  plugins: [],
}
