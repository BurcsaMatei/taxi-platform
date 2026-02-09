// controlcenter/pages/ops/map.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import type { RealtimeEnvelope } from "@taxi/shared";
import { topics } from "@taxi/shared";

import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as shell from "../../styles/ops/opsShell.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";

// ==============================
// Utils
// ==============================
function isOrderEvent(e: RealtimeEnvelope): boolean {
  return e.name === "order.created" || e.name === "order.statusChanged";
}

function getOrderId(e: RealtimeEnvelope): string | null {
  if (e.name === "order.created") return e.payload.orderId;
  if (e.name === "order.statusChanged") return e.payload.orderId;
  return null;
}

// ==============================
// Component
// ==============================
export default function OpsMapPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const counts = React.useMemo(() => {
    let created = 0;
    let statusChanged = 0;

    for (const e of events) {
      if (e.name === "order.created") created += 1;
      if (e.name === "order.statusChanged") statusChanged += 1;
    }

    return { created, statusChanged };
  }, [events]);

  const lastOrderIds = React.useMemo(() => {
    const ids: string[] = [];
    for (let i = events.length - 1; i >= 0; i -= 1) {
      const e = events[i]!;
      if (!isOrderEvent(e)) continue;
      const id = getOrderId(e);
      if (!id) continue;
      ids.push(id);
      if (ids.length >= 8) break;
    }
    return ids;
  }, [events]);

  return (
    <div className={shell.root}>
      <div className={shell.topBar}>
        <h1 className={shell.title}>OPS / Map</h1>

        <div className={shell.meta}>
          <span className={shell.pill}>
            <span className={`${shell.dot} ${connected ? shell.dotOn : ""}`} aria-hidden="true" />
            connected: {connected ? "true" : "false"}
          </span>

          <span className={shell.pill}>ready: {ready ? "true" : "false"}</span>
          <span className={shell.pill}>
            cityId: <span className={shell.mono}>{CITY_ID}</span>
          </span>
        </div>
      </div>

      <div className={`${shell.content} ${shell.twoCols}`}>
        <section className={shell.panel} aria-label="Map area">
          <div className={shell.panelHeader}>
            <h2 className={shell.panelTitle}>Mapbox (placeholder)</h2>
            <span className={shell.pill}>cars online: —</span>
          </div>

          <div className={shell.panelBody}>
            <p>
              Aici intră Mapbox + layer cars online (WS stream). În acest branch păstrăm doar shell-ul
              fără integrare Mapbox.
            </p>
          </div>
        </section>

        <aside className={shell.panel} aria-label="HUD">
          <div className={shell.panelHeader}>
            <h2 className={shell.panelTitle}>HUD (realtime)</h2>
            <span className={`${shell.pill} ${shell.mono}`}>{topic}</span>
          </div>

          <div className={shell.panelBody}>
            <div className={shell.meta} style={{ display: "grid", gap: 12 }}>
              <span className={shell.pill}>order.created: {counts.created}</span>
              <span className={shell.pill}>order.statusChanged: {counts.statusChanged}</span>
              {lastError ? (
                <span className={shell.pill}>error: {lastError}</span>
              ) : (
                <span className={shell.pill}>error: —</span>
              )}
            </div>

            <div style={{ height: 16 }} />

            <h3 className={shell.panelTitle} style={{ fontSize: 14 }}>
              Last orders
            </h3>

            {lastOrderIds.length === 0 ? (
              <p>—</p>
            ) : (
              <ul>
                {lastOrderIds.map((id) => (
                  <li key={id} className={shell.mono}>
                    {id}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
