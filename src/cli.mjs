import { readFile } from "node:fs/promises";
import { decide } from "./policy.mjs";
import { recordTelemetry } from "./telemetry.mjs";

const input = JSON.parse(await readFile(process.argv[2], "utf8"));
const started = performance.now();
const result = decide(input.request, input.candidates, input.policy);
await recordTelemetry("nvdroid.decision", { taskId: input.request?.taskId, candidateId: result.selectedCandidateId ?? "none", status: result.status, durationMs: Number((performance.now()-started).toFixed(3)), transport: input.request?.transport, metered: input.request?.metered, batteryPct: input.request?.batteryPct, policyVersion: result.policyVersion });
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exitCode = result.status === "selected" ? 0 : 2;
