import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Shadcn UI tokens mapped to Stitch palette
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          container: '#172747',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          container: '#FFD7CA',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Exact Google Stitch "Warm Architectural Precision" Tokens
        stitch: {
          navy: '#172747',
          'navy-dark': '#011232',
          espresso: '#493027',
          'espresso-dark': '#302019',
          cream: '#F7F3EC',
          beige: '#E9DDCA',
          border: '#E8E0D6',
          basalt: '#292522',
          slate: '#827B73',
          pine: '#2D5A43',
          gold: '#B68B55',
          rust: '#9E3A3A',
        },

        // Material 3 / Stitch Direct Tokens
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FBF2ED',
        'surface-container': '#F5ECE7',
        'surface-container-high': '#EFE6E1',
        'surface-container-highest': '#EAE1DC',
        'on-surface': '#1F1B18',
        'on-surface-variant': '#45464E',
        'outline-border': '#E8E0D6',
        'tertiary-fixed': '#FFDDB7',
        'tertiary-fixed-dim': '#EEBE83',
        'on-tertiary-container': '#B18751',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '10': '10px',
        '12': '12px',
        '14': '14px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(73, 48, 39, 0.04), 0 1px 2px -1px rgba(73, 48, 39, 0.04)',
        'warm-md': '0 4px 12px -2px rgba(73, 48, 39, 0.08), 0 2px 6px -1px rgba(73, 48, 39, 0.04)',
        'warm-lg': '0 20px 25px -5px rgba(48, 32, 25, 0.12), 0 8px 10px -6px rgba(48, 32, 25, 0.06)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
