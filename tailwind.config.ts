import type { Config } from "tailwindcss";
import { defaultTheme, generateTailwindConfig } from "./src/theme/theme";

const themeConfig = generateTailwindConfig(defaultTheme);

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      ...themeConfig.theme.extend,
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;