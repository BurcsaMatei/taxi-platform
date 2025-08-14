import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

// Card wrapper (folosit de FormContact ca `card`)
export const card = style({
  background: vars.color.background,
  borderRadius: vars.radius.base,
  boxShadow: '0 8px 28px rgba(50,60,90,0.13)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.18s cubic-bezier(.5,1.5,.5,1), box-shadow .18s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.035)',
      boxShadow: '0 16px 40px rgba(50,60,90,0.18)',
    },
  },
  maxWidth: 440,
  margin: '0 auto',
  padding: vars.spacing.lg,
});

// Alias pentru compatibilitate cu Card.tsx (importă `cardClass`)
export const cardClass = card;

// Imagine din card
export const cardImageClass = style({
  width: '100%',
  display: 'block',
  aspectRatio: '4 / 3',
  objectFit: 'cover',
  background: '#e7e9f1',
  borderTopLeftRadius: vars.radius.base,
  borderTopRightRadius: vars.radius.base,
});

// Caption / conținut
export const cardCaptionClass = style({
  width: '100%',
  padding: vars.spacing.md,
  color: vars.color.text,
  textAlign: 'center',
  fontWeight: 500,
  fontFamily: vars.font.base,
});
