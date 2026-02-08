import { WebSocketServer, WebSocket } from "ws";
import { isRealtimeTopic } from "@taxi/shared";
function safeSend(ws, msg) {
    if (ws.readyState !== WebSocket.OPEN)
        return;
    ws.send(JSON.stringify(msg));
}
export function createRealtimeHub() {
    const wss = new WebSocketServer({ noServer: true });
    const topicSubs = new Map();
    const socketSubs = new WeakMap();
    function subscribe(ws, topic) {
        let set = topicSubs.get(topic);
        if (!set) {
            set = new Set();
            topicSubs.set(topic, set);
        }
        set.add(ws);
        let mine = socketSubs.get(ws);
        if (!mine) {
            mine = new Set();
            socketSubs.set(ws, mine);
        }
        mine.add(topic);
        safeSend(ws, { type: "subscribed", topic });
    }
    function unsubscribe(ws, topic) {
        const set = topicSubs.get(topic);
        if (set) {
            set.delete(ws);
            if (set.size === 0)
                topicSubs.delete(topic);
        }
        const mine = socketSubs.get(ws);
        if (mine)
            mine.delete(topic);
        safeSend(ws, { type: "unsubscribed", topic });
    }
    function cleanup(ws) {
        const mine = socketSubs.get(ws);
        if (!mine)
            return;
        for (const t of mine) {
            const set = topicSubs.get(t);
            if (set) {
                set.delete(ws);
                if (set.size === 0)
                    topicSubs.delete(t);
            }
        }
    }
    wss.on("connection", (ws) => {
        safeSend(ws, { type: "ready" });
        ws.on("message", (raw) => {
            let msg;
            try {
                msg = JSON.parse(String(raw));
            }
            catch {
                safeSend(ws, { type: "error", message: "Invalid JSON" });
                return;
            }
            if (!msg || typeof msg !== "object") {
                safeSend(ws, { type: "error", message: "Invalid message" });
                return;
            }
            const t = msg.type;
            if (t === "ping") {
                safeSend(ws, { type: "ready" });
                return;
            }
            if (t === "subscribe") {
                const topic = msg.topic;
                if (!isRealtimeTopic(topic)) {
                    safeSend(ws, { type: "error", message: "Invalid topic" });
                    return;
                }
                subscribe(ws, topic);
                return;
            }
            if (t === "unsubscribe") {
                const topic = msg.topic;
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
            if (ws.readyState === WebSocket.OPEN)
                ws.ping();
        }
    }, 30_000);
    wss.on("close", () => clearInterval(interval));
    function publish(topic, event) {
        const set = topicSubs.get(topic);
        if (!set)
            return;
        for (const ws of set)
            safeSend(ws, { type: "event", topic, event });
    }
    function handleUpgrade(req, socket, head) {
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
