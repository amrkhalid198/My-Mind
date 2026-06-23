/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notebook palette — ink on black paper
        nb: {
          bg:        '#0a0a09',   // near-black with warmth
          surface:   '#111110',   // slightly lighter surface
          line:      '#1c1c1a',   // thin divider lines
          muted:     '#3a3835',   // muted borders
          secondary: '#6b6560',   // dates, previews
          primary:   '#e8e4dc',   // main text — warm off-white
          accent:    '#c4a882',   // aged paper tan — one accent
          danger:    '#9b4a3a',   // delete — muted red
        }
      },
      fontFamily: {
        // Writing surface: monospace for notebook feel
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        // UI chrome: system sans
        sans: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Ensure 16px minimum on inputs to prevent iOS zoom
        'input': ['16px', '24px'],
      },
    },
  },
  plugins: [],
}
