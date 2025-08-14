import Head from "next/head";
import HeroSectionAbout from '../components/sections/about/HeroSectionAbout';
import IntroSectionAbout from '../components/sections/about/IntroSectionAbout';
import Separator from '../components/Separator';
import ShortTextAbout from '../components/sections/about/ShortTextAbout';
import Seo from "@/components/Seo";

// Importă clasele Vanilla Extract pentru breadcrumbs
import {
  breadcrumbsWrapperClass,
  breadcrumbsListClass,
  breadcrumbLinkClass,
  breadcrumbCurrentClass,
} from '../styles/breadcrumbs.css';

// Breadcrumbs pentru About (Despre)
const breadcrumbs = [
  { name: "Acasă", url: "https://konceptid.com/" },
  { name: "About", url: "https://konceptid.com/about" }
];

// JSON-LD BreadcrumbList pentru SEO (Schema.org)
const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    item: item.url
  }))
};

const AboutPage = () => (
  <>
    <Head>
      {/* JSON-LD pentru Breadcrumbs SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
    </Head>

    {/* Breadcrumb vizual – deasupra Hero, 100% Vanilla Extract */}
    <nav aria-label="breadcrumb" className={breadcrumbsWrapperClass}>
      <ol className={breadcrumbsListClass}>
        <li>
          <a href="/" className={breadcrumbLinkClass}>
            Acasă
          </a>
        </li>
        <li style={{ margin: "0 7px", color: "#b5b5b5" }}>/</li>
        <li className={breadcrumbCurrentClass} aria-current="page">
          About
        </li>
      </ol>
    </nav>

    <HeroSectionAbout />
    <IntroSectionAbout />
    <Separator />
    <ShortTextAbout />
     <Seo
        title="Despre noi"
        description="Află povestea și principiile KonceptID."
        image="/images/og-about.jpg"
        url={(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/about"}
      />
    {/* Alte secțiuni pot fi adăugate aici */}
    {/* Exemplu: <TeamSection /> */}
    {/* Alte secțiuni (ex: echipă, poveste etc) se adaugă mai jos */}
  </>
);

export default AboutPage;
