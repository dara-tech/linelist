/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Krasar', 'Kantumruy Pro', 'Khmer Battambang', 'Google Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Bayon', 'Krasar', 'Kantumruy Pro', 'Khmer Battambang', 'Google Sans', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace', 'Krasar'],
        moul: ['Moul', 'Khmer OS Muol Light', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--app-header-bar-bg, #2c6693)',
          foreground: '#ffffff',
        },
        'app-primary': 'var(--app-header-bar-bg, #2c6693)',
        'app-tint-8': 'rgba(var(--app-header-bar-rgb, 44 102 147) / 0.08)',
        'app-tint-10': 'rgba(var(--app-header-bar-rgb, 44 102 147) / 0.10)',
        'app-tint-16': 'rgba(var(--app-header-bar-rgb, 44 102 147) / 0.16)',
        'app-tint-35': 'rgba(var(--app-header-bar-rgb, 44 102 147) / 0.35)',
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
}
