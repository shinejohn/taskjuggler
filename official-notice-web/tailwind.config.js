/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366F1', // Indigo-500 for Official Notice brand
                    hover: '#4F46E5',
                    light: 'rgba(99, 102, 241, 0.1)',
                },
                'bg-primary': 'var(--color-bg-primary)',
                'bg-secondary': 'var(--color-bg-secondary)',
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                border: 'var(--color-border)',
            },
            spacing: {
                '1': 'var(--space-1)',
                '2': 'var(--space-2)',
                '3': 'var(--space-3)',
                '4': 'var(--space-4)',
                '6': 'var(--space-6)',
                '8': 'var(--space-8)',
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
            },
            boxShadow: {
                '1': 'var(--shadow-1)',
                '2': 'var(--shadow-2)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            transitionTimingFunction: {
                'out-expo': 'var(--ease-out-expo)',
                'out': 'var(--ease-out)',
                'spring': 'var(--ease-spring)',
            },
            transitionDuration: {
                'micro': 'var(--duration-micro)',
                'fast': 'var(--duration-fast)',
                'normal': 'var(--duration-normal)',
            },
        },
    },
    plugins: [],
}
