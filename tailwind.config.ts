
import type { Config } from "tailwindcss";

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
      fontFamily: {
        'ms-sans': ['"MS Sans Serif"', 'Arial', 'sans-serif'],
        'pixel': ['"VT323"', '"Press Start 2P"', 'monospace'], 
        'baseball': ['"Permanent Marker"', 'cursive'],
      },
      colors: {
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
        baseball: {
          cream: "#F5F0E1",
          green: "#2C5530",
          brown: "#C19A6B",
          red: "#D13438",
          white: "#FFFFFF",
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
        "spin-baseball": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "loading-progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-baseball": "spin-baseball 3s linear infinite",
        "fade-in": "fade-in 0.5s ease-in-out",
        "blink": "blink 1s step-start infinite",
        "loading-progress": "loading-progress 5s ease-in-out forwards",
      },
      backgroundImage: {
        'baseball-stitch': "url('/public/lovable-uploads/bbcc2ee4-3e6f-4325-98a5-f82b68534c42.png')",
        'baseball-field': "url('/public/lovable-uploads/f801abd2-c7d0-4e67-a232-1b270f1268d2.png')",
        'retro-loading': "url('/public/lovable-uploads/bc7b7cf1-8518-4315-96fc-4d79ffd63863.png')",
        'baseball-pattern': "url('/public/lovable-uploads/2b9294dc-b5c2-4ab7-b509-0adc23f1e27a.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
