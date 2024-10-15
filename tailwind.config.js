module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        customOrange: '#F98D4E',
        neonOrange: '#fa8c1a',
        lightOrange: '#ff9a27',
        darkBlue: '#2a2d49',
        customBlue: '#2e354f',
      },
      fontFamily: {
        sans: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      // fontSize: {
      //   'xs': '0.75rem',
      //   'sm': '0.875rem',
      //   'base': '1rem',
      //   'lg': '1.125rem',
      //   'xl': '1.25rem',
      //   '2xl': '1.5rem',
      //   '3xl': '1.875rem',
      //   '4xl': '2.25rem',
      //   '5xl': '3rem',
      // },
    },
  },
  plugins: [],
};