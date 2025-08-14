import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const breadcrumbsWrapperClass = style({
  display: 'flex',
  justifyContent: 'center',
  margin: '18px 0',
});
export const breadcrumbsListClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  padding: 0,
  margin: 0,
  listStyle: 'none',
});
export const breadcrumbLinkClass = style({
  color: '#333',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 'rem',
  transition: 'color 0.18s',
  ':hover': {
    color: vars.color.secondary,
  },
});
export const breadcrumbCurrentClass = style({
  color: '#222',
  fontWeight: 600,
});
