// lib/blueprintdata/panels.ts

// ==============================
// Imports
// ==============================
import type { BlueprintDistrictId } from "./districts";

// ==============================
// Types
// ==============================
export type BlueprintDistrictPanelItem = {
  id: string;
  title: string;
  description?: string;
  externalHref: string;
  internalHref?: string;
};

export type BlueprintDistrictPanel = {
  title: string;
  description: string;
  items: readonly BlueprintDistrictPanelItem[];
};

// ==============================
// Data
// ==============================
export const BLUEPRINT_PANELS: Readonly<Record<BlueprintDistrictId, BlueprintDistrictPanel>> =
  Object.freeze({
    concept: {
      title: "Concept",
      description: "Direcția produsului, arhitectura și sistemele care susțin KonceptID.",
      items: [
        {
          id: "about-konceptid",
          title: "KonceptID (overview)",
          description: "Ce construim și cum gândim produsul.",
          externalHref: "https://konceptid.com/",
          internalHref: "/concept",
        },
        {
          id: "blueprint-map",
          title: "Blueprint Map",
          description: "Harta interactivă (MVP) — navigare în hartă.",
          externalHref: "https://konceptid.com/",
          internalHref: "/",
        },
        {
          id: "ui-kit",
          title: "UI Kit",
          description: "Componente, tokens și standarde vizuale.",
          externalHref: "https://konceptid.com/",
          internalHref: "/concept",
        },
      ],
    },

    portfolio: {
      title: "Portfolio",
      description: "Proiecte livrate, studii de caz și capabilități de implementare.",
      items: [
        {
          id: "cmf",
          title: "CMF Baia Mare",
          description: "Website business — SEO/performanță + execuție rapidă.",
          externalHref: "https://cmfbaiamare.ro/",
          internalHref: "/portfolio",
        },
        {
          id: "zephira",
          title: "Zephira Events",
          description: "Website evenimente — pagini dinamice + UX.",
          externalHref: "https://zephiraevents.ro/",
          internalHref: "/portfolio",
        },
        {
          id: "fraternitacss",
          title: "FraternitaCSS",
          description: "NGO — i18n + plăți + conținut structurat.",
          externalHref: "https://fraternitacss.com/",
          internalHref: "/portfolio",
        },
        {
          id: "konceptid",
          title: "KonceptID",
          description: "Platformă / ecosistem — infrastructură și produse.",
          externalHref: "https://konceptid.com/",
          internalHref: "/portfolio",
        },
      ],
    },

    marketplace: {
      title: "Marketplace",
      description: "Template-uri și produse digitale (concept) — listare, selecție, livrare.",
      items: [
        {
          id: "templates",
          title: "Templates",
          description: "Catalog template-uri (concept).",
          externalHref: "https://konceptid.com/",
          internalHref: "/marketplace",
        },
        {
          id: "waas",
          title: "Website-as-a-Service",
          description: "Template + abonament + dashboard (concept).",
          externalHref: "https://konceptid.com/",
          internalHref: "/marketplace",
        },
        {
          id: "digital-art",
          title: "Tablouri Digitale",
          description: "Magazin (concept) — print-on-canvas.",
          externalHref: "https://konceptid.com/",
          internalHref: "/marketplace",
        },
      ],
    },

    auctions: {
      title: "Auctions",
      description: "Licitații (concept) — mecanisme, pagini și fluxuri.",
      items: [
        {
          id: "auctions-home",
          title: "Auctions hub",
          description: "Lista licitațiilor și regulile principale.",
          externalHref: "https://konceptid.com/",
          internalHref: "/auctions",
        },
        {
          id: "bidding",
          title: "Bidding flow",
          description: "Login, ofertare, confirmări (concept).",
          externalHref: "https://konceptid.com/",
          internalHref: "/auctions",
        },
        {
          id: "payouts",
          title: "Payouts",
          description: "Plăți / livrare (concept).",
          externalHref: "https://konceptid.com/",
          internalHref: "/auctions",
        },
      ],
    },

    blog: {
      title: "Blog",
      description: "Articole, update-uri și note de construcție a produsului.",
      items: [
        {
          id: "product-notes",
          title: "Product notes",
          description: "Decizii, standarde și tradeoffs.",
          externalHref: "https://konceptid.com/",
          internalHref: "/blog",
        },
        {
          id: "devlog",
          title: "Devlog",
          description: "Update-uri tehnice + release notes.",
          externalHref: "https://konceptid.com/",
          internalHref: "/blog",
        },
        {
          id: "case-studies",
          title: "Case studies",
          description: "Implementări și rezultate.",
          externalHref: "https://konceptid.com/",
          internalHref: "/blog",
        },
      ],
    },
  });
