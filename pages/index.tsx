// pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Separator from "../components/Separator";
import GalleryPreviewHomepage from "../components/sections/homepage/GalleryPreviewHomepage";
import { Serviciipreview } from "../components/sections/Serviciipreview";
import ArticlesPreview from "../components/sections/ArticlesPreview";
import { getAllPosts } from "../lib/blogData";
import Hero from "../components/sections/Hero";
import IntroSection from "../components/sections/IntroSection";
import ShortText from "../components/sections/ShortText";


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

type HomeProps = {
  // păstrăm aici toate postările vizibile; în UI afișăm primele 3
  postsPreview: ReturnType<typeof getAllPosts>;
};

const HomePage: NextPage<HomeProps> = ({ postsPreview }) => {
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
      <Separator />
      <GalleryPreviewHomepage />
      <Separator />
      <Serviciipreview />
      <Separator />

      {/* === ArticlesPreview: luăm primele 3 articole === */}
      <ArticlesPreview posts={postsPreview.slice(0, 3)} />
      {/* Alte secțiuni... */}
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // SSG: preluăm lista de articole (varianta „lite” din lib/blogData.ts)
  const postsPreview = getAllPosts();
  return { props: { postsPreview } };
};

export default function HomePage() {
  return (
    <>
      <Hero
        title="Bine ai venit"
        subtitle="Text scurt de întâmpinare"
        image={{ src: "/images/hero/home.jpg", alt: "Hero homepage", priority: true }}
        height="md"
        withOverlay
      />

      <IntroSection
        eyebrow="Despre noi"
        title="Calitate. Claritate. Viteză."
        lede="Template-ul de bază pentru proiecte scalabile."
      />

      <ShortText
        title="Ce îți oferim"
        subtitle="Secțiuni curate, performanță ridicată, SEO și A11y integrate."
      >
        <p>Poți adăuga aici text suplimentar sau chiar componente.</p>
      </ShortText>

      {/* Restul componentelor existente rămân */}
    </>
  );
}

