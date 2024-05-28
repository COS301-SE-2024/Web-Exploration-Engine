const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),

    ...createGlobPatternsForDependencies(__dirname),
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        first: 'moveVertical 30s ease infinite',
        second: 'moveInCircle 20s reverse infinite',
        third: 'moveInCircle 40s linear infinite',
        fourth: 'moveHorizontal 40s ease infinite',
        fifth: 'moveInCircle 20s ease infinite',
      },
      keyframes: {
        moveHorizontal: {
          '0%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
          '50%': {
            transform: 'translateX(50%) translateY(10%)',
          },
          '100%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
        },
        moveInCircle: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(180deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        moveVertical: {
          '0%': {
            transform: 'translateY(-50%)',
          },
          '50%': {
            transform: 'translateY(50%)',
          },
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
      },
      colors: {
        primaryBackgroundColor: '#ffffff',
        primaryTextColor: '#212121',
        jungleGreen: {
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
        },
      },
    },
  },
  plugins: [nextui()],
};

