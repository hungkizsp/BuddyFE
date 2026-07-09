/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#010828',
        cream:   '#F3F4F6',
        neon:    '#6FFF00',
        primary: '#3B82F6',
        accent:  '#FFB83F',
        danger:  '#FF4A5A',
        surface: 'rgba(15, 23, 42, 0.45)',
      },
      fontFamily: {
        grotesk:   ['"Space Grotesk"', 'Anton', 'sans-serif'],
        condiment: ['"Condiment"', 'cursive'],
        mono:      ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        nunito:    ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        sm:  '0.5rem',
        md:  '1rem',
        lg:  '1.5rem',
        xl:  '2rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        glass:  '0 8px 32px rgba(0, 0, 0, 0.5)',
        glow:   '0 0 20px rgba(59, 130, 246, 0.35)',
        'glow-green': '0 0 20px rgba(111, 255, 0, 0.3)',
        'glow-gold':  '0 0 20px rgba(255, 184, 63, 0.3)',
        'glow-coral': '0 0 20px rgba(255, 74, 90, 0.3)',
        soft:   '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
        'slide-up':  'slideUp 0.35s ease-out',
        'slide-right':'slideRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':   'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
