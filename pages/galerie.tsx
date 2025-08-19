// pages/galerie.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";

import HeroSectionGallery from "../components/sections/gallery/HeroSectionGallery";
import IntroSectionGallery from "../components/sections/gallery/IntroSectionGallery";
import Separator from "../components/Separator";
import ShortTextGallery from "../components/sections/gallery/ShortTextGallery";
import CardGrid from "../components/CardGrid";
import { buildGalleryItems, GALLERY_COUNT } from "../lib/gallery";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
const PAGE_SIZE = 12;

export default function GaleriePage() {
  const cards = useMemo(() => buildGalleryItems(GALLERY_COUNT), []);

  const slides = useMemo(
    () =>
      cards.map((c) => ({
        src: c.src,
        alt: c.alt,
        title: c.alt,
        description: c.caption ?? "",
      })),
    [cards]
  );

  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleCards = cards.slice(0, visible);
  const canLoadMore = visible < cards.length;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const [captionsPlugin, setCaptionsPlugin] = useState<any | null>(null);
  useEffect(() => {
    if (!open || captionsPlugin) return;
    import("yet-another-react-lightbox/plugins/captions").then((m) =>
      setCaptionsPlugin(() => m.default)
    );
  }, [open, captionsPlugin]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
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
        setTimeout(() => {
          lockRef.current = false;
        }, 350);
      },
      {
        root: null,
        rootMargin: "400px 0px",
        threshold: 0.01,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ioSupported, canLoadMore, cards.length]);

  // Crumbs vizuale
  const crumbs = [
    { name: "Acasă", href: "/" },
    { name: "Galerie", current: true },
  ];

  return (
    <>
      <Head>
        {/* JSON-LD pentru breadcrumbs */}
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

      <Seo
        title="Galerie"
        description="Galerie de proiecte KonceptID."
        image="/images/og-gallery.jpg"
        url="/galerie"
      />

      {/* Breadcrumbs reutilizabil */}
      <Breadcrumbs items={crumbs} />

      <HeroSectionGallery />
      <IntroSectionGallery />
      <Separator />
      <ShortTextGallery />

      <CardGrid
        cards={visibleCards}
        aboveTheFold={false}
        onItemClick={(i) => {
          setIndex(i);
          setOpen(true);
        }}
      />

      {canLoadMore && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{ height: 1, width: "100%", visibility: "hidden" }}
        />
      )}

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
