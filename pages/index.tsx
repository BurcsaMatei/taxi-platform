// pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import HeroSectionHomepage from "../components/sections/homepage/HeroSectionHomepage";
import IntroSectionHomepage from "../components/sections/homepage/IntroSectionHomepage";
import Separator from "../components/Separator";
import ShortTextHomepage from "../components/sections/homepage/ShortTextHomepage";
import GalleryPreviewHomepage from "../components/sections/homepage/GalleryPreviewHomepage";

// Breadcrumbs pentru homepage (doar Acasă)
const breadcrumbs = [{ name: "Acasă", url: "https://konceptid.com/" }];

// JSON-LD pentru breadcrumbs SEO (Schema.org)
const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
};

export default function HomePage() {
  const router = useRouter();

// Prefetch pentru /galerie când browserul e „idle” (fallback: timeout)
useEffect(() => {
  const prefetch = () => router.prefetch("/galerie");
  if (typeof window === "undefined") return;

  let cleanup: (() => void) | undefined;

  if ("requestIdleCallback" in window) {
    const handle = (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
    cleanup = () => (window as any).cancelIdleCallback?.(handle);
  } else {
    // folosim versiunile globale, nu window.setTimeout
    const id = setTimeout(prefetch, 1200);
    cleanup = () => clearTimeout(id);
  }

  return () => cleanup?.();
}, [router]);


  return (
    <>
      <Head>
        {/* JSON-LD pentru Breadcrumbs SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
      </Head>

      <HeroSectionHomepage />
      <IntroSectionHomepage />
      <Separator />
      <ShortTextHomepage />
      <GalleryPreviewHomepage />
      {/* Alte secțiuni... */}
    </>
  );
}
