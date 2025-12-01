import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // "Cyberpunk Chinchorro" Palette
        'rafa-base': '#09090b', // zinc-950 - Deep black for backgrounds
        'rafa-card': '#18181b', // zinc-900 - Card backgrounds
        'imperial': '#FACC15', // yellow-400 - Imperial Beer Yellow (Primary CTA)
        'cyber-cyan': '#22d3ee', // cyan-400 - Neon Blue accent
        'cyber-pink': '#e879f9', // fuchsia-400 - Secondary neon
        'danger': '#dc2626', // red-600 - Destructive actions
        
        // Shadcn/UI compatibility colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 25px rgba(250, 204, 21, 0.8)',
          },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
      },
      // Thumb Zone Optimization (bottom 40% of screen)
      spacing: {
        'thumb-zone': 'calc(100vh - 60vh)',
      },
    },
  },
  plugins: [],
};

export default config;

