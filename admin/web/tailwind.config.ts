import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Inter", ...(defaultTheme.fontFamily?.sans ?? [])],
      },
      colors: {
        brand: {
          light: "#38bdf8",
          DEFAULT: "#0ea5e9",
          dark: "#0284c7",
        },
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 55%), radial-gradient(circle at 80% 0%, rgba(129, 140, 248, 0.25), transparent 60%)",
      },
      boxShadow: {
        elevated: "0 24px 60px -25px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
