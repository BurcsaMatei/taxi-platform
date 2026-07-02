// api/src/modules/realtime/index.ts

// ==============================
// Imports
// ==============================
import type { RealtimeEnvelope, RealtimeTopic } from "@taxi/shared";
import type { RealtimeHub } from "./wsServer.js";

// ==============================
// Registry
// ==============================
type TopicPrefix = "city:" | "order:" | "driver:" | "vehicle:" | "controlcenter:";

const ALLOWED_BY_PREFIX: Readonly<Record<TopicPrefix, ReadonlySet<RealtimeEnvelope["name"]>>> = {
  "city:": new Set<RealtimeEnvelope["name"]>(["order.created"]),

  "order:": new Set<RealtimeEnvelope["name"]>([
    "order.statusChanged",
    "order.assigned",
    "order.dispatchFailed",
    "order.userCalledDispatch",
    "order.accepted",
    "order.driverArrived",
    "order.tripStarted",
  ]),

  // ✅ driver lifecycle: ofertă + accept/refuz (fără churn de re-dispatch pe order:)
  "driver:": new Set<RealtimeEnvelope["name"]>(["order.offered", "order.accepted", "order.rejected"]),

  // ✅ per-vehicle stream (location + presence)
  "vehicle:": new Set<RealtimeEnvelope["name"]>(["vehicle.locationUpdated", "vehicle.presenceChanged"]),

  // ✅ controlcenter primește și presence + assigned + dispatchFailed + call intent
  "controlcenter:": new Set<RealtimeEnvelope["name"]>([
    "order.created",
    "order.statusChanged",
    "order.assigned",
    "order.dispatchFailed",
    "order.userCalledDispatch",
    "order.offered",
    "order.accepted",
    "order.rejected",
    "order.driverArrived",
    "order.tripStarted",
    "vehicle.locationUpdated",
    "vehicle.presenceChanged",
  ]),
};

function topicPrefix(topic: RealtimeTopic): TopicPrefix | null {
  const idx = topic.indexOf(":");
  if (idx < 0) return null;
  const p = (topic.slice(0, idx + 1) + "") as string;

  if (p === "city:" || p === "order:" || p === "driver:" || p === "vehicle:" || p === "controlcenter:") {
    return p;
  }
  return null;
}

function isAllowed(topic: RealtimeTopic, name: RealtimeEnvelope["name"]): boolean {
  const pref = topicPrefix(topic);
  if (!pref) return false;
  return ALLOWED_BY_PREFIX[pref].has(name);
}

// ==============================
// Publish strict
// ==============================
export function publishStrict(hub: RealtimeHub, topic: RealtimeTopic, event: RealtimeEnvelope): void {
  if (!isAllowed(topic, event.name)) {
    // eslint-disable-next-line no-console
    console.warn(`[realtime] blocked publish: ${event.name} -> ${topic}`);
    return;
  }

  hub.publish(topic, event);
}

export type { RealtimeHub };