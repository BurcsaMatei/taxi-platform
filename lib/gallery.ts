// lib/gallery.ts
// Citește metadatele imaginilor dintr-un JSON ușor de editat:
// /data/galleryCaptions.json  (alt, title, caption, description)
//
// Necesită în tsconfig: "resolveJsonModule": true (deja ai)

import rawData from "../data/galleryCaptions.json";

export type GalleryJsonItem = {
  src: string;          // ex: "/images/gallery/g-001.jpg"
  alt: string;          // SEO + A11y (obligatoriu)
  title?: string;       // titlul din Lightbox (implicit: alt)
  caption?: string;     // text scurt sub imagine (UI)
  description?: string; // descriere extinsă (A11y / Lightbox)
};

export type GalleryItem = Required<Pick<GalleryJsonItem, "src" | "alt">> &
  Omit<GalleryJsonItem, "src" | "alt"> & {
    id: string; // id stabil (derivat din src)
  };

// Normalizare + fallback-uri simple
function normalizeData(data: GalleryJsonItem[]): GalleryItem[] {
  return data.map((it, idx) => {
    const id =
      it.src?.replace(/^.*\//, "").replace(/\.[a-zA-Z0-9]+$/, "") ||
      `g-${String(idx + 1).padStart(3, "0")}`;

    return {
      id,
      src: it.src,
      alt: it.alt,
      title: it.title ?? it.alt,
      caption: it.caption,
      description: it.description ?? it.caption ?? "",
    };
  });
}

// Date normalizate + count
export const GALLERY_DATA: GalleryItem[] = normalizeData(rawData as GalleryJsonItem[]);
export const GALLERY_COUNT = GALLERY_DATA.length;

/**
 * Returnează primele `count` elemente (implicit toate).
 * Compatibil cu CardGrid (are src, alt, caption).
 */
export function buildGalleryItems(count: number = GALLERY_COUNT): GalleryItem[] {
  return GALLERY_DATA.slice(0, count);
}

/**
 * Helper pentru Lightbox: transformă items în slides (title/description incluse).
 * Poți apela direct `getGallerySlides()` în pagină dacă vrei.
 */
export function getGallerySlides(items: GalleryItem[] = GALLERY_DATA) {
  return items.map((i) => ({
    src: i.src,
    alt: i.alt,
    title: i.title ?? i.alt,
    description: i.description ?? i.caption ?? "",
  }));
}

/**
 * (Opțional) caută după id (ex: "g-001")
 */
export function findGalleryItem(id: string): GalleryItem | undefined {
  return GALLERY_DATA.find((i) => i.id === id);
}
