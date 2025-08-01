/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
		  extend: {
        colors: {
          primary: "#008B8B",       // Deep teal for headers, main identity
          secondary: "#2F4858",     // Muted blue-gray for text/buttons
          secondaryLight: '#91A3B6',
          light: {
            100: "#E0F7F7",         // Lightest background, input fields, cards
            200: "#BFEAEA",         // Hover states or secondary highlights
            300: "#9AD6D6",         // Alternate accent or soft info
          },
          dark: {
            100: "#1C2B33",         // App background or deep modal
            200: "#121C22",         // Bottom nav, footers, deepest backgrounds
          },
          accent: "#F9A826",        // Warm gold for contrast (buttons, icons, links)
        }
      },
  },
  plugins: []
}