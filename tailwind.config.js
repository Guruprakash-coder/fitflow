/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0b0f17",
        darkCard: "rgba(22, 28, 45, 0.6)",
        emeraldCustom: "#10b981",
        cyanCustom: "#06b6d4",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

