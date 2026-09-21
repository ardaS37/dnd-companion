/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0px',
      DEFAULT: '0px',
      sm: '2px',
      full: '9999px'
    },
    extend: {
      colors: {
        app: 'var(--c-app)',
        panel: 'var(--c-panel)',
        panel2: 'var(--c-panel-2)',
        line: 'var(--c-line)',
        fg: 'var(--c-fg)',
        fg2: 'var(--c-fg-2)',
        accent: {
          DEFAULT: 'var(--c-accent)',
          hover: 'var(--c-accent-hover)',
          fg: 'var(--c-accent-fg)'
        }
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        ui: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
}
