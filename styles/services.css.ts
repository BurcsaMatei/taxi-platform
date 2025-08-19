// styles/services.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from "..//styles/tokens.css"

// Fundal implicit pagină (dacă vrei să aplici pe <main> global, lasă așa)
export const pageWrap = style({
  backgroundColor: vars.color.background,
  color: vars.color.text,
});

// Padding secțiuni (folosit în Hero + Preview)
export const sectionPad = style({
  paddingTop: 'clamp(32px, 5vw, 64px)',
  paddingBottom: 'clamp(32px, 5vw, 64px)',
});

// Header secțiune
export const heroHeader = style({
  textAlign: 'center',
  marginBottom: 'clamp(24px, 4vw, 48px)',
});

export const eyebrow = style({
  display: 'inline-block',
  fontSize: 'clamp(12px, 1.2vw, 14px)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#666',
});

export const heroTitle = style({
  marginTop: '8px',
  fontWeight: 700,
  fontSize: 'clamp(28px, 3.6vw, 44px)', // clamp heading
  lineHeight: 1.1,
  fontFamily: vars.font.heading,
});

export const h2 = style({
  fontWeight: 700,
  fontSize: 'clamp(22px, 2.8vw, 32px)',
  lineHeight: 1.15,
  marginBottom: '8px',
  fontFamily: vars.font.heading,
});

export const heroSubtitle = style({
  marginTop: '10px',
  fontSize: 'clamp(14px, 1.6vw, 18px)',
  color: '#666',
});

// Grid 12 (desktop) / 6 (mobil)
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', // mobil: 6
  gap: vars.spacing.lg,
  '@media': {
    'screen and (min-width: 960px)': {
      gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', // desktop: 12
    },
  },
});

// Card — Hero
export const card = style({
  gridColumn: 'span 6', // mobil: 1 pe rând
  border: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  borderRadius: vars.radius.base,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  padding: vars.spacing.lg,
  transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      borderColor: vars.color.secondary, // verde (#78B688)
    },
  },
  '@media': {
    'screen and (min-width: 960px)': {
      gridColumn: 'span 3', // 4 pe rând
    },
  },
});

export const cardIconPlaceholder = style({
  width: 48,
  height: 48,
  marginBottom: vars.spacing.md,
  borderRadius: 12,
  background: 'linear-gradient(145deg, rgba(0,0,0,0.04), rgba(0,0,0,0.06))',
});
export const cardIconWrap = style({
  width: 48,
  height: 48,
  marginBottom: vars.spacing.md,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const cardIconWrapSmall = style({
  width: 32,
  height: 32,
  marginBottom: vars.spacing.sm,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});
export const cardTitle = style({
  fontWeight: 700,
  fontSize: 'clamp(18px, 2.2vw, 22px)',
  lineHeight: 1.2,
  marginBottom: '6px',
  fontFamily: vars.font.heading,
});

export const cardDesc = style({
  color: '#666',
  fontSize: 'clamp(14px, 1.6vw, 16px)',
  lineHeight: 1.5,
  marginBottom: vars.spacing.md,
});

export const cardLink = style({
  display: 'inline-block',
  fontWeight: 600,
  fontSize: 14,
  color: vars.color.secondary,
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'border-color .15s ease',
  selectors: {
    '&:hover': {
      borderBottomColor: vars.color.secondary,
    },
  },
});

// Preview (homepage)
export const previewHeader = style({
  textAlign: 'center',
  marginBottom: 'clamp(18px, 3vw, 36px)',
});

export const previewSubtitle = style({
  color: '#666',
  fontSize: 'clamp(14px, 1.6vw, 16px)',
});

export const cardSmall = style({
  gridColumn: 'span 6', // mobil
  border: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  borderRadius: vars.radius.base,
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  padding: vars.spacing.md,
  transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      borderColor: vars.color.secondary,
    },
  },
  '@media': {
    'screen and (min-width: 960px)': {
      gridColumn: 'span 3', // 4 pe rând
    },
  },
});

export const cardTitleSmall = style({
  fontWeight: 700,
  fontSize: 'clamp(16px, 2vw, 18px)',
  marginBottom: 6,
  fontFamily: vars.font.heading,
});

export const cardDescSmall = style({
  color: '#666',
  fontSize: 'clamp(13px, 1.4vw, 15px)',
});
