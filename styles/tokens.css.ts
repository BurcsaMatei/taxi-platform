// styles/tokens.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#5561F2',
    secondary: '#78B688',
    text: '#242424',
    background: '#fff',
    headerBg: '#f9f9f9',
    footerBg: '#f1f1f1',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '32px',
  },
  radius: {
    base: '8px',
  },
  font: {
    // ✅ folosim variabilele injectate de next/font
    base: 'var(--font-inter), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    heading: 'var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },
});
