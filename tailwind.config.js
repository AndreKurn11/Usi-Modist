/** @type {import('tailwindcss').Config} */

module.exports = {
  // Content paths — Tailwind scans these for class names
  content: [
    "./views/**/*.ejs",
    "./public/js/**/*.js",
  ],

  theme: {
    extend: {
      // Typography
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      // Usimodist Color Palette
      colors: {
        // Background
        ivory: "#FAF9F7",
        cream: "#F5F3F0",
        softwhite: "#FEFEFE",

        // Brand / Primary
        brown: {
          DEFAULT: "#3B342A",
          light: "#8E7455",
          dark: '#2B2721',
        },

        // Natural Accent
        olive: "#716645",

        // Supporting Neutral
        taupe: {
          DEFAULT: "#9C9387",
          light: "#BBAFA1",
        },

        // Border
        border: "#E7E5E2",
      },

      // CTA FLOAT ANIMATION
      keyframes: {
        "float-cta": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
      },

      animation: {
        "float-cta": "float-cta 2.5s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};