// pages/index.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";

import { withBase } from "../lib/config";

// ==============================
// Component
// ==============================
const Home: NextPage = () => {
  return (
    <section className="section">
      <div className="container">
        <h1>Control Center</h1>
        <p>Intrare rapidă către operațiuni.</p>

        <ul>
          <li>
            <a href={withBase("/ops/map")}>OPS / Map</a>
          </li>
          <li>
            <a href={withBase("/ops/orders")}>OPS / Orders</a>
          </li>
        </ul>
      </div>
    </section>
  );
};

// ==============================
// Exporturi
// ==============================
export default Home;
