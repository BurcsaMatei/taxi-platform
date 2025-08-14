import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { container } from "../styles/container.css";

type Props = {
  children?: ReactNode;
  title?: string;
};

const defaultUrl = "https://konceptid.com"; // <--- schimbă cu domeniul tău real!
const defaultTitle = "Lorem Ipsum Dolores – Exemplu Meta Title";
const defaultDesc = "Lorem ipsum dolores sit amet. Exemplu meta description pentru proiectul tău base-template.";
const defaultImg = "/og-image.jpg"; // <--- pune o imagine reprezentativă în public/
const defaultAuthor = "KonceptID – Agenție web design și digital";

const Layout = ({
  children,
  // aici schimbi textul pentru meta title (default)
  title = defaultTitle
}: Props) => (
  <div>
    <Head>
      {/* META TAGURI DE BAZĂ */}
      <title>{title}</title>
      <meta name="description" content={defaultDesc} />
      <meta name="author" content={defaultAuthor} />

      {/* FAVICON (variante pentru compatibilitate maximă) */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* THEME COLOR (pt. mobil) */}
      <meta name="theme-color" content="#ffffff" />

      {/* ROBOTS */}
      <meta name="robots" content="index, follow" />

      {/* KEYWORDS */}
      <meta name="keywords" content="web design, digital, agenție, seo, site, konceptid" />

      {/* CANONICAL */}
      {/* aici schimbi URL-ul pe domeniul tău real */}
      <link rel="canonical" href={defaultUrl} />

      {/* OPEN GRAPH (pentru Facebook, WhatsApp etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDesc} />
      <meta property="og:image" content={defaultImg} />
      <meta property="og:url" content={defaultUrl} />
      <meta property="og:site_name" content="KonceptID" />

      {/* TWITTER CARD */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={defaultDesc} />
      <meta name="twitter:image" content={defaultImg} />
      {/* Twitter user: adaugă userul de Twitter dacă ai */}
      <meta name="twitter:site" content="@konceptid" />

      {/* Setări de bază */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <main>
      <div className={container}>{children}</div>
    </main>
    <Footer />
  </div>
);

export default Layout;
