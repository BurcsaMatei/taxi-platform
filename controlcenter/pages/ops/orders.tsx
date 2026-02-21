// controlcenter/pages/ops/orders.tsx

// ==============================
// Imports
// ==============================
import type { GeoPoint, OrderStatus, RealtimeEnvelope } from "@taxi/shared";
import { isActiveOrderStatus, topics } from "@taxi/shared";
import * as React from "react";

import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as t from "../../styles/ops/opsOrders.css";
import * as shell from "../../styles/ops/opsShell.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";
const ONLINE_TTL_MS = 60_000;

// ==============================
// Types
// ==============================
type DispatchFail = {
  orderId: string;
  reason: string;
  ts: string;
};

type CallSnap = {
  orderId: string;
  phoneNumber: string;
  source: string;
  ts: string;
};

type OrderRow = {
  orderId: string;
  createdAtIso: string; // event.ts
  updatedAtIso: string; // last event.ts
  status: OrderStatus;

  userId: string | null;
  notes: string | null;
  indicativ: string | null;

  dispatch: "OK" | "FAILED" | "—";
  dispatchReason: string | null;

  calledAtIso: string | null;
  calledPhone: string | null;
  calledSource: string | null;

  pickup: GeoPoint;
  dropoff: GeoPoint;
};

type VehiclePoint = {
  vehicleId: string;
  ts: string;
};

type VehiclePresence = {
  vehicleId: string;
  online: boolean;
  ts: string;
};

type OrderAssigned = {
  orderId: string;
  vehicleId: string;
  ts: string;
};

type OrderStatusSnap = {
  orderId: string;
  status: OrderStatus;
  ts: string;
};

type VehicleUiStatus = "OFFLINE" | "AVAILABLE" | "BUSY";

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

function parseIsoMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Date.now();
}

function getVehiclePoint(e: RealtimeEnvelope): VehiclePoint | null {
  if (e.name !== "vehicle.locationUpdated") return null;
  if (e.payload.cityId !== CITY_ID) return null;

  return {
    vehicleId: e.payload.vehicleId,
    ts: e.ts,
  };
}

function getVehiclePresence(e: RealtimeEnvelope): VehiclePresence | null {
  if (e.name !== "vehicle.presenceChanged") return null;
  if (e.payload.cityId !== CITY_ID) return null;

  return {
    vehicleId: e.payload.vehicleId,
    online: e.payload.online,
    ts: e.ts,
  };
}

function getOrderAssigned(e: RealtimeEnvelope): OrderAssigned | null {
  if (e.name !== "order.assigned") return null;
  if (e.payload.cityId !== CITY_ID) return null;

  return {
    orderId: e.payload.orderId,
    vehicleId: e.payload.vehicleId,
    ts: e.ts,
  };
}

function getOrderStatusSnap(e: RealtimeEnvelope): OrderStatusSnap | null {
  if (e.name === "order.created") {
    if (e.payload.cityId !== CITY_ID) return null;
    return { orderId: e.payload.orderId, status: e.payload.status, ts: e.ts };
  }

  if (e.name === "order.statusChanged") {
    if (e.payload.cityId !== CITY_ID) return null;
    return { orderId: e.payload.orderId, status: e.payload.toStatus, ts: e.ts };
  }

  return null;
}

function getDispatchFail(e: RealtimeEnvelope): DispatchFail | null {
  if (e.name !== "order.dispatchFailed") return null;

  const payload = e.payload as unknown;
  if (!payload || typeof payload !== "object") return null;

  const p = payload as { orderId?: unknown; cityId?: unknown; reason?: unknown };
  if (p.cityId !== CITY_ID) return null;
  if (typeof p.orderId !== "string" || p.orderId.trim().length === 0) return null;

  const reason = typeof p.reason === "string" && p.reason.trim().length > 0 ? p.reason : "UNKNOWN";
  return { orderId: p.orderId, reason, ts: e.ts };
}

function getCallSnap(e: RealtimeEnvelope): CallSnap | null {
  if (e.name !== "order.userCalledDispatch") return null;

  const payload = e.payload as unknown;
  if (!payload || typeof payload !== "object") return null;

  const p = payload as {
    orderId?: unknown;
    cityId?: unknown;
    phoneNumber?: unknown;
    source?: unknown;
  };

  if (p.cityId !== CITY_ID) return null;
  if (typeof p.orderId !== "string" || p.orderId.trim().length === 0) return null;

  const phoneNumber = typeof p.phoneNumber === "string" ? p.phoneNumber.trim() : "";
  const source = typeof p.source === "string" ? p.source.trim() : "";
  if (!phoneNumber) return null;

  return {
    orderId: p.orderId,
    phoneNumber,
    source: source || "USER_APP",
    ts: e.ts,
  };
}

function applyEnvelopeToRows(map: Map<string, OrderRow>, env: RealtimeEnvelope): void {
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

      dispatch: "—",
      dispatchReason: null,

      calledAtIso: null,
      calledPhone: null,
      calledSource: null,

      pickup,
      dropoff,
    });

    return;
  }

  if (env.name === "order.dispatchFailed") {
    const f = getDispatchFail(env);
    if (!f) return;

    const prev = map.get(f.orderId);
    if (!prev) {
      map.set(f.orderId, {
        orderId: f.orderId,
        createdAtIso: f.ts,
        updatedAtIso: f.ts,
        status: "NEW",
        userId: null,
        notes: null,
        indicativ: null,

        dispatch: "FAILED",
        dispatchReason: f.reason,

        calledAtIso: null,
        calledPhone: null,
        calledSource: null,

        pickup: { lat: 0, lng: 0 },
        dropoff: { lat: 0, lng: 0 },
      });
      return;
    }

    map.set(f.orderId, {
      ...prev,
      updatedAtIso: f.ts,
      dispatch: "FAILED",
      dispatchReason: f.reason,
    });

    return;
  }

  if (env.name === "order.userCalledDispatch") {
    const c = getCallSnap(env);
    if (!c) return;

    const prev = map.get(c.orderId);
    if (!prev) {
      map.set(c.orderId, {
        orderId: c.orderId,
        createdAtIso: c.ts,
        updatedAtIso: c.ts,
        status: "NEW",
        userId: null,
        notes: null,
        indicativ: null,

        dispatch: "—",
        dispatchReason: null,

        calledAtIso: c.ts,
        calledPhone: c.phoneNumber,
        calledSource: c.source,

        pickup: { lat: 0, lng: 0 },
        dropoff: { lat: 0, lng: 0 },
      });
      return;
    }

    map.set(c.orderId, {
      ...prev,
      updatedAtIso: c.ts,
      calledAtIso: c.ts,
      calledPhone: c.phoneNumber,
      calledSource: c.source,
    });

    return;
  }

  if (env.name === "order.assigned") {
    const { orderId, vehicleId } = env.payload;
    const prev = map.get(orderId);

    if (!prev) {
      map.set(orderId, {
        orderId,
        createdAtIso: env.ts,
        updatedAtIso: env.ts,
        status: "NEW",
        userId: null,
        notes: null,
        indicativ: vehicleId,

        dispatch: "OK",
        dispatchReason: null,

        calledAtIso: null,
        calledPhone: null,
        calledSource: null,

        pickup: { lat: 0, lng: 0 },
        dropoff: { lat: 0, lng: 0 },
      });
      return;
    }

    map.set(orderId, {
      ...prev,
      updatedAtIso: env.ts,
      indicativ: vehicleId,
      dispatch: "OK",
      dispatchReason: null,
    });

    return;
  }

  if (env.name === "order.statusChanged") {
    const { orderId, toStatus } = env.payload;
    const prev = map.get(orderId);

    if (!prev) {
      map.set(orderId, {
        orderId,
        createdAtIso: env.ts,
        updatedAtIso: env.ts,
        status: toStatus,
        userId: null,
        notes: null,
        indicativ: null,

        dispatch: "—",
        dispatchReason: null,

        calledAtIso: null,
        calledPhone: null,
        calledSource: null,

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

function computeVehicleOnlineNow(
  vehicleId: string,
  nowMs: number,
  latestPointById: Map<string, VehiclePoint>,
  latestPresenceById: Map<string, VehiclePresence>,
): boolean {
  const p = latestPointById.get(vehicleId);
  if (!p) return false;

  const pMs = parseIsoMs(p.ts);
  if (nowMs - pMs > ONLINE_TTL_MS) return false;

  const pres = latestPresenceById.get(vehicleId);
  if (pres) {
    const presMs = parseIsoMs(pres.ts);
    // dacă avem offline recent, îl considerăm offline
    if (pres.online === false && nowMs - presMs <= ONLINE_TTL_MS) return false;
  }

  return true;
}

// ==============================
// Component
// ==============================
export default function OpsOrdersPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const nowMs = Date.now();

  const latestPresenceById = React.useMemo(() => {
    const byId = new Map<string, VehiclePresence>();

    for (const e of events) {
      const vp = getVehiclePresence(e);
      if (!vp) continue;

      const prev = byId.get(vp.vehicleId);
      if (!prev || parseIsoMs(vp.ts) >= parseIsoMs(prev.ts)) {
        byId.set(vp.vehicleId, vp);
      }
    }

    return byId;
  }, [events]);

  const latestPointById = React.useMemo(() => {
    const byId = new Map<string, VehiclePoint>();

    for (const e of events) {
      const p = getVehiclePoint(e);
      if (!p) continue;

      const prev = byId.get(p.vehicleId);
      if (!prev || parseIsoMs(p.ts) >= parseIsoMs(prev.ts)) {
        byId.set(p.vehicleId, p);
      }
    }

    return byId;
  }, [events]);

  const latestAssignedByOrderId = React.useMemo(() => {
    const byOrder = new Map<string, OrderAssigned>();

    for (const e of events) {
      const a = getOrderAssigned(e);
      if (!a) continue;

      const prev = byOrder.get(a.orderId);
      if (!prev || parseIsoMs(a.ts) >= parseIsoMs(prev.ts)) {
        byOrder.set(a.orderId, a);
      }
    }

    return byOrder;
  }, [events]);

  const latestStatusByOrderId = React.useMemo(() => {
    const byOrder = new Map<string, OrderStatusSnap>();

    for (const e of events) {
      const s = getOrderStatusSnap(e);
      if (!s) continue;

      const prev = byOrder.get(s.orderId);
      if (!prev || parseIsoMs(s.ts) >= parseIsoMs(prev.ts)) {
        byOrder.set(s.orderId, s);
      }
    }

    return byOrder;
  }, [events]);

  // ✅ semantic perfect BUSY:
  // vehicle is BUSY if it has at least one assigned order with ACTIVE status.
  const busyVehicleIds = React.useMemo(() => {
    const busy = new Set<string>();

    for (const a of latestAssignedByOrderId.values()) {
      const st = latestStatusByOrderId.get(a.orderId);
      const status = st?.status ?? "ASSIGNED";
      if (isActiveOrderStatus(status)) busy.add(a.vehicleId);
    }

    return busy;
  }, [latestAssignedByOrderId, latestStatusByOrderId]);

  const rows = React.useMemo(() => {
    const map = new Map<string, OrderRow>();

    for (const e of events) {
      if (
        e.name !== "order.created" &&
        e.name !== "order.statusChanged" &&
        e.name !== "order.assigned" &&
        e.name !== "order.dispatchFailed" &&
        e.name !== "order.userCalledDispatch"
      )
        continue;

      applyEnvelopeToRows(map, e);
    }

    const list = Array.from(map.values());
    list.sort((a, b) => (a.updatedAtIso < b.updatedAtIso ? 1 : -1));
    return list;
  }, [events]);

  const getVehicleStatusForRow = React.useCallback(
    (r: OrderRow): VehicleUiStatus | "—" => {
      if (!r.indicativ) return "—";

      const online = computeVehicleOnlineNow(r.indicativ, nowMs, latestPointById, latestPresenceById);
      if (!online) return "OFFLINE";

      return busyVehicleIds.has(r.indicativ) ? "BUSY" : "AVAILABLE";
    },
    [busyVehicleIds, latestPointById, latestPresenceById, nowMs],
  );

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

          <span className={`${shell.pill} ${t.badgeMuted}`}>error: {lastError ?? "—"}</span>
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
                    <th className={t.th}>Vehicle</th>
                    <th className={t.th}>Dispatch</th>
                    <th className={t.th}>Call</th>
                    <th className={t.th}>Order</th>
                    <th className={t.th}>Status</th>
                    <th className={t.th}>Updated</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => {
                    const created = toDateTimeParts(r.createdAtIso);
                    const updated = toDateTimeParts(r.updatedAtIso);
                    const vStatus = getVehicleStatusForRow(r);

                    const called = r.calledAtIso ? toDateTimeParts(r.calledAtIso) : null;

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
                            <span className={t.small}>realtime: order.assigned</span>
                          </div>
                        </td>

                        <td className={t.td}>
                          {vStatus === "—" ? (
                            <span className={t.cellMono}>—</span>
                          ) : (
                            <span className={t.badge}>
                              <span className={t.cellMono}>{vStatus}</span>
                            </span>
                          )}
                        </td>

                        <td className={t.td}>
                          {r.dispatch === "—" ? (
                            <span className={t.cellMono}>—</span>
                          ) : r.dispatch === "OK" ? (
                            <span className={t.badge}>
                              <span className={t.cellMono}>OK</span>
                            </span>
                          ) : (
                            <div className={t.rowSplit}>
                              <span className={t.badge}>
                                <span className={t.cellMono}>FAILED</span>
                              </span>
                              <span className={t.small}>{r.dispatchReason ?? "NO_AVAILABLE_VEHICLE"}</span>
                            </div>
                          )}
                        </td>

                        <td className={t.td}>
                          {!called ? (
                            <span className={t.cellMono}>—</span>
                          ) : (
                            <div className={t.rowSplit}>
                              <span className={t.badge}>
                                <span className={t.cellMono}>CALLED</span>
                              </span>
                              <span className={t.small}>
                                {called.date} {called.time} · {r.calledPhone ?? "—"} · {r.calledSource ?? "USER_APP"}
                              </span>
                            </div>
                          )}
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