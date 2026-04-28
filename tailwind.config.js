/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lightGreen": "#CCF4D1",
        "lightOrange": "#F0E2BF",
        "lightPurple": "#D7D1F7",
        "lightRed": "#FFD2C3",
        "description": "#7B7B7B",
        "mainGreen": "#007145",
        "mainPurple": "#8B76F9",
        "mainRed": "#FFD2C3",
      },
      fontFamily: {
        workSans: ['Work Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [{
    pattern: /(bg|text|border)-light(Green|Orange|Red|Purple)/
}

],
});
