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
        gold: "rgb(var(--c-gold) / <alpha-value>)",
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
        shimmer: {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
        glint: {
          "0%, 70%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "80%": { opacity: "1", transform: "scale(1) rotate(45deg)" },
          "90%": { opacity: "0.6", transform: "scale(0.6) rotate(90deg)" },
        },
        burst: {
          "0%": { transform: "translate(-50%, -50%) scale(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(90deg)", opacity: "0" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.7) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(20deg)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        "cloud-drift": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(28px)" },
        },
        glide: {
          "0%, 100%": { transform: "translate(0, 0) rotate(-3deg)" },
          "50%": { transform: "translate(-18px, -12px) rotate(3deg)" },
        },
        rise: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.9" },
          "50%": { transform: "translateY(-45vh) translateX(var(--dx, 12px))" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(-90vh) translateX(0)", opacity: "0" },
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
        shimmer: "shimmer 7s linear infinite",
        glint: "glint var(--dur, 4s) ease-in-out infinite",
        burst: "burst 1.4s ease-out forwards",
        bob: "bob 5s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        sway: "sway 6s ease-in-out infinite",
        "cloud-drift": "cloud-drift 14s ease-in-out infinite",
        glide: "glide 8s ease-in-out infinite",
        rise: "rise var(--dur, 14s) linear infinite",
        "float-up": "float-up 1.8s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
