// pages/services.tsx
import { NextPage } from "next";
import Head from "next/head";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { HeroServicii } from "../components/sections/HeroServicii";

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

      <HeroServicii />
    </>
  );
};

export default ServicesPage;
