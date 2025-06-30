/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily:{
        "work-sans":"Work Sans, sans-serif",
      },
      
    }
  },

  plugins: [require("@tailwindcss/typography")]
};
