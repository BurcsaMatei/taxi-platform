import { styleVariants } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const buttonClass = styleVariants({
  primary: {
    background: vars.color.secondary,
    color: '#fff',
    padding: `${vars.spacing.sm} ${vars.spacing.lg}`,
    fontSize: '1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: vars.radius.base,
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(30,80,60,0.06)',
    transition: 'background 0.2s, box-shadow 0.2s',
    ':hover': {
      background: vars.color.primary,
      boxShadow: '0 4px 20px rgba(40,80,140,0.12)',
    },
    ':focus': {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: 2,
    }
  },
  secondary: {
    background: 'transparent',
    color: vars.color.primary,
    border: `2px solid ${vars.color.primary}`,
    padding: `${vars.spacing.sm} ${vars.spacing.lg}`,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: vars.radius.base,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    ':hover': {
      background: vars.color.primary,
      color: '#fff',
    },
    ':focus': {
      outline: `2px solid ${vars.color.secondary}`,
      outlineOffset: 2,
    }
  }
});
