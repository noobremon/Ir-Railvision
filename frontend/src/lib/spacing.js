/**
 * Consistent spacing scale for the application
 * Based on a 4px base unit
 */

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

/**
 * Consistent container padding
 */
export const container = {
  padding: {
    sm: spacing[4],   // 16px
    md: spacing[6],   // 24px
    lg: spacing[8],   // 32px
    xl: spacing[12],  // 48px
  },
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
};

/**
 * Common layout utilities
 */
export const layout = {
  // Standard page layout
  page: 'w-full min-h-screen flex flex-col',
  
  // Content container with max width and responsive padding
  container: `
    w-full mx-auto
    px-4 sm:px-6 lg:px-8
    max-w-7xl
  `,
  
  // Standard section spacing
  section: 'py-12 md:py-16 lg:py-20',
  
  // Grid layouts
  grid: {
    // Standard responsive grid
    standard: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
    
    // Tight grid for dense layouts
    tight: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3',
    
    // Auto-fit grid for flexible layouts
    autoFit: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 md:gap-6',
  },
};

/**
 * Card styles
 */
export const card = {
  base: 'rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-200',
  hover: 'hover:shadow-card-hover hover:-translate-y-0.5',
  padding: 'p-6',
  header: 'flex flex-col space-y-2',
  title: 'text-lg font-semibold leading-6 text-gray-900',
  description: 'text-sm text-gray-500',
  content: 'mt-4 space-y-4',
  footer: 'mt-6 pt-4 border-t border-gray-100',
};

/**
 * Button styles
 */
export const button = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  sizes: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  },
  variants: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
};

/**
 * Form styles
 */
export const form = {
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  input: {
    base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    error: 'border-destructive focus-visible:ring-destructive/50',
  },
  error: 'mt-1 text-sm text-destructive',
  description: 'text-sm text-muted-foreground',
  fieldset: 'space-y-2',
};

export default {
  spacing,
  container,
  layout,
  card,
  button,
  form,
};
