// pages/portfolio.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";

import Seo from "../components/Seo";
import Separator from "../components/Separator";
import type { Json } from "../interfaces";
import { absoluteUrl, SEO_DEFAULTS } from "../lib/config";

// ==============================
// Constante
// ==============================
const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "KonceptID", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: absoluteUrl("/portfolio") },
  ],
} as const satisfies Json;

// ==============================
// Component
// ==============================
const PortfolioPage: NextPage = () => {
  return (
    <>
      <Seo
        title="Portfolio"
        description={SEO_DEFAULTS.description}
        url="/portfolio"
        image={SEO_DEFAULTS.ogImage}
        structuredData={[breadcrumbList]}
      />

      <section className="section">
        <div className="container">
          <h1>Portfolio</h1>
          <p>Placeholder. Aici intră proiectele (POI-uri) și list view.</p>
        </div>
      </section>

      <Separator />
    </>
  );
};

// ==============================
// Exporturi
// ==============================
export default PortfolioPage;
