// components/Layout.tsx
import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { container } from "../styles/container.css";

type Props = {
  children?: ReactNode;
  // poți păstra "title" dacă îl folosești pentru altceva, dar nu-l mai pui în <Head>
  title?: string;
};

const defaultAuthor = "KonceptID – Agenție web design și digital";

const Layout = ({ children }: Props) => (
  <div>
    <Head>
      {/* DOAR meta globale/tehnice — fără SEO per pagină */}
      <meta name="author" content={defaultAuthor} />

      {/* Favicon & manifest */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme color */}
      <meta name="theme-color" content="#ffffff" />

      {/* Bazice */}
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
