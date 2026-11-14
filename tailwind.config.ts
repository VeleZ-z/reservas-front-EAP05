import type { Config } from "tailwindcss";

/**
 * Mapea los ALIAS TOKENS definidos en app/globals.css a utilidades Tailwind.
 * Los componentes NUNCA deben referenciar valores crudos (regla de design-token):
 * siempre usan estos alias semánticos.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alias semánticos (Tier 2)
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          subtle: "var(--color-surface-subtle)",
          muted: "var(--color-surface-muted)",
          inverse: "var(--color-surface-inverse)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          subtle: "var(--color-ink-subtle)",
          inverse: "var(--color-ink-inverse)",
          brand: "var(--color-ink-brand)",
        },
        line: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
          brand: "var(--color-border-brand)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          soft: "var(--color-primary-soft)",
          ring: "var(--color-primary-ring)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          text: "var(--color-accent-text)",
          soft: "var(--color-accent-soft)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          text: "var(--color-info-text)",
          soft: "var(--color-info-soft)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          text: "var(--color-warning-text)",
          soft: "var(--color-warning-soft)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          text: "var(--color-error-text)",
          soft: "var(--color-error-soft)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          text: "var(--color-success-text)",
          soft: "var(--color-success-soft)",
        },

        // Global tokens (Tier 1) — expuestos para uso decorativo puntual
        olive: {
          50: "var(--palette-olive-50)", 100: "var(--palette-olive-100)",
          200: "var(--palette-olive-200)", 300: "var(--palette-olive-300)",
          400: "var(--palette-olive-400)", 500: "var(--palette-olive-500)",
          600: "var(--palette-olive-600)", 700: "var(--palette-olive-700)",
          800: "var(--palette-olive-800)", 900: "var(--palette-olive-900)",
          950: "var(--palette-olive-950)",
        },
        sage: {
          50: "var(--palette-sage-50)", 100: "var(--palette-sage-100)",
          200: "var(--palette-sage-200)", 300: "var(--palette-sage-300)",
          400: "var(--palette-sage-400)", 500: "var(--palette-sage-500)",
          600: "var(--palette-sage-600)", 700: "var(--palette-sage-700)",
          800: "var(--palette-sage-800)", 900: "var(--palette-sage-900)",
          950: "var(--palette-sage-950)",
        },
        turquoise: {
          50: "var(--palette-turquoise-50)", 100: "var(--palette-turquoise-100)",
          200: "var(--palette-turquoise-200)", 300: "var(--palette-turquoise-300)",
          400: "var(--palette-turquoise-400)", 500: "var(--palette-turquoise-500)",
          600: "var(--palette-turquoise-600)", 700: "var(--palette-turquoise-700)",
          800: "var(--palette-turquoise-800)", 900: "var(--palette-turquoise-900)",
          950: "var(--palette-turquoise-950)",
        },
        moss: {
          50: "var(--palette-moss-50)", 100: "var(--palette-moss-100)",
          200: "var(--palette-moss-200)", 300: "var(--palette-moss-300)",
          400: "var(--palette-moss-400)", 500: "var(--palette-moss-500)",
          600: "var(--palette-moss-600)", 700: "var(--palette-moss-700)",
          800: "var(--palette-moss-800)", 900: "var(--palette-moss-900)",
          950: "var(--palette-moss-950)",
        },
        bronze: {
          50: "var(--palette-bronze-50)", 100: "var(--palette-bronze-100)",
          200: "var(--palette-bronze-200)", 300: "var(--palette-bronze-300)",
          400: "var(--palette-bronze-400)", 500: "var(--palette-bronze-500)",
          600: "var(--palette-bronze-600)", 700: "var(--palette-bronze-700)",
          800: "var(--palette-bronze-800)", 900: "var(--palette-bronze-900)",
          950: "var(--palette-bronze-950)",
        },
        neutral: {
          0: "var(--palette-neutral-0)", 50: "var(--palette-neutral-50)",
          100: "var(--palette-neutral-100)", 200: "var(--palette-neutral-200)",
          300: "var(--palette-neutral-300)", 400: "var(--palette-neutral-400)",
          500: "var(--palette-neutral-500)", 600: "var(--palette-neutral-600)",
          700: "var(--palette-neutral-700)", 800: "var(--palette-neutral-800)",
          900: "var(--palette-neutral-900)", 950: "var(--palette-neutral-950)",
        },
      },

      // Escala tipográfica modular (typography-scale skill)
      fontSize: {
        "caption-uppercase": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "600" }],
        caption: ["0.8125rem", { lineHeight: "1.4" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "title-sm": ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        "title-md": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "title-lg": ["1.375rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.5rem", { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.015em" }],
        "heading-md": ["1.875rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        "heading-lg": ["2.25rem", { lineHeight: "1.15", fontWeight: "600", letterSpacing: "-0.02em" }],
        display: ["3rem", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.03em" }],
      },

      // Radios
      borderRadius: {
        xs: "var(--radius-xs)", sm: "var(--radius-sm)", md: "var(--radius-md)",
        lg: "var(--radius-lg)", xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },

      // Elevación
      boxShadow: {
        xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)",
        lg: "var(--shadow-lg)", ring: "var(--shadow-ring)",
      },

      // Movimiento
      transitionDuration: { fast: "120ms", base: "180ms", slow: "280ms" },
      transitionTimingFunction: { out: "var(--ease-out)" },

      maxWidth: { layout: "var(--layout-max)" },

      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 280ms var(--ease-out)",
        "slide-in-left": "slide-in-left 280ms var(--ease-out)",
      },
    },
  },
  plugins: [],
};

export default config;
