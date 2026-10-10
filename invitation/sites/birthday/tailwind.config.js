/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Allura"', "cursive"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      colors: {
        plum: "#5c3a63",
        mauve: "#9a6aa0",
        lilac: "#e9dcf0",
        blush: "#f6dde8",
        paper: "#fbf6fb",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        flutter: {
          "0%, 100%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(0.55)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(-4deg)" },
          "50%": { transform: "translate(10px, -14px) rotate(6deg)" },
        },
        "float-up": {
          "0%": { transform: "translate(0, 0) scale(0.6)", opacity: "0" },
          "15%": { opacity: "1" },
          "100%": { transform: "translate(var(--dx), -220px) scale(1.1) rotate(var(--rot))", opacity: "0" },
        },
      },
      animation: {
        flutter: "flutter 0.6s ease-in-out infinite",
        drift: "drift 7s ease-in-out infinite",
        "float-up": "float-up 1.8s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
