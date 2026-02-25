// controlcenter/components/ops/auth/OpsPinGate.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import {
  clearStoredControlcenterToken,
  decodeControlcenterTokenPayloadUnsafe,
  getStoredControlcenterToken,
  isControlcenterTokenExpired,
  loginControlcenter,
  setStoredControlcenterToken,
} from "../../../lib/auth/controlcenterAuth";
import * as c from "../../../styles/ops/opsCityPicker.css";
import * as g from "../../../styles/ops/opsPinGate.css";

// ==============================
// Types
// ==============================
export type OpsPinGateProps = {
  cityId: string;
  title: string;
};

// ==============================
// Component
// ==============================
export default function OpsPinGate(props: OpsPinGateProps): React.JSX.Element {
  const { cityId, title } = props;

  const [pin, setPin] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const storedToken = React.useMemo(() => getStoredControlcenterToken(), []);
  const storedPayload = React.useMemo(
    () => (storedToken ? decodeControlcenterTokenPayloadUnsafe(storedToken) : null),
    [storedToken],
  );

  const mismatch =
    storedPayload?.scope === "city" && typeof storedPayload.cityId === "string"
      ? storedPayload.cityId !== cityId
      : false;

  const expired = storedPayload ? isControlcenterTokenExpired(storedPayload) : false;

  const onLogout = React.useCallback(() => {
    clearStoredControlcenterToken();
    setError("");
    setPin("");
    window.location.reload();
  }, []);

  const onSubmit = React.useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();

      const p = pin.trim();
      if (!p) {
        setError("Introduce PIN.");
        return;
      }

      setBusy(true);
      setError("");

      try {
        const r = await loginControlcenter(cityId, p);
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

  return (
    <div className={g.overlay} role="dialog" aria-label="PIN gate">
      <section className={`${c.card} ${g.card}`} aria-label="Control Center PIN gate">
        <h1 className={c.title}>{title}</h1>

        <p className={c.subtitle}>
          City: <span className={c.mono}>{cityId}</span>
        </p>

        {mismatch ? (
          <div className={g.warn} role="status" aria-live="polite">
            Token-ul curent este pentru city <b>{storedPayload?.cityId}</b>. Pentru acest oraș
            trebuie login din nou.
          </div>
        ) : null}

        {expired ? (
          <div className={g.warn} role="status" aria-live="polite">
            Token expirat. Fă login din nou.
          </div>
        ) : null}

        <form className={c.form} onSubmit={onSubmit} aria-label="PIN form">
          <label className={c.label} htmlFor="pin">
            PIN
          </label>
          <input
            id="pin"
            className={c.input}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ex: 1234"
            inputMode="numeric"
            autoComplete="off"
          />
          <button className={c.btn} type="submit" disabled={busy}>
            {busy ? "Se verifică…" : "Intră"}
          </button>
        </form>

        {error ? (
          <div className={c.error} role="status" aria-live="polite">
            {error}
          </div>
        ) : null}

        <div className={g.actions}>
          <button className={g.linkBtn} type="button" onClick={onLogout}>
            Logout (șterge token)
          </button>
        </div>
      </section>
    </div>
  );
}
