/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: '#080C14',
          card: '#0F172A',
          border: '#1E293B',
          cyan: '#00F0FF',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'hud-scan': 'hudScan 4s linear infinite'
      }
    },
  },
  plugins: [],
}
