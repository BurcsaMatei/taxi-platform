// components/Seo.tsx
import Head from "next/head";

type SeoProps = {
  /** Titlul paginii (fără brand). Ex: "Galerie" */
  title?: string;
  /** Meta description scurt (140–160c) */
  description?: string;
  /** Calea imaginii OG din /public (ex: "/images/og-galerie.jpg") sau URL absolut */
  image?: string;
  /** Canonical absolut; dacă dai doar path (ex: "/galerie"), îl fac absolut automat */
  url?: string;
  /** Setează noindex/nofollow pentru pagini speciale (ex: preview) */
  noindex?: boolean;
};

const SITE_NAME = "KonceptID";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DEFAULT_TITLE = "Agenție web design și digital | KonceptID";
const DEFAULT_DESC =
  "Lorem ipsum dolores sit amet. Exemplu meta description pentru proiectul tău base-template.";
const DEFAULT_IMG = "/images/og.jpg"; // pune fișierul în /public/images/og.jpg

function toAbsoluteUrl(input?: string) {
  if (!input) return SITE_URL;
  return input.startsWith("http") ? input : `${SITE_URL}${input}`;
}

export default function Seo({
  title,
  description,
  image,
  url,
  noindex = false,
}: SeoProps) {
  const metaTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDesc = description ?? DEFAULT_DESC;

  // Canonical (absolut)
  const canonical = toAbsoluteUrl(url ?? "/");

  // OG image (absolută — dacă treci /images/.. o prefixăm cu domeniul)
  const ogImageAbs = toAbsoluteUrl(image ?? DEFAULT_IMG);

  return (
    <Head>
      {/* Title + Description */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImageAbs} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImageAbs} />
    </Head>
  );
}
