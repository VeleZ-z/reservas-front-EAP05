import type { Config } from "tailwindcss";

const colors = {
  lightTurquoise: "#DDF3F0",
  oliveDark: "#60714E",
  sageGreen: "#89A666",
  mossGreen: "#838E73",
  bronze: "#72583D",
};

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
} satisfies Config;
