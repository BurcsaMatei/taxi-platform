// controlcenter/pages/ops/map.tsx

// ==============================
// Imports
// ==============================
import "mapbox-gl/dist/mapbox-gl.css";

import * as React from "react";

import type { RealtimeEnvelope } from "@taxi/shared";
import { topics } from "@taxi/shared";
import type { Feature, FeatureCollection, Point } from "geojson";
import type { GeoJSONSource, Map as MapboxMap } from "mapbox-gl";

import { useControlcenterTopicEvents } from "../../lib/realtime/controlcenterWs";
import * as shell from "../../styles/ops/opsShell.css";

// ==============================
// Constante
// ==============================
const CITY_ID = "baia-mare";

// Baia Mare (aprox) — îl poți muta ulterior în config/cities.
const DEFAULT_CENTER: readonly [number, number] = [23.584, 47.659]; // [lng, lat]
const DEFAULT_ZOOM = 13;

// ==============================
// Types
// ==============================
type VehiclePoint = {
  vehicleId: string;
  lng: number;
  lat: number;
  ts: string;
};

type VehicleFeatureProps = {
  vehicleId: string;
  ts: string;
};

type VehicleFeature = Feature<Point, VehicleFeatureProps>;
type VehicleFeatureCollection = FeatureCollection<Point, VehicleFeatureProps>;

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
  const sourceIdRef = React.useRef("vehicles-source");
  const layerIdRef = React.useRef("vehicles-layer");

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
        const mapboxgl = await import("mapbox-gl");
        if (disposed) return;

        mapboxgl.default.accessToken = token;

        const map = new mapboxgl.default.Map({
          container: el,
          style: "mapbox://styles/mapbox/streets-v12",
          center: DEFAULT_CENTER as unknown as [number, number],
          zoom: DEFAULT_ZOOM,
        });

        mapRef.current = map;

        map.addControl(new mapboxgl.default.NavigationControl({ visualizePitch: true }), "top-right");

        map.on("load", () => {
          if (disposed) return;

          setState({ ok: true, error: null });

          const sourceId = sourceIdRef.current;
          const layerId = layerIdRef.current;

          if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
          }

          if (!map.getLayer(layerId)) {
            map.addLayer({
              id: layerId,
              type: "circle",
              source: sourceId,
              paint: {
                "circle-radius": 6,
                "circle-stroke-width": 2,
                "circle-opacity": 0.9,
              },
            });
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

  // Update vehicles as GeoJSON (after map is ready)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = sourceIdRef.current;
    const src = map.getSource(sourceId) as GeoJSONSource | undefined;
    if (!src) return;

    const features: VehicleFeature[] = vehicles.map((v) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [v.lng, v.lat] },
      properties: { vehicleId: v.vehicleId, ts: v.ts },
    }));

    const data: VehicleFeatureCollection = {
      type: "FeatureCollection",
      features,
    };

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

  const counts = React.useMemo(() => {
    let created = 0;
    let statusChanged = 0;

    for (const e of events) {
      if (e.name === "order.created") created += 1;
      if (e.name === "order.statusChanged") statusChanged += 1;
    }

    return { created, statusChanged };
  }, [events]);

  const vehicles = React.useMemo(() => {
    const m = new Map<string, VehiclePoint>();

    for (const e of events) {
      const vp = getVehiclePoint(e);
      if (!vp) continue;
      m.set(vp.vehicleId, vp);
    }

    return Array.from(m.values());
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

  const mapElRef = React.useRef<HTMLDivElement>(null);
  const mapStatus = useMapboxMap(mapElRef, vehicles);

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
            <h2 className={shell.panelTitle}>Mapbox</h2>
            <span className={shell.pill}>cars online: {vehicles.length}</span>
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
              <span className={shell.pill}>vehicle.locationUpdated: {vehicles.length}</span>
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
