import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        'light-text': '#11181C',
        'light-background': '#ffffff',
        'light-tint': '#000000',
        'light-icon': '#687076',
        'light-card-bg': '#ffffff',
        'light-card-border': '#e5e5e5',
        'light-divider': '#e5e5e5',
        'light-hover': '#f5f5f5',
        'light-input-bg': '#f9f9f9',
        'light-input-border': '#e0e0e0',
        
        // Dark mode
        'dark-text': '#ECEDEE',
        'dark-background': '#151718',
        'dark-tint': '#ffffff',
        'dark-icon': '#9BA1A6',
        'dark-card-bg': '#1c1c1e',
        'dark-card-border': '#2c2c2e',
        'dark-divider': '#2c2c2e',
        'dark-hover': '#2c2c2e',
        'dark-input-bg': '#1c1c1e',
        'dark-input-border': '#2c2c2e',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
