// controlcenter/components/ops/cities/OpsCitySwitcher.tsx

// ==============================
// Imports
// ==============================
import type { CityPublic } from "@taxi/shared";
import { useRouter } from "next/router";
import * as React from "react";

import { fetchCities } from "../../../lib/cities/citiesClient";
import * as s from "../../../styles/ops/opsCitySwitcher.css";

// ==============================
// Types
// ==============================
export type OpsCitySwitcherProps = {
  authToken: string;
  currentCityId: string;
  mode: "map" | "orders";
};

// ==============================
// Component
// ==============================
export default function OpsCitySwitcher(props: OpsCitySwitcherProps): React.JSX.Element {
  const { authToken, currentCityId, mode } = props;
  const router = useRouter();

  const [cities, setCities] = React.useState<ReadonlyArray<CityPublic>>([]);
  const [error, setError] = React.useState<string>("");
  const [q, setQ] = React.useState<string>("");

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const list = await fetchCities(authToken);
        if (!alive) return;
        setCities(list);
        setError("");
      } catch (e) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : "Failed to load cities";
        setCities([]);
        setError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, [authToken]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return cities;

    return cities.filter((c) => {
      const id = c.id.toLowerCase();
      const name = c.name.toLowerCase();
      return id.includes(needle) || name.includes(needle);
    });
  }, [cities, q]);

  const onChangeCity = React.useCallback(
    async (next: string) => {
      const cityId = next.trim().toLowerCase();
      if (!cityId) return;
      if (cityId === currentCityId) return;

      await router.push(`/ops/${encodeURIComponent(cityId)}/${mode}`);
    },
    [currentCityId, mode, router],
  );

  return (
    <div className={s.root} aria-label="City switcher">
      <input
        className={s.search}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Caută oraș…"
        aria-label="Caută oraș"
      />

      <select
        className={s.select}
        value={currentCityId}
        onChange={(e) => void onChangeCity(e.target.value)}
        aria-label="Selectează oraș"
      >
        {filtered.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.id})
          </option>
        ))}
      </select>

      {error ? (
        <div className={s.err} role="status" aria-live="polite">
          {error}
        </div>
      ) : null}
    </div>
  );
}
