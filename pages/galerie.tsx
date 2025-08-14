// pages/galerie.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import HeroSectionGallery from "../components/sections/gallery/HeroSectionGallery";
import IntroSectionGallery from "../components/sections/gallery/IntroSectionGallery";
import Separator from "../components/Separator";
import ShortTextGallery from "../components/sections/gallery/ShortTextGallery";
import CardGrid from "../components/CardGrid";
import { buildGalleryItems, GALLERY_COUNT } from "../lib/gallery";
import Seo from "@/components/Seo";

import {
  breadcrumbsWrapperClass,
  breadcrumbsListClass,
  breadcrumbLinkClass,
  breadcrumbCurrentClass,
} from "../styles/breadcrumbs.css";

// ⚡ Lightbox (core) se încarcă doar când e randat (open=true)
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

const PAGE_SIZE = 12;

export default function GaleriePage() {
  // lista completă pe baza convenției /public/images/gallery/g-XXX.jpg
  const cards = useMemo(() => buildGalleryItems(GALLERY_COUNT), []);

  // slides pentru Lightbox, cu titlu/descriere
  const slides = useMemo(
    () =>
      cards.map((c) => ({
        src: c.src,
        alt: c.alt,
        title: c.alt,            // titlu = alt (poți schimba)
        description: c.caption ?? "", // descriere opțională
      })),
    [cards]
  );

  // load more state
  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleCards = cards.slice(0, visible);
  const canLoadMore = visible < cards.length;

  // lightbox state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // 👉 captions plugin, încărcat LA NEVOIE (când se deschide lightbox)
  const [captionsPlugin, setCaptionsPlugin] = useState<any | null>(null);
  useEffect(() => {
    if (!open || captionsPlugin) return;
    import("yet-another-react-lightbox/plugins/captions").then((m) =>
      setCaptionsPlugin(() => m.default)
    );
  }, [open, captionsPlugin]);

  // IntersectionObserver (auto load more)
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false); // rate-limit ca să evităm multiple trigger-e
  const [ioSupported, setIoSupported] = useState(false);

  useEffect(() => {
    setIoSupported(typeof window !== "undefined" && "IntersectionObserver" in window);
  }, []);

  useEffect(() => {
    if (!ioSupported || !sentinelRef.current) return;

    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        if (!canLoadMore) return;
        if (lockRef.current) return;

        lockRef.current = true;
        setVisible((v) => Math.min(v + PAGE_SIZE, cards.length));
        // mic debounce ca să nu sară prea repede prin loturi
        setTimeout(() => {
          lockRef.current = false;
        }, 350);
      },
      {
        root: null,
        rootMargin: "400px 0px", // începe încărcarea puțin înainte să ajungi jos
        threshold: 0.01,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ioSupported, canLoadMore, cards.length]);

  return (
    <>
      <Head>
        <title>Galerie — KonceptID</title>
        <meta name="description" content="Galerie de proiecte KonceptID" />
        {/* JSON-LD breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Acasă", item: "https://konceptid.com/" },
                { "@type": "ListItem", position: 2, name: "Galerie", item: "https://konceptid.com/galerie" },
              ],
            }),
          }}
        />
      </Head>

      {/* Breadcrumb vizual – deasupra Hero */}
      <nav aria-label="breadcrumb" className={breadcrumbsWrapperClass}>
        <ol className={breadcrumbsListClass}>
          <li><a href="/" className={breadcrumbLinkClass}>Acasă</a></li>
          <li style={{ margin: "0 7px", color: "#b5b5b5" }}>/</li>
          <li className={breadcrumbCurrentClass} aria-current="page">Galerie</li>
        </ol>
      </nav>

      <HeroSectionGallery />
      <IntroSectionGallery />
      <Separator />
      <ShortTextGallery />
      < Seo title="Galerie"
  description="Galerie de proiecte KonceptID."
  image="/images/og-gallery.jpg"
  url={(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/galerie"}
/> 

      {/* Grid — click pe card deschide lightbox */}
      <CardGrid
        cards={visibleCards}
        aboveTheFold={false}
        onItemClick={(i) => {
          setIndex(i); // i e index în subset (0..visible-1)
          setOpen(true);
        }}
      />

      {/* Sentinel pentru încărcare automată (invizibil) */}
      {canLoadMore && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{ height: 1, width: "100%", visibility: "hidden" }}
        />
      )}

      {/* Fallback pentru browsere fără IntersectionObserver */}
      {!ioSupported && canLoadMore && (
        <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 8px" }}>
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, cards.length))}
            style={{
              appearance: "none",
              border: "1px solid #5561F2",
              background: "#5561F2",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            aria-label="Încarcă încă 12 imagini"
          >
            Încarcă încă 12 imagini
          </button>
        </div>
      )}

      {/* Lightbox — core + captions (lazy) */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
          plugins={captionsPlugin ? [captionsPlugin] : []}
        />
      )}
    </>
  );
}
