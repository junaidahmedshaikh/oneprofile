/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        oneprofile: {
          950: "var(--color-nx-bg)",
          900: "var(--color-nx-surface)",
          800: "var(--color-nx-surface-2)",
          700: "var(--color-nx-border)",
          600: "var(--color-nx-muted)",
          500: "var(--color-nx-text)",
          400: "var(--color-nx-text-2)",
          300: "var(--color-nx-line)",
          200: "var(--color-nx-line-soft)",
          100: "var(--color-nx-surface-soft)",
        },
        brand: {
          500: "#4F8CFF",
          600: "#3D76F0",
          400: "#73A6FF",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(2, 8, 23, 0.35)",
        glow: "0 0 0 1px rgba(79, 140, 255, 0.18), 0 12px 40px rgba(79, 140, 255, 0.12)",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
        display: ["Sora", "Manrope", "ui-sans-serif"],
      },
      fontSize: {
        "3xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "2xs": ["0.6875rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": [
          "clamp(1.75rem, 2.2vw + 1.15rem, 2.4rem)",
          { lineHeight: "1.1" },
        ],
        "4xl": ["clamp(2.2rem, 3vw + 1.2rem, 2.8rem)", { lineHeight: "1.05" }],
        "5xl": ["clamp(2.7rem, 4.2vw + 1.5rem, 4rem)", { lineHeight: "1" }],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 240ms ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
