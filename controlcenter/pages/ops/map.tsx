// controlcenter/pages/ops/map.tsx

// ==============================
// Imports
// ==============================
import "mapbox-gl/dist/mapbox-gl.css";

import type { OrderStatus, RealtimeEnvelope } from "@taxi/shared";
import { isActiveOrderStatus, topics } from "@taxi/shared";
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

// focus default (safe)
const FOCUS_ZOOM = 15.5;

// considerăm “online” dacă a trimis touch (presence/location) în ultimele 60s
const ONLINE_TTL_MS = 60_000;

// icon local (public/)
const TAXI_ICON_SRC = "/images/taxi/taxi.png";
const TAXI_ICON_ID = "taxi-icon";

const SOURCE_ID = "vehicles-source";
const LAYER_ID = "vehicles-layer";

// ==============================
// Types
// ==============================
type FleetVehicle = {
  vehicleId: string; // indicativ (ex: "01")
  indicativLabel: string; // ex: "INDICATIV 01"
  plateNumber: string; // ex: "MM01ABC"
  driverName: string; // ex: "IACOB MARIUS"
  carModel: string; // ex: "RENAUL MEGANE"
  carImagePath: string; // path (frontend asset)
  driverImagePath: string; // path (frontend asset)
};

type FleetResponse = {
  ok: true;
  cityId: string;
  total: number;
  vehicles: ReadonlyArray<FleetVehicle>;
};

type CityPublic = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  isActive: boolean;
  dispatchPhone?: string;
};

type CityResponseOk = {
  ok: true;
  city: CityPublic;
};

type VehiclePoint = {
  vehicleId: string; // "01".."250" (indicativ)
  lng: number;
  lat: number;
  ts: string; // ISO
};

type VehiclePresence = {
  vehicleId: string;
  online: boolean;
  ts: string; // ISO
};

type OrderAssigned = {
  orderId: string;
  vehicleId: string;
  ts: string; // ISO
};

type OrderStatusSnap = {
  orderId: string;
  status: OrderStatus;
  ts: string; // ISO
};

type DriverUiStatus = "OFFLINE" | "ONLINE" | "BUSY";

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

function fmtIsoLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${dd} ${hh}:${mm}:${ss}`;
}

function fmtAge(nowMs: number, iso: string): string {
  const ts = parseIsoMs(iso);
  const diff = Math.max(0, nowMs - ts);

  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function toTelHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const cleaned = trimmed.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  return `tel:${cleaned}`;
}

function normalizeIndicativInput(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  const digits = s.replace(/[^\d]/g, "");
  if (!digits) return "";

  // common: "5" -> "05"
  if (digits.length === 1) return `0${digits}`;
  return digits;
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

function getVehiclePresence(e: RealtimeEnvelope): VehiclePresence | null {
  if (e.name !== "vehicle.presenceChanged") return null;

  return {
    vehicleId: e.payload.vehicleId,
    online: e.payload.online,
    ts: e.ts,
  };
}

function getOrderAssigned(e: RealtimeEnvelope): OrderAssigned | null {
  if (e.name !== "order.assigned") return null;

  return {
    orderId: e.payload.orderId,
    vehicleId: e.payload.vehicleId,
    ts: e.ts,
  };
}

function getOrderStatusSnap(e: RealtimeEnvelope): OrderStatusSnap | null {
  if (e.name === "order.created") {
    return { orderId: e.payload.orderId, status: e.payload.status, ts: e.ts };
  }

  if (e.name === "order.statusChanged") {
    return { orderId: e.payload.orderId, status: e.payload.toStatus, ts: e.ts };
  }

  return null;
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

async function fetchFleetDirectory(cityId: string): Promise<FleetResponse> {
  const url = `/api/fleet/${encodeURIComponent(cityId)}`;

  const res = await fetch(url, { method: "GET" });
  const data = (await res.json()) as unknown;

  if (!res.ok) {
    throw new Error("Fleet proxy error");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid fleet response");
  }

  const d = data as Partial<FleetResponse>;
  if (!d.ok || !Array.isArray(d.vehicles)) {
    throw new Error("Fleet endpoint returned error");
  }

  return d as FleetResponse;
}

async function fetchCity(cityId: string): Promise<CityPublic> {
  const url = `/api/cities/${encodeURIComponent(cityId)}`;

  const res = await fetch(url, { method: "GET" });
  const data = (await res.json()) as unknown;

  if (!res.ok) {
    throw new Error("City proxy error");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid city response");
  }

  const d = data as Partial<CityResponseOk>;
  if (!d.ok || !d.city || typeof d.city !== "object") {
    throw new Error("City endpoint returned error");
  }

  return d.city as CityPublic;
}

// ==============================
// Mapbox (client-only)
// ==============================
function useMapboxMap(
  containerRef: React.RefObject<HTMLDivElement>,
  vehiclesForRender: ReadonlyArray<VehiclePoint>,
  vehiclesForSearch: ReadonlyArray<VehiclePoint>,
  onSelectVehicleId: (vehicleId: string) => void,
): {
  ok: boolean;
  error: string | null;
  focusVehicle: (vehicleId: string) => boolean;
  resetView: () => void;
} {
  const [state, setState] = React.useState<{ ok: boolean; error: string | null }>({
    ok: false,
    error: null,
  });

  const mapRef = React.useRef<MapboxMap | null>(null);

  // ✅ SEARCH map: last known point (even if old)
  const vehiclesRef = React.useRef<Map<string, VehiclePoint>>(new Map<string, VehiclePoint>());

  const onSelectRef = React.useRef(onSelectVehicleId);
  onSelectRef.current = onSelectVehicleId;

  React.useEffect(() => {
    const m = new Map<string, VehiclePoint>();
    for (const v of vehiclesForSearch) m.set(v.vehicleId, v);
    vehiclesRef.current = m;
  }, [vehiclesForSearch]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || token.trim().length === 0) {
      setState({
        ok: false,
        error: "Missing NEXT_PUBLIC_MAPBOX_TOKEN in controlcenter/.env.local",
      });
      return;
    }

    let disposed = false;

    (async () => {
      try {
        const raw = (await import("mapbox-gl")) as unknown;
        const m = raw as MapboxModule;
        if (disposed) return;

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
            if (!map.hasImage(TAXI_ICON_ID)) {
              const img = await loadMapImage(map, TAXI_ICON_SRC);
              if (!disposed && !map.hasImage(TAXI_ICON_ID)) {
                map.addImage(TAXI_ICON_ID, img as never);
              }
            }

            if (!map.getSource(SOURCE_ID)) {
              map.addSource(SOURCE_ID, {
                type: "geojson",
                data: { type: "FeatureCollection", features: [] },
              });
            }

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

            map.on("click", LAYER_ID, (ev) => {
              const f = ev.features && ev.features[0];
              if (!f) return;

              const props = f.properties as unknown;
              if (!props || typeof props !== "object") return;

              const v = props as { vehicleId?: unknown };
              if (typeof v.vehicleId !== "string" || v.vehicleId.trim().length === 0) return;

              onSelectRef.current(v.vehicleId);
            });

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

  // ✅ render only ONLINE markers (as before)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!src) return;

    const features: VehicleFeature[] = vehiclesForRender.map((v) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [v.lng, v.lat] },
      properties: { vehicleId: v.vehicleId, ts: v.ts },
    }));

    const data: VehicleFeatureCollection = { type: "FeatureCollection", features };
    src.setData(data);
  }, [vehiclesForRender]);

  const focusVehicle = React.useCallback((vehicleId: string): boolean => {
    const map = mapRef.current;
    if (!map) return false;

    const v = vehiclesRef.current.get(vehicleId);
    if (!v) return false;

    try {
      map.flyTo({
        center: [v.lng, v.lat],
        zoom: FOCUS_ZOOM,
        essential: true,
      });
      onSelectRef.current(vehicleId);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetView = React.useCallback((): void => {
    const map = mapRef.current;
    if (!map) return;

    try {
      map.flyTo({
        center: DEFAULT_CENTER as unknown as [number, number],
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    } catch {
      // ignore
    }
  }, []);

  return { ok: state.ok, error: state.error, focusVehicle, resetView };
}

// ==============================
// Component
// ==============================
export default function OpsMapPage(): React.JSX.Element {
  const topic = topics.controlcenter(CITY_ID);
  const { connected, ready, lastError, events } = useControlcenterTopicEvents(topic);

  const now = useNowTick(1000);

  const [fleet, setFleet] = React.useState<ReadonlyArray<FleetVehicle>>([]);
  const [fleetError, setFleetError] = React.useState<string | null>(null);

  const [city, setCity] = React.useState<CityPublic | null>(null);
  const [cityError, setCityError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetchFleetDirectory(CITY_ID);
        if (!alive) return;

        setFleet(r.vehicles);
        setFleetError(null);
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : "Failed to load fleet directory";
        setFleet([]);
        setFleetError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const c = await fetchCity(CITY_ID);
        if (!alive) return;

        setCity(c);
        setCityError(null);
      } catch (err) {
        if (!alive) return;
        const msg = err instanceof Error ? err.message : "Failed to load city info";
        setCity(null);
        setCityError(msg);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const fleetById = React.useMemo(() => {
    const m = new globalThis.Map<string, FleetVehicle>();
    for (const v of fleet) m.set(v.vehicleId, v);
    return m;
  }, [fleet]);

  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);

  const latestPresenceById = React.useMemo(() => {
    const byId = new globalThis.Map<string, VehiclePresence>();

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
    const byId = new globalThis.Map<string, VehiclePoint>();

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
    const byOrder = new globalThis.Map<string, OrderAssigned>();

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
    const byOrder = new globalThis.Map<string, OrderStatusSnap>();

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

  // ✅ online if we have a recent location within TTL
  // ✅ exclude if explicit presence=false is recent enough
  const vehiclesOnline = React.useMemo(() => {
    const out: VehiclePoint[] = [];

    for (const [vehicleId, p] of latestPointById.entries()) {
      const pMs = parseIsoMs(p.ts);
      if (now - pMs > ONLINE_TTL_MS) continue;

      const pres = latestPresenceById.get(vehicleId);
      if (pres) {
        const presMs = parseIsoMs(pres.ts);
        if (pres.online === false && now - presMs <= ONLINE_TTL_MS) continue;
      }

      out.push(p);
    }

    return out;
  }, [latestPointById, latestPresenceById, now]);

  // ✅ search in ALL latest points (online + offline)
  const vehiclesForSearch = React.useMemo(
    () => Array.from(latestPointById.values()),
    [latestPointById],
  );

  const onlineCount = vehiclesOnline.length;
  const offlineCount = Math.max(0, FLEET_TOTAL - onlineCount);

  const selectedVehicle = selectedVehicleId ? (fleetById.get(selectedVehicleId) ?? null) : null;

  const selectedDriverStatus: DriverUiStatus = React.useMemo(() => {
    if (!selectedVehicleId) return "OFFLINE";

    // 1) OFFLINE / ONLINE by last touch
    const p = latestPointById.get(selectedVehicleId);
    const pres = latestPresenceById.get(selectedVehicleId);

    const pMs = p ? parseIsoMs(p.ts) : 0;
    const presMs = pres ? parseIsoMs(pres.ts) : 0;

    const hasRecentPoint = !!p && now - pMs <= ONLINE_TTL_MS;
    const hasRecentOffline = !!pres && pres.online === false && now - presMs <= ONLINE_TTL_MS;

    if (!hasRecentPoint || hasRecentOffline) return "OFFLINE";

    // 2) BUSY if any assigned order for this vehicle is ACTIVE
    for (const a of latestAssignedByOrderId.values()) {
      if (a.vehicleId !== selectedVehicleId) continue;

      const st = latestStatusByOrderId.get(a.orderId);
      const status = st?.status ?? "ASSIGNED";

      if (isActiveOrderStatus(status)) return "BUSY";
    }

    return "ONLINE";
  }, [
    latestAssignedByOrderId,
    latestPointById,
    latestPresenceById,
    latestStatusByOrderId,
    now,
    selectedVehicleId,
  ]);

  const tel = city?.dispatchPhone ? toTelHref(city.dispatchPhone) : "";

  // ==============================
  // Map controls state
  // ==============================
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchHint, setSearchHint] = React.useState<string>("");

  const mapElRef = React.useRef<HTMLDivElement>(null);
  const mapStatus = useMapboxMap(mapElRef, vehiclesOnline, vehiclesForSearch, (vehicleId) => {
    setSelectedVehicleId(vehicleId);
  });

  const computeOnlineStatusForVehicle = React.useCallback(
    (vehicleId: string): { online: boolean; lastSeenIso: string } | null => {
      const p = latestPointById.get(vehicleId);
      if (!p) return null;

      const pres = latestPresenceById.get(vehicleId);

      const pMs = parseIsoMs(p.ts);
      const presMs = pres ? parseIsoMs(pres.ts) : 0;

      const hasRecentPoint = now - pMs <= ONLINE_TTL_MS;
      const hasRecentOffline = !!pres && pres.online === false && now - presMs <= ONLINE_TTL_MS;

      return { online: hasRecentPoint && !hasRecentOffline, lastSeenIso: p.ts };
    },
    [latestPointById, latestPresenceById, now],
  );

  const onSubmitSearch = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();

      const normalized = normalizeIndicativInput(searchValue);
      if (!normalized) {
        setSearchHint("Introduce indicativ (ex: 05).");
        return;
      }

      const candidates = [normalized, normalized.replace(/^0+/, "")].filter(Boolean);

      let focusedId: string | null = null;
      for (const cand of candidates) {
        if (mapStatus.focusVehicle(cand)) {
          focusedId = cand;
          break;
        }
      }

      if (!focusedId) {
        setSearchHint(`Indicativ negăsit: ${normalized} (nu există locație în stream)`);
        return;
      }

      const snap = computeOnlineStatusForVehicle(focusedId);
      if (!snap) {
        setSearchHint(`Indicativ găsit: ${focusedId} — fără lastSeen (unexpected)`);
        return;
      }

      const lastSeen = fmtIsoLocal(snap.lastSeenIso);
      const age = fmtAge(now, snap.lastSeenIso);

      setSearchHint(
        snap.online
          ? `Indicativ ${focusedId}: ONLINE · last seen ${age} ago (${lastSeen})`
          : `Indicativ ${focusedId}: OFFLINE · last seen ${age} ago (${lastSeen})`,
      );
    },
    [computeOnlineStatusForVehicle, mapStatus, now, searchValue],
  );

  const onReset = React.useCallback(() => {
    mapStatus.resetView();
    setSearchHint("");
  }, [mapStatus]);

  return (
    <div className={shell.root}>
      <div className={shell.topBar}>
        <h1 className={shell.title}>OPS / Map</h1>

        <div className={shell.mapControls}>
          <form
            className={shell.mapSearchForm}
            onSubmit={onSubmitSearch}
            role="search"
            aria-label="Caută indicativ"
          >
            <input
              className={`${shell.mapSearchInput} ${shell.mono}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              inputMode="numeric"
              placeholder="Caută indicativ (ex: 05)"
              aria-label="Indicativ"
            />
            <button className={`${shell.mapBtn} ${shell.mapBtnPrimary}`} type="submit">
              Caută
            </button>
          </form>

          <button className={shell.mapBtn} type="button" onClick={onReset}>
            Reset map
          </button>

          {searchHint ? (
            <span className={shell.mapHint} role="status" aria-live="polite">
              {searchHint}
            </span>
          ) : null}
        </div>

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

          <span className={shell.pill}>
            events: <span className={shell.mono}>{events.length}</span>
          </span>
          <span className={shell.pill}>
            lastPoints: <span className={shell.mono}>{latestPointById.size}</span>
          </span>
          <span className={shell.pill}>
            lastPresence: <span className={shell.mono}>{latestPresenceById.size}</span>
          </span>

          {fleetError ? (
            <span className={shell.pill}>fleet: error</span>
          ) : (
            <span className={shell.pill}>fleet: ok</span>
          )}
          {cityError ? (
            <span className={shell.pill}>city: error</span>
          ) : (
            <span className={shell.pill}>city: ok</span>
          )}
          {tel ? (
            <a className={`${shell.pill} ${shell.mono}`} href={tel}>
              dispatch: {city?.dispatchPhone}
            </a>
          ) : null}
          {lastError ? (
            <span className={shell.pill}>error: {lastError}</span>
          ) : (
            <span className={shell.pill}>error: —</span>
          )}
          {mapStatus.error ? (
            <span className={shell.pill}>map: error</span>
          ) : (
            <span className={shell.pill}>map: ok</span>
          )}
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
            {fleetError ? <p className={shell.mono}>fleet error: {fleetError}</p> : null}
            {cityError ? <p className={shell.mono}>city error: {cityError}</p> : null}

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
            <div className={shell.hudGrid}>
              <span className={shell.pill}>vehicle.online: {onlineCount}</span>
              <span className={shell.pill}>vehicle.offline: {offlineCount}</span>
              {lastError ? (
                <span className={shell.pill}>error: {lastError}</span>
              ) : (
                <span className={shell.pill}>error: —</span>
              )}
            </div>

            <div className={shell.spacerSm} />

            <h3 className={shell.hudSubTitle}>Selected vehicle</h3>

            {selectedVehicle ? (
              <div className={shell.selectedCard}>
                <div className={shell.selectedRow}>
                  <span className={shell.selectedLabel}>Indicativ</span>
                  <span className={`${shell.selectedValue} ${shell.mono}`}>
                    {selectedVehicle.vehicleId}
                  </span>
                </div>

                <div className={shell.selectedRow}>
                  <span className={shell.selectedLabel}>Nr</span>
                  <span className={`${shell.selectedValue} ${shell.mono}`}>
                    {selectedVehicle.plateNumber}
                  </span>
                </div>

                <div className={shell.selectedRow}>
                  <span className={shell.selectedLabel}>Șofer</span>
                  <span className={shell.selectedValue}>{selectedVehicle.driverName}</span>
                </div>

                <div className={shell.selectedRow}>
                  <span className={shell.selectedLabel}>Status șofer</span>
                  <span className={`${shell.selectedValue} ${shell.mono}`}>
                    {selectedDriverStatus}
                  </span>
                </div>

                <div className={shell.selectedRow}>
                  <span className={shell.selectedLabel}>Mașină</span>
                  <span className={shell.selectedValue}>{selectedVehicle.carModel}</span>
                </div>
              </div>
            ) : (
              <p className={shell.selectedHint}>
                Click pe un marker pentru detalii (indicativ / nr / șofer / model).
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
