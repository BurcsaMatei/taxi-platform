import http from "node:http";
import express from "express";
import type { OrderStatus } from "@taxi/shared";
import { createRealtimeHub } from "./modules/realtime/wsServer.js";

const app = express();

app.get("/health", (_req, res) => {
  const status: OrderStatus = "DRAFT";
  res.status(200).json({ ok: true, sharedStatus: status });
});

const port = Number(process.env.PORT || 3001);

const server = http.createServer(app);
const hub = createRealtimeHub();

server.on("upgrade", (req, socket, head) => {
  hub.handleUpgrade(req, socket, head);
});

server.listen(port, () => {
  console.log(`[api] listening on :${port} (http + ws /ws)`);
});
