// pages/contact.tsx
import Head from "next/head";
import Seo from "../components/Seo";

import Breadcrumbs from "../components/Breadcrumbs";

import HeroSectionContact from "../components/sections/contact/HeroSectionContact";
import IntroSectionContact from "../components/sections/contact/IntroSectionContact";
import Separator from "../components/Separator";
import ShortTextContact from "../components/sections/contact/ShortTextContact";
import FormContact from "../components/sections/contact/FormContact";
import ContactInfo from "../components/sections/contact/ContactInfo";
import ContactMapIframeConsent from "../components/sections/contact/ContactMapIframeConsent";

// Styles
import { container } from "../styles/container.css";
import { mapSectionClass } from "../styles/contact.css";

// Date contact – modificabile rapid
const contactData = {
  businessName: "KonceptID",
  url: "/contact", // dăm doar path-ul; Seo va construi absolut
  email: "info@konceptid.com",
  phone: "+40 751 528 414",
  address: {
    street: "Strada Rozelor 12",
    city: "Baia Mare",
    region: "Maramureș",
    postalCode: "430033",
    country: "RO",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2721.5714807252453!2d23.5680558156065!3d47.66108459141066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4739f492c8f20e13%3A0xf7c672fcf49b6a75!2sStrada%20Rozelor%2012%2C%20Baia%20Mare%20430033!5e0!3m2!1sro!2sro!4v1691842833214",
};

// Breadcrumbs + JSON-LD
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

const crumbs = [
  { name: "Acasă", href: "/" },
  { name: "Contact", current: true },
];

const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
  ],
} as const;

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    name: contactData.businessName,
    url: `${SITE_URL}${contactData.url}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactData.phone,
      contactType: "customer service",
      email: contactData.email,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: contactData.address.street,
      addressLocality: contactData.address.city,
      addressRegion: contactData.address.region,
      postalCode: contactData.address.postalCode,
      addressCountry: contactData.address.country,
    },
  },
} as const;

const ContactPage = () => (
  <>
    {/* SEO per pagină */}
    <Seo
      title="Contact"
      description={`Contact ${contactData.businessName}`}
      url={contactData.url} // path relativ -> Seo face absolut
      image="/images/og-contact.jpg" // opțional
    />

    {/* JSON-LD în <Head> */}
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
    </Head>

    {/* Breadcrumbs (separator „/” vine din CSS-ul componentei) */}
    <Breadcrumbs items={crumbs} />

    {/* Secțiuni */}
    <HeroSectionContact />
    <IntroSectionContact />
    <Separator />
    <ShortTextContact />

    {/* Info cards */}
    <ContactInfo />
    <Separator />

    {/* Formular */}
    <FormContact />
    <Separator />

    {/* Hartă cu consimțământ (click-to-load) */}
    <section className={`${container} ${mapSectionClass}`}>
      <ContactMapIframeConsent src={contactData.mapEmbedUrl} />
    </section>
  </>
);

export default ContactPage;
