import type { Config } from 'tailwindcss';

/**
 * Design tokens mirror the reference's shadcn-style HSL variables
 * (see src/index.css). Colours are referenced as hsl(var(--token) / <alpha>)
 * so opacity modifiers like bg-primary/10 work.
 */
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: token('card'),
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        success: token('success'),
        hairline: token('hairline'),
        panel: { DEFAULT: token('panel'), 2: token('panel-2') },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { lg: 'var(--radius)', xl: '0.75rem', '2xl': '1rem' },
      maxWidth: { wide: '80rem', tight: '72rem' },
      transitionTimingFunction: { 'out-expo': 'cubic-bezier(.22,1,.36,1)' },
      keyframes: {
        ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
