// components/Header.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  headerClass,
  headerInnerClass,
  navClass,
  navLinkClass,
  hamburgerClass,
  mobileNavClass,
  mobileOverlayClass,
  socialIconsWrapperClass,
  socialIconClass,
  headerVarsClass,
  logoBoxClass,
  // dacă aveai și mobileCloseClass în css, îl poți re-aduce și aici
} from "../styles/header.css";

// ✅ logo din src/assets (SVGR)
import LogoMark from "@assets/logo.svg";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(v => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={[headerClass, headerVarsClass].join(" ")}>
      {/* Overlay mobil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={mobileOverlayClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <div className={headerInnerClass}>
        {/* LOGO stânga — SVG inline încadrat pe înălțimea benzii */}
        <div className={logoBoxClass}>
          <Link
            href="/"
            aria-label="KonceptID — Acasă"
            style={{ lineHeight: 0, display: "inline-flex", alignItems: "center", height: "100%" }}
          >
            <LogoMark style={{ display: "block", height: "100%", width: "auto" }} />
          </Link>
        </div>

        {/* NAV desktop (dreapta) */}
        <nav className={navClass} aria-label="Navigație principală">
          <Link href="/" className={navLinkClass}>Home</Link>
          <Link href="/about" className={navLinkClass}>About</Link>
          <Link href="/galerie" className={navLinkClass}>Galerie</Link>
          <Link href="/contact" className={navLinkClass}>Contact</Link>
        </nav>

        {/* HAMBURGER mobil (dreapta) */}
        <motion.button
          type="button"
          className={hamburgerClass}
          aria-label={mobileOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-nav"
          onClick={toggleMobile}
          whileTap={{ rotate: 180, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <motion.span
            key={mobileOpen ? "close" : "open"}
            initial={{ rotate: 0, scale: 0.7, opacity: 0.6 }}
            animate={{ rotate: mobileOpen ? 90 : 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.22, ease: [0.44, 0.72, 0.58, 0.96] }}
            style={{ display: "inline-block" }}
          >
            {mobileOpen ? "✕" : "☰"}
          </motion.span>
        </motion.button>
      </div>

      {/* NAV mobil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="site-mobile-nav"
            className={mobileNavClass}
            aria-label="Navigație mobil"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.44, 0.72, 0.58, 0.96] }}
          >
            <Link href="/" className={navLinkClass} onClick={closeMobile}>Home</Link>
            <Link href="/about" className={navLinkClass} onClick={closeMobile}>About</Link>
            <Link href="/galerie" className={navLinkClass} onClick={closeMobile}>Galerie</Link>
            <Link href="/contact" className={navLinkClass} onClick={closeMobile}>Contact</Link>

            {/* SOCIAL & CONTACT EXTRAS */}
            <div className={socialIconsWrapperClass} style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <a href="https://facebook.com/..." target="_blank" rel="noopener" aria-label="Facebook">
                  <svg className={socialIconClass} width={26} height={26} viewBox="0 0 512 512" fill="currentColor">
                    <path d="M0,450V62c.31-.34.82-.64.89-1C5.17,37.16,18.61,19.86,39.46,8.43c7-3.82,15-5.68,22.54-8.43H450c.34.31.64.82,1,.89,23.82,4.28,41.12,17.72,52.55,38.57,3.82,7,5.68,15,8.43,22.54V450c-.31.34-.82.64-.89,1-4.28,23.82-17.72,41.12-38.57,52.55-7,3.82-15,5.68-22.54,8.43H316V330.74h75.58c5-30.12,9.88-59.67,14.89-89.91H316.24V180h90.4V90.15c-1.17-.06-2-.14-2.81-.14-28,0-56-.26-84,.14a104.58,104.58,0,0,0-26.29,3.28c-25.85,7.15-45.15,22.85-57.63,46.79-7.3,14-9.4,29.21-9.83,44.63-.46,16.81-.1,33.65-.1,50.48v5.85H166.25v89.89H226V512H62c-.34-.31-.64-.82-1-.89-23.82-4.28-41.12-17.72-52.55-38.57C4.61,465.58,2.75,457.55,0,450Z" />
                  </svg>
                </a>
                <a href="https://instagram.com/..." target="_blank" rel="noopener" aria-label="Instagram">
                  <svg className={socialIconClass} width={26} height={26} viewBox="0 0 170.59 170.59" fill="currentColor">
                    <g>
                      <path d="M85,170.56c-16,0-32,.08-48,0-16.75-.1-30.22-9.89-35.29-25.83a37.81,37.81,0,0,1-1.65-11Q-.07,85.31.07,37C.15,16.13,16,.21,36.8.11q48.48-.22,97,0c20.82.1,36.65,16,36.73,36.85q.18,48.36,0,96.72c-.09,20.95-16,36.65-37,36.88H85Zm38.05-85.09c.23-20.43-16.76-37.73-37.26-37.94A37.88,37.88,0,0,0,47.51,85.16c-.29,20.48,16.83,37.82,37.49,38A38,38,0,0,0,123.08,85.47Zm10-61.21a13.44,13.44,0,1,0,13.34,13.53A13.31,13.31,0,0,0,133,24.26Z"/>
                      <path d="M103.9,85.73a18.62,18.62,0,1,1-18.33-19A18.44,18.44,0,0,1,103.9,85.73Z"/>
                    </g>
                  </svg>
                </a>
                <a href="https://tiktok.com/..." target="_blank" rel="noopener" aria-label="TikTok">
                  <svg className={socialIconClass} width={26} height={26} viewBox="0 0 512 512" fill="currentColor">
                    <path d="M0,466V46a30.87,30.87,0,0,0,1.16-3.08C6.48,22.78,18.87,9.18,38.62,2.39,41.07,1.55,43.54.8,46,0H466a30.87,30.87,0,0,0,3.08,1.16c20.14,5.32,33.74,17.71,40.53,37.46.84,2.45,1.59,4.92,2.39,7.38V466a30.87,30.87,0,0,0-1.16,3.08c-5.32,20.14-17.71,33.74-37.46,40.53-2.45.84-4.92,1.59-7.38,2.39H46a30.87,30.87,0,0,0-3.08-1.16c-20.14-5.32-33.74-17.71-40.53-37.46C1.55,470.93.8,468.46,0,466ZM326.83,194.9c26.57,18.39,55.09,27.74,86.65,28v-61.4q-79.2-8.91-87.39-87.26H264.51v7.4q0,119.24,0,238.47a64.32,64.32,0,0,1-.77,11.45c-4.74,25.84-28.13,44.5-54,43.25-27-1.31-48.08-22-50.49-49.58C157.06,300.36,175,276,200.55,271c8.4-1.66,17.4-.26,26.2-.26V208.36a100.18,100.18,0,0,0-38.09,1.24c-61.72,13.45-100.39,70.89-89.75,133.12,10.79,63.07,75,105.92,137.4,91.64C290.23,422,326.83,376,326.83,320.67V194.9Z"/>
                  </svg>
                </a>
              </div>
              {/* Telefon sub iconițe */}
              <a
                href="tel:+40700123456"
                aria-label="Sună-ne"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "inherit",
                  textDecoration: "none",
                  marginTop: "1rem",
                  fontWeight: 500,
                  fontSize: "1.06rem"
                }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.54A2 2 0 0 1 10.91 9L9.1 10.82a16 16 0 0 0 6.07 6.07l1.79-1.79a2 2 0 0 1 2.73.11 12.05 12.05 0 0 0 2.54.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>+40 700 123 456</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
