// controlcenter/pages/index.tsx

// ==============================
// Imports
// ==============================
import type { NextPage } from "next";
import * as React from "react";

import {
  clearStoredControlcenterToken,
  decodeControlcenterTokenPayloadUnsafe,
  getStoredControlcenterToken,
  isControlcenterTokenExpired,
  loginControlcenter,
  setStoredControlcenterToken,
} from "../lib/auth/controlcenterAuth";
import type { CityPublic } from "../lib/cities/citiesClient";
import { fetchCities } from "../lib/cities/citiesClient";
import { withBase } from "../lib/config";
import * as s from "../styles/ops/opsIndex.css";

// ==============================
// Component
// ==============================
const Home: NextPage = () => {
  const [token, setToken] = React.useState<string | null>(null);
  const [expired, setExpired] = React.useState<boolean>(false);
  const [scope, setScope] = React.useState<"hq" | "city" | null>(null);
  const [scopedCityId, setScopedCityId] = React.useState<string | null>(null);

  const [cityId, setCityId] = React.useState<string>("");
  const [pin, setPin] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const [cities, setCities] = React.useState<ReadonlyArray<CityPublic>>([]);
  const [q, setQ] = React.useState<string>("");

  React.useEffect(() => {
    const t = getStoredControlcenterToken();
    setToken(t);

    if (!t) {
      setExpired(false);
      setScope(null);
      setScopedCityId(null);
      return;
    }

    const payload = decodeControlcenterTokenPayloadUnsafe(t);
    if (!payload) {
      setExpired(true);
      setScope(null);
      setScopedCityId(null);
      return;
    }

    setExpired(isControlcenterTokenExpired(payload));
    setScope(payload.scope);
    setScopedCityId(typeof payload.cityId === "string" ? payload.cityId : null);
  }, []);

  const needsLogin = !token || expired;

  React.useEffect(() => {
    let alive = true;

    (async () => {
      if (needsLogin) return;

      try {
        const list = await fetchCities(token);
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
  }, [needsLogin, token]);

  const filteredCities = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return cities;

    return cities.filter((c) => {
      const id = c.id.toLowerCase();
      const name = c.name.toLowerCase();
      return id.includes(needle) || name.includes(needle);
    });
  }, [cities, q]);

  const onLogin = React.useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();

      const c = cityId.trim().toLowerCase();
      const p = pin.trim();

      if (!c) {
        setError("Introduce cityId (ex: baia-mare).");
        return;
      }
      if (!p) {
        setError("Introduce PIN.");
        return;
      }

      setBusy(true);
      setError("");

      try {
        const r = await loginControlcenter(c, p);
        setStoredControlcenterToken(r.token);
        window.location.reload();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Login failed";
        setError(msg);
      } finally {
        setBusy(false);
      }
    },
    [cityId, pin],
  );

  const onLogout = React.useCallback(() => {
    clearStoredControlcenterToken();
    window.location.reload();
  }, []);

  return (
    <main className={s.page}>
      <section className={s.hero} aria-label="Control Center landing">
        <div className={s.heroInner}>
          <h1 className={s.title}>galant.taxi</h1>
          <p className={s.subtitle}>CONTROL CENTER</p>
          <p className={s.lead}>
            Bine ai venit. Autentifică-te cu PIN și alege rapid zona de operare pentru monitorizare
            și dispatch.
          </p>

          {!needsLogin ? (
            <div className={s.sessionRow} aria-label="Session info">
              <span className={s.sessionPill}>
                scope <span className={s.mono}>{scope ?? "—"}</span>
              </span>
              {scope === "city" && scopedCityId ? (
                <span className={s.sessionPillMuted}>
                  city <span className={s.mono}>{scopedCityId}</span>
                </span>
              ) : (
                <span className={s.sessionPillMuted}>HQ access</span>
              )}

              <button className={s.sessionBtn} type="button" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className={s.ctaSection} aria-label="Primary actions">
        {needsLogin ? (
          <div className={s.panelCard} aria-label="Login panel">
            <div className={s.panelKicker}>AUTH</div>
            <div className={s.panelTitle}>PIN Login</div>
            <div className={s.panelDesc}>
              DEV = PROD: fără fallback implicit. PIN-urile sunt în{" "}
              <span className={s.mono}>.env</span>.
            </div>

            <form className={s.form} onSubmit={onLogin} aria-label="Login form">
              <div className={s.field}>
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
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="pin">
                  PIN
                </label>
                <input
                  id="pin"
                  className={s.input}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="ex: 1234"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>

              <button className={s.primaryBtn} type="submit" disabled={busy}>
                {busy ? "Se verifică…" : "Intră"}
              </button>
            </form>

            {error ? (
              <div className={s.alert} role="status" aria-live="polite">
                {error}
              </div>
            ) : null}
          </div>
        ) : (
          <div className={s.panelCard} aria-label="Cities panel">
            <div className={s.panelTopRow}>
              <div className={s.panelLeft}>
                <div className={s.panelKicker}>OPS</div>
                <div className={s.panelTitle}>Alege orașul</div>
                <div className={s.panelDesc}>
                  Lista este tenant-aware: HQ vede toate, city vede doar propriul oraș.
                </div>
              </div>

              <div className={s.panelRight}>
                <input
                  className={s.search}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Caută oraș…"
                  aria-label="Caută oraș"
                />
              </div>
            </div>

            {error ? (
              <div className={s.alert} role="status" aria-live="polite">
                {error}
              </div>
            ) : null}

            <div className={s.cityList} aria-label="Cities list">
              {filteredCities.length === 0 ? (
                <div className={s.empty}>Nu există orașe disponibile pentru acest token.</div>
              ) : (
                filteredCities.map((c) => (
                  <div key={c.id} className={s.cityRow}>
                    <div className={s.cityMeta}>
                      <div className={s.cityName}>{c.name}</div>
                      <div className={s.cityId}>
                        <span className={s.mono}>{c.id}</span>
                        {c.dispatchPhone ? (
                          <span className={s.cityPhone}>
                            dispatch <span className={s.mono}>{c.dispatchPhone}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className={s.cityActions}>
                      <a
                        className={s.cityLinkBtn}
                        href={withBase(`/ops/${encodeURIComponent(c.id)}/map`)}
                      >
                        Map
                      </a>
                      <a
                        className={s.cityLinkBtn}
                        href={withBase(`/ops/${encodeURIComponent(c.id)}/orders`)}
                      >
                        Orders
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={s.quickRow} aria-label="Quick links">
              <a className={s.quickLink} href={withBase("/ops/map")}>
                /ops/map (city picker)
              </a>
              <a className={s.quickLink} href={withBase("/ops/orders")}>
                /ops/orders (city picker)
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

// ==============================
// Exporturi
// ==============================
export default Home;
