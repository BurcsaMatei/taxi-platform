import type { RealtimeTopic } from "@taxi/shared";
import { topics } from "@taxi/shared";
import React from "react";

type LogItem = { ts: string; text: string };

function wsUrl(): string {
  const proto = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
  const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
  // api e pe 3001 în dev local
  const apiHost = host.includes("localhost") ? "localhost:3001" : host.replace(":3000", ":3001");
  return `${proto}://${apiHost}/ws`;
}

export default function DevRealtime(): JSX.Element {
  const [items, setItems] = React.useState<LogItem[]>([]);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const cityId = "baia-mare";
    const topic: RealtimeTopic = topics.controlcenter(cityId);

    const url = wsUrl();
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "subscribe", topic }));
      setItems((p) => [{ ts: new Date().toISOString(), text: `connected: ${url} (sub ${topic})` }, ...p]);
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (ev) => {
      setItems((p) => [{ ts: new Date().toISOString(), text: String(ev.data) }, ...p].slice(0, 60));
    };

    return () => ws.close();
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ margin: 0 }}>Dev Realtime</h1>
      <p style={{ marginTop: 8 }}>connected: {String(connected)}</p>
      <p style={{ marginTop: 8 }}>Test: POST /orders pe API și vezi event aici.</p>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
        {items.map((x) => `${x.ts}  ${x.text}`).join("\n")}
      </pre>
    </main>
  );
}
