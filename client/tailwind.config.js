/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      "primary":{
        100:"#0f5fff",
        200:"#4e6fff",
        300:"#6e7fff",
        400:"#8891ff",
        500:"#9fa2ff",
        600:"#b4b4ff"
      },
      "darkSurface":{
        100:"#121212",
        200:"#282828",
        300:"#3f3f3f",
        400:"#575757",
        500:"#717171",
        600:"#8b8b8b"
      },
      "mixed":{
        100:"#191926",
        200:"#2e2e3a",
        300:"#454450",
        400:"#5d5c67",
        500:"#76757e",
        600:"#908f97"
      },
      "offWhite":"#FFFFF0",
    },
    extend: {},
  },
  plugins: [],
}
