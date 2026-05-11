import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./stores/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "IBM Plex Mono",
          "Space Mono",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ]
      },
      boxShadow: {
        hardSm: "2px 2px 0 #000",
        hardMd: "4px 4px 0 #000",
        hardLg: "8px 8px 0 #000"
      }
    }
  },
  plugins: []
};

export default config;
