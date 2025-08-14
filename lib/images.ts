// lib/images.ts
// Rol: un singur loc unde DEFINIM căile către imaginile servite din /public.
// NOTĂ: Logo-ul NU mai e în /public; pentru logo folosește componenta LogoInline (SVGR).

export const IMAGES = {
  hero: '/images/current/hero.jpg',
  card: '/images/current/card.jpg',
  contactMap: '/images/current/contact-map.jpg',
  og: '/images/og.jpg',          // pentru Open Graph (share)
  favicon: '/favicon.ico',       // favicon trebuie să rămână în /public
  heroServices: '/images/current/hero-services.jpg',
  heroGallery: '/images/current/hero-gallery.jpg',
  heroContact: '/images/current/hero-contact.jpg',
} as const;

export type ImageKey = keyof typeof IMAGES;

// (OPȚIONAL) Prefix pentru CDN: setezi în .env => NEXT_PUBLIC_ASSET_BASE="https://cdn.exemplu.com"
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? '';

/**
 * Returnează URL-ul complet pentru o cheie din IMAGES.
 * Dacă NEXT_PUBLIC_ASSET_BASE e setat, prefixează automat.
 */
export function resolveImage(key: ImageKey) {
  return `${BASE}${IMAGES[key]}`;
}
