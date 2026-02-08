import express from "express";
import type { OrderStatus } from "@taxi/shared";

const app = express();

app.get("/health", (_req, res) => {
  const status: OrderStatus = "DRAFT";
  res.status(200).json({ ok: true, sharedStatus: status });
});

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(`[api] listening on :${port}`);
});
