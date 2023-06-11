/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  important: true,
  mode: "JIT",
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        blue: "#003B7D",
        lblue: "#006A81",
        green: "#63AE12",
        yellow: "#FF9B00",
      },
      boxShadow: {
        bxs: "0 0 30px 0 rgba(0,0,0,.1)",
      },
      backgroundImage: {
        surfixLogoPng: "url(../../assets/imgs/surfixLogo.png)",
      },
    },
    screens: {
      tablet: { max: "830px" },
      services: { max: "415px" },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".word-break": {
          "word-break": "break-word",
        },
      });
    }),
  ],
};
