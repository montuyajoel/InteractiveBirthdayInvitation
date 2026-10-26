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
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        // Role colours from src/theme.ts (applied as CSS variables in main.tsx)
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        brand: "rgb(var(--c-brand) / <alpha-value>)",
        soft: "rgb(var(--c-soft) / <alpha-value>)",
        highlight: "rgb(var(--c-highlight) / <alpha-value>)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        night: "rgb(var(--c-night) / <alpha-value>)",
        foliage: "rgb(var(--c-foliage) / <alpha-value>)",
        bloom: "rgb(var(--c-bloom) / <alpha-value>)",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 86%, 100%": { transform: "rotate(0)" },
          "89%": { transform: "rotate(-2.5deg)" },
          "93%": { transform: "rotate(2.5deg)" },
          "96%": { transform: "rotate(-1.5deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.2) rotate(-20deg)", opacity: "0" },
          "25%": { transform: "scale(1.15) rotate(4deg)", opacity: "1" },
          "45%": { transform: "scale(1) rotate(0)", opacity: "1" },
          "100%": { transform: "scale(1.25) rotate(0)", opacity: "0" },
        },
        burst: {
          "0%": { transform: "translate(0, 0) scale(0.3)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translate(var(--dx), var(--dy)) scale(1) rotate(var(--rot))", opacity: "0" },
        },
        light: {
          "0%": { backgroundColor: "#2a0606", boxShadow: "none" },
          "100%": { backgroundColor: "#ff1f1f", boxShadow: "0 0 14px 3px rgb(255 31 31 / 0.75)" },
        },
        rev: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-1px, 1px)" },
          "75%": { transform: "translate(1px, -1px)" },
        },
        streak: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "30%": { transform: "scaleX(1)", opacity: "1" },
          "100%": { transform: "scaleX(0.2) translateY(40px)", opacity: "0" },
        },
        sheen: {
          "0%": { transform: "translateX(0) skewX(-20deg)" },
          "100%": { transform: "translateX(400%) skewX(-20deg)" },
        },
      },
      animation: {
        bob: "bob 3s ease-in-out infinite",
        wiggle: "wiggle 4s ease-in-out infinite",
        pop: "pop 1.1s ease-out forwards",
        burst: "burst 1.2s cubic-bezier(.15,.7,.3,1) forwards",
        light: "light 0.12s ease-out both",
        rev: "rev 0.09s linear infinite",
        streak: "streak 0.7s ease-out both",
        sheen: "sheen 1.2s ease-in-out 0.6s both",
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
