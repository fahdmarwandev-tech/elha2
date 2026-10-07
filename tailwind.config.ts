import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#B8860B",
          light: "#E5C07B",
          dark: "#92400E",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e5ede6",
          200: "#ccdcce",
          300: "#a9c4ad",
        },
      },
      fontFamily: {
        aref: ["ArefRuqaa", "serif"],
        heading: ["var(--font-heading)", "Cairo", "sans-serif"],
        body: ["var(--font-body)", "Tajawal", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
