import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f7f8f3',
          100: '#eef0e6',
          200: '#dce2cd',
          300: '#c5cfad',
          400: '#a8b885',
          500: '#8d9f67',
          600: '#72814f',
          700: '#5a6541',
          800: '#4a5236',
          900: '#3e452f',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e3e8df',
          200: '#c7d1bf',
          300: '#a5b398',
          400: '#849575',
          500: '#6b7c5d',
          600: '#546349',
          700: '#434f3b',
          800: '#374132',
          900: '#2f372b',
        },
        honey: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
  plugins: [],
}
export default config
