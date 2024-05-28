const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primaryBackgroundColor: '#ffffff',
        primaryTextColor: '#212121',
        'jungleGreen' : {
          50: '#effaf5',
          100: '#d9f2e4',
          200: '#b6e4ce',
          300: '#86cfb0',
          400: '#54b38e',
          500: '#329874',
          600: '#22795c',
          700: '#1b614b',
          800: '#184d3d',
          900: '#144033',
          950: '#0a241d',
        },
        dark: {
          primaryBackgroundColor: '#222222',
          primaryTextColor: '#fafafa',
        }
      }
    },
  },
  plugins: [],
};
