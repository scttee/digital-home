/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        sand: '#E8DCC4',
        dune: '#C4B5A0',
        stone: '#8B7E74',
        ocean: '#5A7D8C',
        deep: '#2C4A52',
        offwhite: '#F9F7F4',
      },
      fontFamily: {
        display: ['Suisse Intl', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Signifier', 'Georgia', 'serif'],
        mono: ['Pitch', 'Courier', 'monospace'],
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '2rem',
        lg: '4rem',
        xl: '8rem',
      },
    },
  },
  plugins: [],
};
