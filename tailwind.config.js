/** @type {import('tailwindcss').Config} */
// Tailwind is installed for potential future use only.
// All component colors come from the theme object `t` (see src/theme/themes.js).
// Do NOT use Tailwind color classes in components.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
