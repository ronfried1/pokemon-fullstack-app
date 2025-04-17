/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  safelist: [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
    'bg-purple-700', 'bg-lime-600', 'bg-sky-300', 'bg-orange-700', 'bg-stone-600',
    'bg-amber-700', 'bg-indigo-600', 'bg-cyan-400', 'bg-indigo-700', 'bg-gray-400',
    'bg-pink-400', 'bg-slate-400', 'bg-gray-800'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 