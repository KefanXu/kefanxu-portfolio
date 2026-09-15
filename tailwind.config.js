/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#E0E5EC',
          dark: '#2B2D33',
        },
        text: {
          light: '#4A5568', // Slate 600
          dark: '#E2E8F0', // Slate 200
        },
        primary: {
          light: '#667EEA', // Indigo
          dark: '#818CF8',
        }
      },
      boxShadow: {
        // Reverted to original realistic neumorphic shadows
        'neu-light': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neu-pressed-light': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
        'neu-icon-light': '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)',
        
        'neu-3': '8px 8px 35px rgba(138, 155, 189, 0.20), -8px -8px 35px #FFFFFF, inset 8px 8px 25px #FFFFFF, inset -8px -8px 25px rgba(138, 155, 189, 0.15)',

        'neu-dark': '5px 5px 10px #1d1e22, -5px -5px 10px #393c44',
        'neu-pressed-dark': 'inset 5px 5px 10px #1d1e22, inset -5px -5px 10px #393c44',
        'neu-icon-dark': '3px 3px 6px #1d1e22, -3px -3px 6px #393c44',
      },
      fontFamily: {
        sans: ['Fira Code', 'monospace'], // Changed default sans to Fira Code
        mono: ['Fira Code', 'monospace'],
        display: ['DM Sans', 'sans-serif'], // Added DM Sans for readability
        heading: ['Gilroy', 'sans-serif'], // Updated to use local Gilroy font
        serif: ['Merriweather', 'serif'], // Added Merriweather for print-like readability
      }
    },
  },
  plugins: [],
}
