/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        dot1: "dot1 2s steps(1, end) infinite",
        dot2: "dot2 2s steps(1, end) infinite",
        dot3: "dot3 2s steps(1, end) infinite",
      },
      keyframes: {
        dot1: {
          // Dot 1 is visible from 0% to 75%, then off for the last 25%
          "0%, 75%": { opacity: "1" },
          "75.01%, 100%": { opacity: "0" },
        },
        dot2: {
          // Dot 2: hidden from 0–25%, visible from 25–75%, then hidden.
          "0%, 25%": { opacity: "0" },
          "25%, 75%": { opacity: "1" },
          "75.01%, 100%": { opacity: "0" },
        },
        dot3: {
          // Dot 3: hidden from 0–50%, visible from 50–75%, then hidden.
          "0%, 50%": { opacity: "0" },
          "50%, 75%": { opacity: "1" },
          "75.01%, 100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
}

