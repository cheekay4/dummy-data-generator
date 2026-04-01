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
        sora: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
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
        code: {
          key: "#C0392B",
          string: "#7A9F6A",
          number: "#D4A843",
          comment: "#555555",
        },
        valid: "#6AAF67",
        invalid: "#C0392B",
      },
      letterSpacing: {
        tight: "-0.02em",
        wide: "0.04em",
      },
    },
  },
  plugins: [],
};
export default config;
