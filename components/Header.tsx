// components/Header.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import {
  headerClass,
  headerInnerClass,
  logoBoxClass,
  desktopNavClass,
  desktopNavLinkClass,
  burgerButtonClass,
  mobileNavClass,
  mobileListClass,
  mobileListItemClass,
  mobileNavLinkClass,
} from "../styles/header.css";

// import relativ, conform structurii tale
import LogoMark from "../src/assets/logo.svg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={headerClass} role="banner">
      <div className={headerInnerClass}>
        {/* Logo */}
        <div className={logoBoxClass}>
          <Link
            href="/"
            aria-label="KonceptID — Acasă"
            style={{ lineHeight: 0, display: "inline-flex", height: "100%", alignItems: "center" }}
          >
            <LogoMark style={{ display: "block", height: "100%", width: "auto" }} />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className={desktopNavClass} aria-label="Navigație principală">
          <Link href="/" className={desktopNavLinkClass}>Home</Link>
          <Link href="/services" className={desktopNavLinkClass}>Servicii</Link>
          <Link href="/galerie" className={desktopNavLinkClass}>Galerie</Link>
          <Link href="/contact" className={desktopNavLinkClass}>Contact</Link>
        </nav>

        {/* Burger (doar pe mobil) */}
        <button
          type="button"
          className={burgerButtonClass}
          aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={isOpen}
          aria-controls="site-mobile-nav"
          onClick={() => setIsOpen(v => !v)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav — listă verticală simplă, fără overlay */}
      {isOpen && (
        <nav id="site-mobile-nav" className={mobileNavClass} aria-label="Navigație mobil">
          <ul className={mobileListClass}>
            <li className={mobileListItemClass}>
              <Link href="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li className={mobileListItemClass}>
              <Link href="/services" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Servicii</Link>
            </li>
            <li className={mobileListItemClass}>
              <Link href="/galerie" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Galerie</Link>
            </li>
            <li className={mobileListItemClass}>
              <Link href="/contact" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Contact</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
