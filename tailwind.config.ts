import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'wa-bg': '#111B21',
        'wa-bg-light': '#0B141A',
        'wa-panel': '#202C33',
        'wa-panel-header': '#202C33',
        'wa-primary': '#00A884',
        'wa-primary-dark': '#008069',
        'wa-incoming': '#202C33',
        'wa-outgoing': '#005C4B',
        'wa-hover': '#2A3942',
        'wa-border': '#2A3942',
        'wa-text': '#E9EDEF',
        'wa-text-secondary': '#8696A0',
      },
    },
  },
  plugins: [],
};

export default config;
