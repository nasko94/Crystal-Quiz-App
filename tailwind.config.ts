import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#FF69B4',
          purple: '#9B59B6',
          light: '#E8B4F0',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF69B4 0%, #9B59B6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #E8B4F0 0%, #D4A5F5 100%)',
      },
    },
  },
  plugins: [],
}
export default config

