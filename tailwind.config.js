/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#3498db',
          600: '#2980b9',
          700: '#1e88e5',
          800: '#1976d2',
          900: '#1565c0',
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#e67e22',
          600: '#d35400',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },
        success: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#27ae60',
          600: '#2e7d32',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        background: {
          DEFAULT: '#2c3e50',
          secondary: 'rgba(0, 0, 0, 0.3)',
          tertiary: 'rgba(0, 0, 0, 0.2)',
          overlay: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.9)',
          tertiary: 'rgba(255, 255, 255, 0.8)',
          muted: 'rgba(255, 255, 255, 0.6)',
          disabled: 'rgba(255, 255, 255, 0.4)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.2)',
          secondary: 'rgba(255, 255, 255, 0.1)',
          tertiary: 'rgba(255, 255, 255, 0.05)',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}