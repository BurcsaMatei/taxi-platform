import express from "express";
const app = express();
app.get("/health", (_req, res) => {
    const status = "DRAFT";
    res.status(200).json({ ok: true, sharedStatus: status });
});
const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`[api] listening on :${port}`);
});
