import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deped: {
          blue: "#1E3A8A",
          "blue-dark": "#162D6E",
          "blue-light": "#EEF2FF",
          gold: "#CA8A04",
          "gold-light": "#FEF9C3",
        },
        sidebar: "#FFFFFF",
        "sidebar-border": "#E5E7EB",
        "sidebar-active": "#1E3A8A",
        "sidebar-hover": "#F3F4F6",
        brand: "#1E3A8A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
