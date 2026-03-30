/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aws-orange': '#FF9900',
        'react-blue': '#61DAFB',
        'ts-blue': '#3178C6',
      },
    },
  },
  plugins: [],
}