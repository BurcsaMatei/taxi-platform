// controlcenter/pages/ops/map.tsx

// ==============================
// Imports
// ==============================
import "mapbox-gl/dist/mapbox-gl.css";

import type { RealtimeEnvelope } from "@taxi/shared";
import { topics } from "@taxi/shared";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { GeoJSONSource, IControl, Map as MapboxMap } from "mapbox-gl";
import * as React from "react";

import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as shell from "../../styles/ops/opsShell.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";
const FLEET_TOTAL = 250;

// Baia Mare (aprox)
const DEFAULT_CENTER: readonly [number, number] = [23.584, 47.659]; // [lng, lat]
const DEFAULT_ZOOM = 13;

// considerăm “online” dacă a trimis locationUpdated în ultimele 60s
const ONLINE_TTL_MS = 60_000;

// icon local (public/)
const TAXI_ICON_SRC = "/images/taxi/taxi.png";
const TAXI_ICON_ID = "taxi-icon";

const SOURCE_ID = "vehicles-source";
const LAYER_ID = "vehicles-layer";

// ==============================
// Types
// ==============================
type VehiclePoint = {
  vehicleId: string; // "01".."250" (indicativ)
  lng: number;
  lat: number;
  ts: string; // ISO
};

type VehicleFeatureProps = {
  vehicleId: string;
  ts: string;
};

type VehicleFeature = Feature<Point, VehicleFeatureProps>;
type VehicleFeatureCollection = FeatureCollection<Point, VehicleFeatureProps>;

// Minimal runtime shape for dynamic import (avoid import() type annotations)
type MapboxModule = {
  default: {
    accessToken: string;

    Map: new (opts: {
      container: HTMLElement;
      style: string;
      center: [number, number];
      zoom: number;
    }) => MapboxMap;

    NavigationControl: new (opts?: { visualizePitch?: boolean }) => IControl;
  };
};

// ==============================
// Utils
// ==============================
function parseIsoMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Date.now();
}

function isOrderEvent(e: RealtimeEnvelope): boolean {
  return e.name === "order.created" || e.name === "order.statusChanged";
}

function getOrderId(e: RealtimeEnvelope): string | null {
  if (e.name === "order.created") return e.payload.orderId;
  if (e.name === "order.statusChanged") return e.payload.orderId;
  return null;
}

function getVehiclePoint(e: RealtimeEnvelope): VehiclePoint | null {
  if (e.name !== "vehicle.locationUpdated") return null;

  const p = e.payload.point;

  return {
    vehicleId: e.payload.vehicleId,
    lng: p.lng,
    lat: p.lat,
    ts: e.ts,
  };
}

function useNowTick(ms = 1000): number {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);

  return now;
}

function loadMapImage(map: MapboxMap, url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (err, image) => {
      if (err) reject(err);
      else resolve(image);
    });
  });
}

// ==============================
// Mapbox (client-only)
// ==============================
function useMapboxMap(
  containerRef: React.RefObject<HTMLDivElement>,
  vehicles: ReadonlyArray<VehiclePoint>,
): { ok: boolean; error: string | null } {
  const [state, setState] = React.useState<{ ok: boolean; error: string | null }>({
    ok: false,
    error: null,
  });

  const mapRef = React.useRef<MapboxMap | null>(null);
  const modRef = React.useRef<MapboxModule | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token.trim().length === 0) {
      setState({ ok: false, error: "Missing NEXT_PUBLIC_MAPBOX_TOKEN in controlcenter/.env.local" });
      return;
    }

    let disposed = false;

    (async () => {
      try {
        const raw = (await import("mapbox-gl")) as unknown;
        const m = raw as MapboxModule;
        if (disposed) return;

        modRef.current = m;
        m.default.accessToken = token;

        const map = new m.default.Map({
          container: el,
          style: "mapbox://styles/mapbox/streets-v12",
          center: DEFAULT_CENTER as unknown as [number, number],
          zoom: DEFAULT_ZOOM,
        });

        mapRef.current = map;

        const nav = new m.default.NavigationControl({ visualizePitch: true });
        map.addControl(nav, "top-right");

        map.on("load", async () => {
          if (disposed) return;

          try {
            // icon
            if (!map.hasImage(TAXI_ICON_ID)) {
              const img = await loadMapImage(map, TAXI_ICON_SRC);
              if (!disposed && !map.hasImage(TAXI_ICON_ID)) {
                map.addImage(TAXI_ICON_ID, img as never);
              }
            }

            // source
            if (!map.getSource(SOURCE_ID)) {
              map.addSource(SOURCE_ID, {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [],
                },
              });
            }

            // layer: icon + label (indicativ deasupra)
            if (!map.getLayer(LAYER_ID)) {
              map.addLayer({
                id: LAYER_ID,
                type: "symbol",
                source: SOURCE_ID,
                layout: {
                  "icon-image": TAXI_ICON_ID,
                  "icon-size": 1,
                  "icon-allow-overlap": true,
                  "icon-ignore-placement": true,

                  "text-field": ["get", "vehicleId"],
                  "text-size": 12,
                  "text-anchor": "top",
                  "text-offset": [0, -1.2],
                  "text-allow-overlap": true,
                  "text-ignore-placement": true,
                },
                paint: {
                  "text-halo-color": "rgba(255,255,255,0.95)",
                  "text-halo-width": 2,
                },
              });
            }

            map.resize();
            setState({ ok: true, error: null });
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Mapbox layer init failed";
            setState({ ok: false, error: msg });
          }
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Mapbox init failed";
        setState({ ok: false, error: msg });
      }
    })();

    return () => {
      disposed = true;

      const map = mapRef.current;
      mapRef.current = null;

      try {
        map?.remove();
      } catch {
        // ignore
      }
    };
  }, [containerRef]);

  // Update GeoJSON data (after source exists)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!src) return;

    const features: VehicleFeature[] = vehicles.map((v) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [v.lng, v.lat] },
      properties: { vehicleId: v.vehicleId, ts: v.ts },
    }));

    const data: VehicleFeatureCollection = { type: "FeatureCollection", features };
    src.setData(data);
  }, [vehicles]);

  return state;
}

// ==============================
// Component
// ==============================
export default function OpsMapPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const now = useNowTick(1000);

  const counts = React.useMemo(() => {
    let created = 0;
    let statusChanged = 0;

    for (const e of events) {
      if (e.name === "order.created") created += 1;
      if (e.name === "order.statusChanged") statusChanged += 1;
    }

    return { created, statusChanged };
  }, [events]);

  const vehiclesOnline = React.useMemo(() => {
    const byId = new globalThis.Map<string, VehiclePoint>();

    for (const e of events) {
      const vp = getVehiclePoint(e);
      if (!vp) continue;

      const prev = byId.get(vp.vehicleId);
      if (!prev || parseIsoMs(vp.ts) >= parseIsoMs(prev.ts)) {
        byId.set(vp.vehicleId, vp);
      }
    }

    const out: VehiclePoint[] = [];
    for (const v of byId.values()) {
      const lastSeen = parseIsoMs(v.ts);
      const isOnline = now - lastSeen <= ONLINE_TTL_MS;
      if (!isOnline) continue;
      out.push(v);
    }

    return out;
  }, [events, now]);

  const onlineCount = vehiclesOnline.length;
  const offlineCount = Math.max(0, FLEET_TOTAL - onlineCount);

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

  const mapElRef = React.useRef<HTMLDivElement>(null);
  const mapStatus = useMapboxMap(mapElRef, vehiclesOnline);

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

          <span className={shell.pill}>fleet total: {FLEET_TOTAL}</span>
          <span className={shell.pill}>online: {onlineCount}</span>
          <span className={shell.pill}>offline: {offlineCount}</span>
        </div>
      </div>

      <div className={`${shell.content} ${shell.twoCols}`}>
        <section className={shell.panel} aria-label="Map area">
          <div className={shell.panelHeader}>
            <h2 className={shell.panelTitle}>Mapbox</h2>
            <span className={shell.pill}>cars online: {onlineCount}</span>
          </div>

          <div className={shell.panelBody}>
            {mapStatus.error ? <p className={shell.mono}>map error: {mapStatus.error}</p> : null}

            <div className={shell.mapCanvas}>
              <div ref={mapElRef} className={shell.mapFill} />
            </div>
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
              <span className={shell.pill}>vehicle.online: {onlineCount}</span>
              <span className={shell.pill}>vehicle.offline: {offlineCount}</span>
              {lastError ? <span className={shell.pill}>error: {lastError}</span> : <span className={shell.pill}>error: —</span>}
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
