// controlcenter/pages/ops/orders.tsx

// ==============================
// Imports
// ==============================
import { useRouter } from "next/router";
import * as React from "react";

import * as s from "../../styles/ops/opsCityPicker.css";

// ==============================
// Component
// ==============================
export default function OpsOrdersLegacyEntry(): React.JSX.Element {
  const router = useRouter();

  const [cityId, setCityId] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onGo = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();

      const raw = cityId.trim().toLowerCase();
      if (!raw) {
        setError("Introduce un cityId (ex: baia-mare).");
        return;
      }

      setError("");
      void router.push(`/ops/${encodeURIComponent(raw)}/orders`);
    },
    [cityId, router],
  );

  return (
    <main className={s.page} data-page="ops-orders-legacy">
      <section className={s.card} aria-label="Alege orașul">
        <h1 className={s.title}>CONTROL CENTER / ORDERS</h1>
        <p className={s.subtitle}>
          Ruta nouă este <span className={s.mono}>/ops/[cityId]/orders</span>. Alege orașul și
          continuă.
        </p>

        <form className={s.form} onSubmit={onGo} aria-label="City picker">
          <label className={s.label} htmlFor="cityId">
            City ID
          </label>
          <input
            id="cityId"
            className={s.input}
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            placeholder="ex: baia-mare"
            autoComplete="off"
            spellCheck={false}
          />
          <button className={s.btn} type="submit">
            Deschide orders
          </button>
        </form>

        {error ? (
          <div className={s.error} role="status" aria-live="polite">
            {error}
          </div>
        ) : null}
      </section>
    </main>
  );
}
