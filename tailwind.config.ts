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
        // Luxury Midnight Navy & Warm Caramel/Sandstone Palette
        navy: {
          DEFAULT: "#101726",
          dark: "#0B1220",
          surface: "#152132",
          card: "#182436",
          border: "#22334A",
          inner: "#111A29",
          muted: "#233246",
        },
        caramel: {
          DEFAULT: "#C49A6C", // Warm Caramel / Desert Gold
          light: "#D4AF85",
          dark: "#7D5E3B",
          glow: "rgba(196, 154, 108, 0.5)",
        },
        sandstone: {
          DEFAULT: "#DECDB7", // Warm desert sandstone from Image 2
          light: "#EAE0D1",
          dark: "#C5B29B",
        },
        ivory: {
          DEFAULT: "#FAF7F0",
          pure: "#FFFFFF",
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
