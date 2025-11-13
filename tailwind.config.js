/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgb(226 232 240)', // slate-200
        input: 'rgb(226 232 240)', // slate-200
        ring: 'rgb(99 102 241)', // indigo-500
        background: 'rgb(248 250 252)', // slate-50
        foreground: 'rgb(15 23 42)', // slate-900
        primary: {
          DEFAULT: 'rgb(79 70 229)', // indigo-600
          foreground: 'rgb(255 255 255)',
        },
        secondary: {
          DEFAULT: 'rgb(241 245 249)', // slate-100
          foreground: 'rgb(51 65 85)', // slate-700
        },
        destructive: {
          DEFAULT: 'rgb(239 68 68)', // red-500
          foreground: 'rgb(255 255 255)',
        },
        muted: {
          DEFAULT: 'rgb(241 245 249)', // slate-100
          foreground: 'rgb(100 116 139)', // slate-500
        },
        accent: {
          DEFAULT: 'rgb(241 245 249)', // slate-100
          foreground: 'rgb(51 65 85)', // slate-700
        },
        popover: {
          DEFAULT: 'rgb(255 255 255)',
          foreground: 'rgb(15 23 42)', // slate-900
        },
        card: {
          DEFAULT: 'rgb(255 255 255)',
          foreground: 'rgb(15 23 42)', // slate-900
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
