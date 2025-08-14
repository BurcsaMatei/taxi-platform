// pages/contact.tsx
import Head from "next/head";
import HeroSectionContact from "../components/sections/contact/HeroSectionContact";
import IntroSectionContact from "../components/sections/contact/IntroSectionContact";
import Separator from "../components/Separator";
import ShortTextContact from "../components/sections/contact/ShortTextContact";
import FormContact from "../components/sections/contact/FormContact";
import ContactInfo from "../components/sections/contact/ContactInfo";
import ContactMapIframeConsent from "@/components/sections/contact/ContactMapIframeConsent";

// Styles
import {
  breadcrumbsWrapperClass,
  breadcrumbsListClass,
  breadcrumbLinkClass,
  breadcrumbCurrentClass,
} from "../styles/breadcrumbs.css";
import { container } from "../styles/container.css";

// Date contact – modificabile rapid
const contactData = {
  businessName: "KonceptID",
  url: "https://konceptid.com/contact",
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
const breadcrumbs = [
  { name: "Acasă", url: "https://konceptid.com/" },
  { name: "Contact", url: "https://konceptid.com/contact" },
];

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

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    name: contactData.businessName,
    url: contactData.url,
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
};

const ContactPage = () => (
  <>
    <Head>
      <title>Contact - {contactData.businessName}</title>
      <meta name="description" content={`Contact ${contactData.businessName}`} />
      <link rel="canonical" href={contactData.url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
    </Head>

    {/* Breadcrumb vizual */}
    <nav aria-label="breadcrumb" className={breadcrumbsWrapperClass}>
      <ol className={breadcrumbsListClass}>
        <li><a href="/" className={breadcrumbLinkClass}>Acasă</a></li>
        <li style={{ margin: "0 7px", color: "#b5b5b5" }}>/</li>
        <li className={breadcrumbCurrentClass} aria-current="page">Contact</li>
      </ol>
    </nav>

    {/* Secțiuni */}
    <HeroSectionContact />
    <IntroSectionContact />
    <Separator />
    <ShortTextContact />

    {/* Info cards – o singură dată */}
    <ContactInfo />
    <Separator />

    {/* Formular */}
    <FormContact />
    <Separator />

    {/* Hartă cu consimțământ (click-to-load) */}
    <section className={container} style={{ marginTop: "40px" }}>
      <ContactMapIframeConsent
        src={contactData.mapEmbedUrl}
        // title și buttonLabel sunt opționale în componentă
      />
    </section>
  </>
);

export default ContactPage;
