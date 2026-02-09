import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocketServer, WebSocket } from "ws";
import type { RealtimeEnvelope, RealtimeTopic } from "@taxi/shared";
import { isRealtimeTopic } from "@taxi/shared";

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

function safeSend(ws: WebSocket, msg: ServerMsg): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(msg));
}

function isAllowedTopic(topic: RealtimeTopic): boolean {
  // registry simplu (azi permis “prefix-based”)
  return (
    topic.startsWith("city:") ||
    topic.startsWith("order:") ||
    topic.startsWith("driver:") ||
    topic.startsWith("controlcenter:")
  );
}

export interface RealtimeHub {
  publish(topic: RealtimeTopic, event: RealtimeEnvelope): void;
  handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void;
}

export function createRealtimeHub(): RealtimeHub {
  const wss = new WebSocketServer({ noServer: true });

  const topicSubs = new Map<RealtimeTopic, Set<WebSocket>>();
  const socketSubs = new WeakMap<WebSocket, Set<RealtimeTopic>>();

  function subscribe(ws: WebSocket, topic: RealtimeTopic): void {
    if (!isAllowedTopic(topic)) {
      safeSend(ws, { type: "error", message: "Topic not allowed" });
      return;
    }

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

    ws.on("message", (raw) => {
      let msg: unknown;
      try {
        msg = JSON.parse(String(raw));
      } catch {
        safeSend(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      if (!msg || typeof msg !== "object") {
        safeSend(ws, { type: "error", message: "Invalid message" });
        return;
      }

      const t = (msg as { type?: unknown }).type;

      if (t === "ping") {
        safeSend(ws, { type: "ready" });
        return;
      }

      if (t === "subscribe") {
        const topic = (msg as { topic?: unknown }).topic;
        if (!isRealtimeTopic(topic)) {
          safeSend(ws, { type: "error", message: "Invalid topic" });
          return;
        }
        subscribe(ws, topic);
        return;
      }

      if (t === "unsubscribe") {
        const topic = (msg as { topic?: unknown }).topic;
        if (!isRealtimeTopic(topic)) {
          safeSend(ws, { type: "error", message: "Invalid topic" });
          return;
        }
        unsubscribe(ws, topic);
        return;
      }

      safeSend(ws, { type: "error", message: "Unknown message type" });
    });

    ws.on("close", () => cleanup(ws));
    ws.on("error", () => cleanup(ws));
  });

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
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  }

  return { publish, handleUpgrade };
}
