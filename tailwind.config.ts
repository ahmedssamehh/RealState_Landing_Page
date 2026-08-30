import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        burgundy: {
          DEFAULT: '#630000',
          deep: '#3d0000',
          soft: '#7d1616',
        },
        ivory: '#EEEBDD',
        champagne: '#D8B6A4',
      },
      fontFamily: {
        serif: [
          'var(--font-display)',
          'var(--font-display-greek)',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.32em',
        wider2: '0.18em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        power4: 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      maxWidth: {
        edge: '112rem',
      },
    },
  },
  plugins: [],
};

export default config;
