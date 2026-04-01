import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        shu: {
          DEFAULT: "#C0392B",
          light: "rgba(192,57,43,0.08)",
        },
        sumi: {
          DEFAULT: "#1C1C1C",
          light: "#2A2A2C",
        },
        kinari: {
          DEFAULT: "#FAFAF5",
          warm: "#F7F5F0",
          surface: "#FDFCF8",
        },
        washi: {
          DEFAULT: "#EEEAE2",
          light: "#F0EDE4",
        },
        fude: {
          DEFAULT: "#999185",
          light: "#B0A99C",
          muted: "#C4BCB0",
          dim: "#D5CFC4",
        },
        brand: {
          primary: "#1E4D7B",
          accent: "#D84835",
          highlight: "#D4AF37",
        },
        code: {
          key: "#60a5fa",
          string: "#fbbf24",
          number: "#34d399",
          comment: "#6b7280",
        },
        valid: "#10b981",
        invalid: "#ef4444",
      },
      letterSpacing: {
        tight: "-0.02em",
        wide: "0.04em",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(5deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(-5deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "float-slow": "float 20s ease-in-out infinite",
        "float-medium": "float 25s ease-in-out infinite reverse",
        "float-fast": "float 30s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
