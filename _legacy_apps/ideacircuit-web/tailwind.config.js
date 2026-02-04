/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#007AFF',
          hover: '#0056B3',
          light: 'rgba(0, 122, 255, 0.1)',
        },
        secondary: {
          DEFAULT: '#5856D6',
        },
        success: '#34C759',
        warning: '#FF9500',
        destructive: '#FF3B30',
        
        // Design System Colors (CSS Variables)
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        
        // Status Colors
        'status-pending': 'var(--color-status-pending)',
        'status-accepted': 'var(--color-status-accepted)',
        'status-in-progress': 'var(--color-status-in-progress)',
        'status-completed': 'var(--color-status-completed)',
        'status-cancelled': 'var(--color-status-cancelled)',
      },
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
      },
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        '0': 'var(--shadow-0)',
        '1': 'var(--shadow-1)',
        '2': 'var(--shadow-2)',
        '3': 'var(--shadow-3)',
        '4': 'var(--shadow-4)',
        '5': 'var(--shadow-5)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-large': 'var(--font-display-large)',
        'display-medium': 'var(--font-display-medium)',
        'display-small': 'var(--font-display-small)',
        'headline': 'var(--font-headline)',
        'title-large': 'var(--font-title-large)',
        'title-medium': 'var(--font-title-medium)',
        'title-small': 'var(--font-title-small)',
        'body-large': 'var(--font-body-large)',
        'body-medium': 'var(--font-body-medium)',
        'body-small': 'var(--font-body-small)',
        'label': 'var(--font-label)',
        'caption': 'var(--font-caption)',
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        'spring': 'var(--ease-spring)',
        'micro': 'var(--ease-micro)',
      },
      transitionDuration: {
        'micro': 'var(--duration-micro)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
