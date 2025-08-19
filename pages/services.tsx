// pages/services.tsx
import type { NextPage } from "next";
import Head from "next/head";

import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import Hero from "../components/sections/Hero";
import IntroSection from "../components/sections/IntroSection";
import ShortText from "../components/sections/ShortText";
import Separator from "../components/Separator";
import { Serviciipreview } from "../components/sections/Serviciipreview";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

const ServicesPage: NextPage = () => {
  const pagePath = "/services";
  const pageUrl = `${SITE_URL}${pagePath}`;

  const crumbs = [
    { name: "Acasă", href: "/" },
    { name: "Servicii", current: true },
  ];

  return (
    <>
      <Seo
        title="Servicii"
        description="Servicii web: design modern, dezvoltare Next.js, optimizare & SEO, conținut & blog."
        url={pagePath}
        image="/images/og-services.jpg"
      />

      <Head>
        {/* JSON-LD Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Servicii", item: pageUrl },
              ],
            }),
          }}
        />
      </Head>

      <Breadcrumbs items={crumbs} />

      {/* === Secțiuni generice === */}
      <Hero
        title="Servicii"
        subtitle="De la design la go-live: pachet complet pentru site-uri rapide și scalabile."
        image={{ src: "/images/hero/services.jpg", alt: "Hero servicii", priority: true }}
        height="md"
        withOverlay
      />

      <IntroSection
        eyebrow="Ce facem"
        title="Servicii web end-to-end"
        lede="Design UI/UX, dezvoltare Next.js, optimizare performanță & SEO tehnic, conținut și blog — integrate într-un flux clar."
      />

      <Separator />

      <Serviciipreview />

      <Separator />

      <ShortText
        title="Procesul nostru"
        subtitle="Simplu și transparent — ca să ajungem repede la rezultat."
      >
        <ul>
          <li><strong>Analiză & plan:</strong> obiective, sitemap, conținut minim viabil.</li>
          <li><strong>Design & implementare:</strong> componente curate, secțiuni reutilizabile.</li>
          <li><strong>Optimizare & lansare:</strong> SEO, A11y, performanță, tracking.</li>
        </ul>
      </ShortText>
    </>
  );
};

export default ServicesPage;
