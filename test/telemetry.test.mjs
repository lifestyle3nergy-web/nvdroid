import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeTelemetry } from "../src/telemetry.mjs";
test("telemetry preserves only approved operational fields",()=>assert.deepEqual(sanitizeTelemetry({taskId:"t1",durationMs:3,apiToken:"secret",prompt:"private"}),{taskId:"t1",durationMs:3}));
