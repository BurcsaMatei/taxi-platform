import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";

import Hero from "../components/sections/Hero";
import IntroSection from "../components/sections/IntroSection";
import ShortText from "../components/sections/ShortText";
import Separator from "../components/Separator";
import GalleryPreviewHomepage from "../components/sections/homepage/GalleryPreviewHomepage";
import { Serviciipreview } from "../components/sections/Serviciipreview";
import ArticlesPreview from "../components/sections/ArticlesPreview";
import { getAllPosts } from "../lib/blogData";

// Breadcrumbs (doar Acasă) + JSON-LD
const breadcrumbs = [{ name: "Acasă", url: "https://konceptid.com/" }];
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
  postsPreview: ReturnType<typeof getAllPosts>;
};

const Home: NextPage<HomeProps> = ({ postsPreview }) => {
  const router = useRouter();

  // Prefetch pentru /galerie când browserul e „idle”
  useEffect(() => {
    const prefetch = () => router.prefetch("/galerie");
    if (typeof window === "undefined") return;

    let cleanup: (() => void) | undefined;

    // requestIdleCallback dacă există; altfel timeout fallback
    
    const ric = window.requestIdleCallback as
      | ((cb: IdleRequestCallback, opts?: IdleRequestOptions) => number)
      | undefined;

    if (ric) {
      const handle = ric(prefetch, { timeout: 2000 });
      cleanup = () => {
        
        window.cancelIdleCallback?.(handle);
      };
    } else {
      const id = setTimeout(prefetch, 1200);
      cleanup = () => clearTimeout(id);
    }

    return () => cleanup?.();
  }, [router]);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
      </Head>

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

      <Separator />
      <GalleryPreviewHomepage />
      <Separator />
      <Serviciipreview />
      <Separator />
      <ArticlesPreview posts={postsPreview.slice(0, 3)} />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postsPreview = getAllPosts();
  return { props: { postsPreview } };
};

export default Home;
