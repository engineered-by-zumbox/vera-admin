/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EDC759",
          200: "#F6F0E7",
          300: "#FFF8F1",
          DEFAULT: "#DFB146",
        },
        myGray: {
          100: "#959089",
          200: "#CCC6BE",
          300: "#E8E1D9",
          400: "#767471",
          500: "#666666",
          DEFAULT: "#7B7670",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
