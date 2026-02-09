// api/src/modules/realtime/index.ts

// ==============================
// Imports
// ==============================
import type { RealtimeEnvelope, RealtimeTopic } from "@taxi/shared";
import type { RealtimeHub } from "./wsServer.js";

// ==============================
// Registry
// ==============================
type TopicPrefix = "city:" | "order:" | "driver:" | "controlcenter:";

const ALLOWED_BY_PREFIX: Readonly<Record<TopicPrefix, ReadonlySet<RealtimeEnvelope["name"]>>> =
  {
    "city:": new Set<RealtimeEnvelope["name"]>(["order.created"]),
    "order:": new Set<RealtimeEnvelope["name"]>(["order.statusChanged"]),
    "driver:": new Set<RealtimeEnvelope["name"]>([]),
    "controlcenter:": new Set<RealtimeEnvelope["name"]>([
      "order.created",
      "order.statusChanged",
    ]),
  };

function topicPrefix(topic: RealtimeTopic): TopicPrefix | null {
  const idx = topic.indexOf(":");
  if (idx < 0) return null;
  const p = (topic.slice(0, idx + 1) + "") as string;

  if (p === "city:" || p === "order:" || p === "driver:" || p === "controlcenter:") {
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
    // dev guard: nu publicăm greșit pe topic greșit
    // (nu aruncăm error ca să nu rupem flow-ul)
    // eslint-disable-next-line no-console
    console.warn(`[realtime] blocked publish: ${event.name} -> ${topic}`);
    return;
  }

  hub.publish(topic, event);
}

export type { RealtimeHub };
