// pages/index.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";

import BlueprintMap from "../components/blueprint/BlueprintMap";
import Seo from "../components/Seo";
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
  ],
} as const satisfies Json;

// ==============================
// Component
// ==============================
const Home: NextPage = () => {
  return (
    <>
      <Seo
        title="KonceptID"
        description={SEO_DEFAULTS.description}
        url="/"
        image={SEO_DEFAULTS.ogImage}
        structuredData={[breadcrumbList]}
      />

      <BlueprintMap />
    </>
  );
};

// ==============================
// Exporturi
// ==============================
export default Home;
