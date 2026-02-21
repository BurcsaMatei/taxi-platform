// pages/index.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";

import Seo from "../components/Seo";
import type { Json } from "../interfaces";
import { absoluteUrl, SEO_DEFAULTS } from "../lib/config";

// ==============================
// Constante
// ==============================
const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "KonceptID", item: absoluteUrl("/") }],
} as const satisfies Json;

// ==============================
// Component
// ==============================
const Home: NextPage = () => {
  return (
    <>
      <Seo
        title="Control Center"
        description={SEO_DEFAULTS.description}
        url="/"
        image={SEO_DEFAULTS.ogImage}
        structuredData={[breadcrumbList]}
      />

      <section className="section">
        <div className="container">
          <h1>Control Center</h1>
          <p>Intrare rapidă către operațiuni.</p>

          <ul>
            <li>
              <a href="/ops/map">OPS / Map</a>
            </li>
            <li>
              <a href="/ops/orders">OPS / Orders</a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

// ==============================
// Exporturi
// ==============================
export default Home;