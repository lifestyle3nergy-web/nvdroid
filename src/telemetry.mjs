import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const ALLOWED = new Set(["taskId", "candidateId", "status", "durationMs", "latencyMs", "transport", "metered", "batteryPct", "policyVersion"]);
export function sanitizeTelemetry(attributes = {}) {
  return Object.fromEntries(Object.entries(attributes).filter(([key, value]) => ALLOWED.has(key) && ["string", "number", "boolean"].includes(typeof value)));
}
export async function recordTelemetry(name, attributes, output = "telemetry/events.ndjson") {
  if (!/^[a-z][a-z0-9.-]{2,63}$/.test(name)) throw new Error("invalid telemetry event name");
  const event = { schemaVersion: 1, name, observedAt: new Date().toISOString(), attributes: sanitizeTelemetry(attributes) };
  await mkdir(dirname(output), { recursive: true });
  await appendFile(output, `${JSON.stringify(event)}\n`, { mode: 0o600 });
  return event;
}
