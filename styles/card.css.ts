// styles/card.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

// Card wrapper
export const card = style({
  background: vars.color.background,
  borderRadius: vars.radius.base,
  boxShadow: '0 8px 28px rgba(50,60,90,0.13)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch', // 🔹 întinde imaginea pe toată lățimea
  transition: 'transform 0.18s cubic-bezier(.5,1.5,.5,1), box-shadow .18s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.035)',
      boxShadow: '0 16px 40px rgba(50,60,90,0.18)',
    },
  },
  maxWidth: 440,
  margin: '0 auto',
});

// Alias pentru compatibilitate
export const cardClass = card;

// Caption / conținut
export const cardCaptionClass = style({
  width: '100%',
  padding: vars.spacing.lg, // 🔹 padding doar pe caption
  color: vars.color.text,
  textAlign: 'center',
  fontWeight: 500,
  fontFamily: vars.font.base,
});
