/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // Переконайтеся, що охоплені всі файли
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
      },
    },
  },
  plugins: [],
};
