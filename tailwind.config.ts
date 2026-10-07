import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          foreground: "var(--accent-foreground)",
        },
        emerald: {
          glow: "var(--emerald)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(245, 158, 11, 0.45)",
        "glow-sm": "0 0 24px -6px rgba(245, 158, 11, 0.35)",
        card: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 20px 48px -12px rgba(0, 0, 0, 0.65)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(67, 56, 202, 0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(245, 158, 11, 0.12), transparent 50%), radial-gradient(ellipse 40% 30% at 10% 60%, rgba(16, 185, 129, 0.08), transparent 50%)",
        "section-fade":
          "linear-gradient(180deg, transparent, rgba(245, 158, 11, 0.08), transparent)",
        "divider-glow":
          "linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), rgba(99, 102, 241, 0.3), transparent)",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-16deg)" },
          "100%": { transform: "translateX(220%) skewX(-16deg)" },
        },
        "shine-loop": {
          "0%": { transform: "translateX(-140%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
        "shine-soft": {
          "0%": { transform: "translateX(-130%) skewX(-10deg)", opacity: "0" },
          "18%": { opacity: "0.9" },
          "55%": { opacity: "0.55" },
          "100%": { transform: "translateX(210%) skewX(-10deg)", opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.04)", opacity: "0.9" },
        },
        "chat-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 18px -8px rgba(16, 185, 129, 0.35)",
          },
          "50%": {
            boxShadow: "0 0 24px -6px rgba(16, 185, 129, 0.45)",
          },
        },
        "chat-pulse-amber": {
          "0%, 100%": {
            boxShadow: "0 0 18px -8px rgba(245, 158, 11, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 24px -6px rgba(245, 158, 11, 0.4)",
          },
        },
        "chat-pulse-outline": {
          "0%, 100%": {
            boxShadow: "0 0 14px -10px rgba(245, 158, 11, 0.25)",
          },
          "50%": {
            boxShadow: "0 0 18px -8px rgba(245, 158, 11, 0.35)",
          },
        },
        "fgis-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 0 rgba(245, 158, 11, 0.25), 0 0 22px -6px rgba(251, 191, 36, 0.4)",
            filter: "brightness(1)",
          },
          "50%": {
            boxShadow:
              "0 0 0 6px rgba(245, 158, 11, 0), 0 0 28px -4px rgba(252, 211, 77, 0.55)",
            filter: "brightness(1.05)",
          },
        },
        "promo-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "fgis-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        shine: "shine 0.85s ease-out",
        "shine-loop": "shine-loop 4.2s ease-in-out infinite",
        "shine-soft": "shine-soft 4.6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3.6s ease-in-out infinite",
        "chat-pulse": "chat-pulse 3.8s ease-in-out infinite",
        "chat-pulse-amber": "chat-pulse-amber 3.8s ease-in-out infinite",
        "chat-pulse-outline": "chat-pulse-outline 3.8s ease-in-out infinite",
        "fgis-glow": "fgis-glow 3.2s ease-in-out infinite",
        "promo-glow": "promo-glow 4.5s ease-in-out infinite",
        "fgis-gradient": "fgis-gradient 5s ease infinite",
        "fgis-attention":
          "fgis-gradient 5s ease infinite, fgis-glow 3.2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
