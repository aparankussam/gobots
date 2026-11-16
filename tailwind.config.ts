import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F2F2EE',
          2: '#E9E9E3',
          3: '#FBFBF8',
        },
        ink: {
          DEFAULT: '#121212',
          2: '#4F4F49',
          3: '#6A6A63',
          4: '#A8A8A0',
        },
        rule: {
          DEFAULT: 'rgba(18,18,18,0.14)',
          strong: 'rgba(18,18,18,0.6)',
          inv: 'rgba(242,242,238,0.16)',
        },
        // Logo orange. Seal and stamp ink only.
        seal: {
          DEFAULT: '#E0643A',
          ink: '#B4431F', // text-safe on paper (≥4.5:1)
          soft: '#F7DDD2',
        },
        verdict: {
          safe: '#1F6B45',
          warn: '#9A6200',
          block: '#B4231F',
        },
        // Legacy alias so untouched markup keeps compiling.
        accent: '#E0643A',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '78rem',
      },
      borderRadius: {
        doc: '3px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
