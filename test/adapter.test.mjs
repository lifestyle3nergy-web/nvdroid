import test from "node:test";
import assert from "node:assert/strict";
import { nvidiaCandidate, redactAdapterConfiguration } from "../src/nvidia-adapter.mjs";
test("NVIDIA capacity is disabled by default",()=>assert.equal(nvidiaCandidate().available,false));
test("adapter evidence redacts secrets",()=>assert.deepEqual(redactAdapterConfiguration({endpoint:"x",apiToken:"secret"}),{endpoint:"x",apiToken:"[REDACTED]"}));
