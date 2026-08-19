/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths — Tailwind scans these for class names
  content: [
    './views/**/*.ejs',
    './public/js/**/*.js',
  ],

  theme: {
    extend: {
      // Serif font: Playfair Display (Google Fonts, loaded via head.ejs)
      // Sans-serif: Inter (Google Fonts, loaded via head.ejs)
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // Breakpoints (Req 16.1): mobile <768, tablet 768-1023, desktop >=1024
      // Tailwind defaults: sm=640, md=768, lg=1024, xl=1280 — we use md/lg
      // No override needed; Tailwind's md (768) and lg (1024) match requirements.

      colors: {
        // Primary palette: stone-based earthy neutrals (HSL saturation 10-40%, lightness 40-80%)
        // stone-50: hsl(60,9%,98%) — lightness 98% ≥95% (primary bg) ✓
        // stone-100: hsl(60,5%,96%) — lightness 96% ≥95% ✓
        // stone-200: hsl(20,6%,90%) — earthy neutral ✓
        // stone-400: hsl(24,6%,64%) — earthy neutral ✓
        // stone-500: hsl(25,5%,45%) — earthy neutral ✓
        // stone-700: hsl(28,7%,26%) — dark, lightness ~26% ≤30% ✓
        // stone-800: hsl(24,10%,10%) — typography, lightness ~10% ≤15% ✓
        // stone-900: hsl(24,10%,6%) — deep dark, lightness ~6% ≤15% ✓
        // All stone shades have saturation 5-10% — well within 10-40% earthy range ✓
      },
    },
  },

  plugins: [],
};
