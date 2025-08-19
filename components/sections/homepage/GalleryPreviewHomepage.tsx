import { useMemo, useRef } from "react";
import Link from "next/link";
import Img from "../../ui/Img";
import { buildGalleryItems } from "../../../lib/gallery";

import {
  gpSection, gpTrack, gpItem, gpImage, gpCaption,
  gpHeader, gpCtaRow, gpNavBtnLeft, gpNavBtnRight,
} from "../../../styles/homepage/galleryPreviewHomepage.css";

const PREVIEW_COUNT = 8;
const PREVIEW_SIZES =
  "(max-width: 600px) 85vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw";

export default function GalleryPreviewHomepage() {
  const items = useMemo(() => buildGalleryItems(PREVIEW_COUNT), []);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackId = "gp-track";

  const scrollByAmount = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className={gpSection} aria-label="Gallery preview">
      <div className={gpHeader}>
        <h2 id="gp-title">Galerie — preview</h2>
        <Link href="/galerie" aria-labelledby="gp-title">Vezi toată galeria</Link>
      </div>

      {/* Butoane nav (opționale; pe mobil ai swipe nativ) */}
      <button
        type="button"
        aria-label="Derulează stânga"
        className={gpNavBtnLeft}
        onClick={() => scrollByAmount(-1)}
        aria-controls={trackId}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Derulează dreapta"
        className={gpNavBtnRight}
        onClick={() => scrollByAmount(1)}
        aria-controls={trackId}
      >
        ›
      </button>

      <div
        id={trackId}
        ref={scrollerRef}
        className={gpTrack}
        role="list"
        aria-labelledby="gp-title"
        tabIndex={0} // focusabil pentru scroll cu tastatura
      >
        {items.map((it, idx) => (
          <Link
            key={(it as any).id ?? `${it.src}-${idx}`}
            href="/galerie"
            className={gpItem}
            aria-label={`Deschide ${it.alt}`}
            role="listitem"
          >
            <div className={gpImage}>
              <Img
                src={it.src}
                alt={it.alt}
                variant="card"
                fill
                cover
                sizes={PREVIEW_SIZES}
                priority={idx === 0} // primul poate fi LCP/above-the-fold
                quality={75}
              />
            </div>
            <div className={gpCaption}>{it.alt}</div>
          </Link>
        ))}
      </div>

      <div className={gpCtaRow}>
        <Link href="/galerie">Vezi toate cele {items.length} imagini</Link>
      </div>
    </section>
  );
}
