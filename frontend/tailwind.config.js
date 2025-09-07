/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 2px 10px 0 rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.1)',
      },
      maxWidth: {
        'container': '1400px',
        'prose': '65ch',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(240 4% 16%)',
            '--tw-prose-headings': 'hsl(240 10% 10%)',
            '--tw-prose-links': 'hsl(240 5% 34%)',
            '--tw-prose-links-hover': 'hsl(240 10% 20%)',
            '--tw-prose-underline': 'hsl(240 5% 84%)',
            '--tw-prose-underline-hover': 'hsl(240 5% 34%)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}