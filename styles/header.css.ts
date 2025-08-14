// styles/header.css.ts
import { style, createVar, globalStyle } from '@vanilla-extract/css';
import { vars } from './tokens.css';

// =======================
// Variabile header
// =======================
export const headerHeightVar = createVar();

export const headerVarsClass = style({
  vars: { [headerHeightVar]: '64px' }, // desktop
  '@media': {
    'screen and (max-width: 900px)': {
      vars: { [headerHeightVar]: '56px' }, // mobil
    },
  },
});

// =======================
// Layout header
// =======================
export const headerClass = style({
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  background: vars.color.headerBg,
  zIndex: 3000,
  isolation: 'isolate',
  boxShadow: '0 6px 28px -8px rgba(50,60,90,0.16)',
  borderBottom: `1px solid ${vars.color.primary}`,
});

export const headerInnerClass = style({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: headerHeightVar,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  position: 'relative',
});

// =======================
// Logo box
// =======================
export const logoBoxClass = style({
  height: headerHeightVar,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  paddingTop: '8px',
  paddingBottom: '8px',
  maxWidth: '240px',
  // ✂️ elimină `color: vars.color.text`
});

// păstrează DOAR dimensiunile pentru <svg>
globalStyle(`${logoBoxClass} svg`, {
  display: 'block',
  height: '100%',
  width: 'auto',
});

// =======================
// Nav desktop
// =======================
export const navClass = style({
  display: 'flex',
  gap: vars.spacing.md,
  alignItems: 'center',
  '@media': { 'screen and (max-width: 900px)': { display: 'none' } },
});

export const navLinkClass = style({
  position: 'relative',
  color: vars.color.text,
  fontWeight: 500,
  fontSize: '1.05rem',
  textDecoration: 'none',
  transition: 'color 0.2s',
  ':hover': { color: vars.color.primary },
  selectors: {
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-3px',
      height: '2px',
      width: 0,
      background: vars.color.primary,
      transition: 'width 0.22s cubic-bezier(.6,.18,.34,1.35)',
    },
    '&:hover:after': { width: '100%' },
  },
});

// =======================
// Mobil: hamburger + nav + overlay
// =======================
export const hamburgerClass = style({
  display: 'none',
  background: 'none',
  border: 'none',
  fontSize: '2.3rem',
  cursor: 'pointer',
  zIndex: 3300,
  '@media': { 'screen and (max-width: 900px)': { display: 'block' } },
});

export const mobileNavClass = style({
  display: 'none',
  flexDirection: 'column',
  gap: vars.spacing.md,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  background: vars.color.headerBg,
  padding: `calc(${headerHeightVar} + 2vw) 8vw 4vw 8vw`,
  border: 'none',
  borderRadius: 0,
  boxShadow: '0 12px 32px 0 rgba(50,60,90,0.12)', // <- FIX: ghilimele corecte
  zIndex: 3200,
  '@media': { 'screen and (max-width: 900px)': { display: 'flex' } },
});

export const mobileOverlayClass = style({
  display: 'none',
  position: 'fixed',
  zIndex: 3100,
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(44,52,66,0.18)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: 'opacity 0.2s',
  '@media': { 'screen and (max-width: 900px)': { display: 'block' } },
});

// =======================
// Socials (nav mobil)
// =======================
export const mobileNavExtrasClass = style({
  marginTop: '2rem',
  paddingTop: '1.3rem',
  borderTop: '1px solid #e4e8ef',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.15rem',
  alignItems: 'flex-start',
});

export const socialIconsWrapperClass = style({
  display: 'flex',
  gap: '14px',
  marginTop: vars.spacing.md,
});

export const socialIconClass = style({
  color: vars.color.secondary,
  transition: 'color 0.2s',
  verticalAlign: 'middle',
  display: 'inline-block',
  selectors: { '&:hover': { color: vars.color.primary } },
});
