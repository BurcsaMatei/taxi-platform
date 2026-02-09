// api/src/modules/realtime/wsServer.ts

// ==============================
// Imports
// ==============================
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import type { Duplex } from "node:stream";
import { WebSocket, WebSocketServer } from "ws";
import type { RealtimeEnvelope, RealtimeTopic } from "@taxi/shared";
import { isRealtimeTopic } from "@taxi/shared";

// ==============================
// Types
// ==============================
type ClientMsg =
  | { type: "subscribe"; topic: RealtimeTopic }
  | { type: "unsubscribe"; topic: RealtimeTopic }
  | { type: "ping" };

type ServerMsg =
  | { type: "ready" }
  | { type: "subscribed"; topic: RealtimeTopic }
  | { type: "unsubscribed"; topic: RealtimeTopic }
  | { type: "event"; topic: RealtimeTopic; event: RealtimeEnvelope }
  | { type: "error"; message: string };

export interface RealtimeHub {
  publish(topic: RealtimeTopic, event: RealtimeEnvelope): void;
  handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void;
}

// ==============================
// Utils
// ==============================
function safeSend(ws: WebSocket, msg: ServerMsg): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(msg));
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function parseClientMsg(raw: unknown): ClientMsg | null {
  if (!isObject(raw)) return null;

  const type = raw.type;
  if (type === "ping") return { type: "ping" };

  if (type === "subscribe" || type === "unsubscribe") {
    const topic = raw.topic;
    if (!isRealtimeTopic(topic)) return null;

    return type === "subscribe"
      ? { type: "subscribe", topic }
      : { type: "unsubscribe", topic };
  }

  return null;
}

// ==============================
// Hub
// ==============================
export function createRealtimeHub(): RealtimeHub {
  const wss = new WebSocketServer({ noServer: true });

  // topic -> sockets
  const topicSubs = new Map<RealtimeTopic, Set<WebSocket>>();
  // socket -> topics
  const socketSubs = new WeakMap<WebSocket, Set<RealtimeTopic>>();

  function subscribe(ws: WebSocket, topic: RealtimeTopic): void {
    let set = topicSubs.get(topic);
    if (!set) {
      set = new Set<WebSocket>();
      topicSubs.set(topic, set);
    }
    set.add(ws);

    let mine = socketSubs.get(ws);
    if (!mine) {
      mine = new Set<RealtimeTopic>();
      socketSubs.set(ws, mine);
    }
    mine.add(topic);

    safeSend(ws, { type: "subscribed", topic });
  }

  function unsubscribe(ws: WebSocket, topic: RealtimeTopic): void {
    const set = topicSubs.get(topic);
    if (set) {
      set.delete(ws);
      if (set.size === 0) topicSubs.delete(topic);
    }

    const mine = socketSubs.get(ws);
    if (mine) mine.delete(topic);

    safeSend(ws, { type: "unsubscribed", topic });
  }

  function cleanup(ws: WebSocket): void {
    const mine = socketSubs.get(ws);
    if (!mine) return;

    for (const t of mine) {
      const set = topicSubs.get(t);
      if (set) {
        set.delete(ws);
        if (set.size === 0) topicSubs.delete(t);
      }
    }
  }

  wss.on("connection", (ws) => {
    safeSend(ws, { type: "ready" });

    ws.on("message", (buf) => {
      let decoded: unknown;

      try {
        decoded = JSON.parse(String(buf));
      } catch {
        safeSend(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      const msg = parseClientMsg(decoded);
      if (!msg) {
        safeSend(ws, { type: "error", message: "Invalid message" });
        return;
      }

      if (msg.type === "ping") {
        safeSend(ws, { type: "ready" });
        return;
      }

      if (msg.type === "subscribe") {
        subscribe(ws, msg.topic);
        return;
      }

      unsubscribe(ws, msg.topic);
    });

    ws.on("close", () => cleanup(ws));
    ws.on("error", () => cleanup(ws));
  });

  // keepalive
  const interval = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }
  }, 30_000);

  wss.on("close", () => clearInterval(interval));

  function publish(topic: RealtimeTopic, event: RealtimeEnvelope): void {
    const set = topicSubs.get(topic);
    if (!set) return;

    for (const ws of set) safeSend(ws, { type: "event", topic, event });
  }

  function handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void {
    const url = req.url || "";
    if (!url.startsWith("/ws")) {
      socket.destroy();
      return;
    }

    // ws typings expect net.Socket; node http upgrade provides Duplex.
    const netSocket = socket as unknown as Socket;

    wss.handleUpgrade(req, netSocket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  }

  return { publish, handleUpgrade };
}
