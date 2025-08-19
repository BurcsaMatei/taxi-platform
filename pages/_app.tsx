// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import { container } from "../styles/container.css";
import "../styles/globals.css";
import CookieProvider from "../components/cookies/CookieProvider";

// Lightbox CSS global
import "yet-another-react-lightbox/styles.css";

// next/font/google — self-hosted (fără link extern)
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// META / OG defaults (fallback; paginile le pot suprascrie prin <Seo />)
const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const defaultTitle = "Agenție web design și digital | KonceptID";
const defaultDesc =
  "Lorem ipsum dolores sit amet. Exemplu meta description pentru proiectul tău base-template.";
const defaultImg = "/images/og.jpg";
const defaultAuthor = "KonceptID – Agenție web design și digital";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    // inter.className aplică efectiv fontul; .variable expune CSS var dacă o folosești în stiluri
    <div className={`${inter.className} ${inter.variable} ${poppins.variable}`}>
      <Head>
        {/* Fallback META – paginile vor suprascrie prin <Seo /> */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDesc} />
        <meta name="author" content={defaultAuthor} />
        <meta name="robots" content="index, follow" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#78B688" />


        {/* ⚠️ Eliminat canonical global: fiecare pagină își setează canonical corect prin <Seo /> */}
        {/* <link rel="canonical" href={defaultUrl} /> */}

        {/* Favicon + PWA/Manifest */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#5561F2" />

        {/* Open Graph defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={defaultTitle} />
        <meta property="og:description" content={defaultDesc} />
        <meta property="og:image" content={defaultImg} />
        <meta property="og:url" content={defaultUrl} />
        <meta property="og:site_name" content="KonceptID" />

        {/* Twitter Card defaults */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultTitle} />
        <meta name="twitter:description" content={defaultDesc} />
        <meta name="twitter:image" content={defaultImg} />
        <meta name="twitter:site" content="@konceptid" />
      </Head>

      <CookieProvider>
        <SkipLink />
        <Header />

        <main>
          <div id="main-content" className={container}>
            <Component {...pageProps} />
          </div>
        </main>

        <Footer />

        {/* Overlay Lightbox peste header */}
        <style jsx global>{`
          .yarl__root { z-index: 5000; }
        `}</style>
      </CookieProvider>
    </div>
  );
}
