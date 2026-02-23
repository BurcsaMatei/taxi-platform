// controlcenter/pages/index.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";
import * as React from "react";

import { withBase } from "../lib/config";
import * as s from "../styles/homeIndex.css";

// ==============================
// Component
// ==============================
const Home: NextPage = () => {
  return (
    <main className={s.page}>
      <section className={s.hero} aria-label="Control Center landing">
        <div className={s.heroInner}>
          <h1 className={s.title}>galant.taxi</h1>
          <p className={s.subtitle}>CONTROL CENTER</p>
          <p className={s.lead}>
            Bine ai venit. Alege rapid zona de operare pentru monitorizare și dispatch.
          </p>
        </div>
      </section>

      <section className={s.ctaSection} aria-label="Primary actions">
        <div className={s.ctaGrid}>
          <a className={s.ctaCard} href={withBase("/ops/map")}>
            <div className={s.ctaKicker}>OPS</div>
            <div className={s.ctaTitle}>Map</div>
            <div className={s.ctaDesc}>Flotă live, prezență, selecție vehicul, reset view.</div>
          </a>

          <a className={s.ctaCard} href={withBase("/ops/orders")}>
            <div className={s.ctaKicker}>OPS</div>
            <div className={s.ctaTitle}>Orders</div>
            <div className={s.ctaDesc}>Stream comenzi, status, dispatch, apel, vehicle state.</div>
          </a>
        </div>
      </section>
    </main>
  );
};

// ==============================
// Exporturi
// ==============================
export default Home;
