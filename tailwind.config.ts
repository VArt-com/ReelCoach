import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0f',
        ember: '#ff6a00',
        lime: '#c6ff3d',
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 106, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
