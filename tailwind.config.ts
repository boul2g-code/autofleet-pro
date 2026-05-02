import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        bg: '#0f0f18',
        surface: '#17171f',
        card: '#1e1e2a',
        border: '#2a2a3e',
        accent: '#f0a500',
        accent2: '#e06c00',
        muted: '#6a6a8a',
        success: '#2ed573',
        error: '#ff4444',
        info: '#4a90e2',
      },
    },
  },
  plugins: [],
}

export default config
