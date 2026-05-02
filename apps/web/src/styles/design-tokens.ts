export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    main: '#4f46e5',
  },
  emerald: {
    main: '#10b981',
  },
  amber: {
    main: '#f59e0b',
  },
  rose: {
    main: '#ef4444',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
};

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
};

export const shadows = {
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px -5px rgb(79 70 229 / 0.3)',
};

export const motion = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '36px',
  },
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const statusColors: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#8b5cf6',
  qualified: '#10b981',
  negotiation: '#f59e0b',
  converted: '#059669',
  not_interested: '#6b7280',
  lost: '#ef4444',
};