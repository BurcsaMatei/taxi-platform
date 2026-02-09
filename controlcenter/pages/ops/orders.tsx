// controlcenter/pages/ops/orders.tsx

// ==============================
// Imports
// ==============================
import * as React from "react";

import type { GeoPoint, RealtimeEnvelope } from "@taxi/shared";
import { topics } from "@taxi/shared";

import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as shell from "../../styles/ops/opsShell.css";
import * as t from "../../styles/ops/opsOrders.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";

// ==============================
// Types
// ==============================
type OrderRow = {
  orderId: string;
  createdAtIso: string; // event.ts
  updatedAtIso: string; // last event.ts
  status: string;

  // future-ready (momentan lipsesc din payload)
  userId: string | null;
  notes: string | null;
  indicativ: string | null;

  pickup: GeoPoint;
  dropoff: GeoPoint;
};

// ==============================
// Utils
// ==============================
function toDateTimeParts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: "" };

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  return { date: `${y}-${m}-${dd}`, time: `${hh}:${mm}:${ss}` };
}

function fmtPoint(p: GeoPoint): string {
  return `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`;
}

function applyEnvelopeToRows(
  map: Map<string, OrderRow>,
  env: RealtimeEnvelope,
): void {
  if (env.name === "order.created") {
    const { orderId, pickup, dropoff, status } = env.payload;

    map.set(orderId, {
      orderId,
      createdAtIso: env.ts,
      updatedAtIso: env.ts,
      status,
      userId: null,
      notes: null,
      indicativ: null,
      pickup,
      dropoff,
    });

    return;
  }

  if (env.name === "order.statusChanged") {
    const { orderId, toStatus } = env.payload;
    const prev = map.get(orderId);

    if (!prev) {
      // dacă primim statusChanged înainte de created (dev), inițializăm minimal
      map.set(orderId, {
        orderId,
        createdAtIso: env.ts,
        updatedAtIso: env.ts,
        status: toStatus,
        userId: null,
        notes: null,
        indicativ: null,
        pickup: { lat: 0, lng: 0 },
        dropoff: { lat: 0, lng: 0 },
      });
      return;
    }

    map.set(orderId, {
      ...prev,
      updatedAtIso: env.ts,
      status: toStatus,
    });
  }
}

// ==============================
// Component
// ==============================
export default function OpsOrdersPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const rows = React.useMemo(() => {
    const map = new Map<string, OrderRow>();

    for (const e of events) {
      if (e.name !== "order.created" && e.name !== "order.statusChanged") continue;
      applyEnvelopeToRows(map, e);
    }

    // sort: newest updated first
    const list = Array.from(map.values());
    list.sort((a, b) => (a.updatedAtIso < b.updatedAtIso ? 1 : -1));
    return list;
  }, [events]);

  return (
    <div className={shell.root}>
      <div className={shell.topBar}>
        <h1 className={shell.title}>OPS / Orders</h1>

        <div className={shell.meta}>
          <span className={shell.pill}>
            <span className={`${shell.dot} ${connected ? shell.dotOn : ""}`} aria-hidden="true" />
            connected: {connected ? "true" : "false"}
          </span>

          <span className={shell.pill}>ready: {ready ? "true" : "false"}</span>

          <span className={shell.pill}>
            cityId: <span className={shell.mono}>{CITY_ID}</span>
          </span>

          <span className={shell.pill}>
            topic: <span className={shell.mono}>{topic}</span>
          </span>

          <span className={`${shell.pill} ${t.badgeMuted}`}>
            error: {lastError ?? "—"}
          </span>
        </div>
      </div>

      <div className={shell.content}>
        <section aria-label="Realtime orders table">
          <div className={t.tableWrap}>
            {rows.length === 0 ? (
              <div className={t.empty}>No events yet. Trimite POST /orders pe API.</div>
            ) : (
              <table className={t.table}>
                <thead className={t.thead}>
                  <tr>
                    <th className={t.th}>Date</th>
                    <th className={t.th}>Time</th>
                    <th className={t.th}>User</th>
                    <th className={t.th}>Pickup</th>
                    <th className={t.th}>Dropoff</th>
                    <th className={t.th}>Notes</th>
                    <th className={t.th}>Indicativ</th>
                    <th className={t.th}>Order</th>
                    <th className={t.th}>Status</th>
                    <th className={t.th}>Updated</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => {
                    const created = toDateTimeParts(r.createdAtIso);
                    const updated = toDateTimeParts(r.updatedAtIso);

                    return (
                      <tr key={r.orderId} className={t.trHover}>
                        <td className={`${t.td} ${t.cellMono}`}>{created.date}</td>
                        <td className={`${t.td} ${t.cellMono}`}>{created.time}</td>

                        <td className={t.td}>
                          <div className={t.rowSplit}>
                            <span className={t.cellMono}>{r.userId ?? "—"}</span>
                            <span className={t.small}>future: userId</span>
                          </div>
                        </td>

                        <td className={t.td}>
                          <div className={t.rowSplit}>
                            <span className={t.cellMono}>{fmtPoint(r.pickup)}</span>
                            <span className={t.small}>pickup</span>
                          </div>
                        </td>

                        <td className={t.td}>
                          <div className={t.rowSplit}>
                            <span className={t.cellMono}>{fmtPoint(r.dropoff)}</span>
                            <span className={t.small}>dropoff</span>
                          </div>
                        </td>

                        <td className={t.td}>
                          <div className={t.rowSplit}>
                            <span className={t.cellMono}>{r.notes ?? "—"}</span>
                            <span className={t.small}>future: notes</span>
                          </div>
                        </td>

                        <td className={t.td}>
                          <div className={t.rowSplit}>
                            <span className={t.cellMono}>{r.indicativ ?? "—"}</span>
                            <span className={t.small}>future: indicativ</span>
                          </div>
                        </td>

                        <td className={`${t.td} ${t.cellMono}`}>{r.orderId}</td>

                        <td className={t.td}>
                          <span className={t.badge}>
                            <span className={t.cellMono}>{r.status}</span>
                          </span>
                        </td>

                        <td className={`${t.td} ${t.cellMono}`}>
                          {updated.date} {updated.time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
