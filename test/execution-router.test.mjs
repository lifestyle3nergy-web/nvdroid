import test from "node:test";
import assert from "node:assert/strict";
import { executeWithRotation, InMemoryOperationStore } from "../src/execution-router.mjs";

const request = { operationId: "op-1", taskId: "task-1", payloadRef: "sha256:input", checkpointRef: "store://checkpoint-1", idempotent: true };

test("rotates to the second provider without losing operation state", async () => {
  const calls = [];
  const result = await executeWithRotation({
    request,
    providerIds: ["nvidia-omarchy-edge", "nvidia-kaggle-p100"],
    invoke: async input => {
      calls.push(input);
      if (input.providerId === "nvidia-omarchy-edge") throw Object.assign(new Error("edge offline"), { retrySafe: true });
      return { artifactRef: "sha256:output", checkpointRef: "store://checkpoint-2" };
    }
  });
  assert.equal(result.status, "succeeded");
  assert.equal(result.selectedProviderId, "nvidia-kaggle-p100");
  assert.equal(result.attempts.length, 2);
  assert.ok(calls.every(call => call.idempotencyKey === "op-1"));
});

test("fails closed when a provider result is ambiguous", async () => {
  let calls = 0;
  const result = await executeWithRotation({
    request: { ...request, operationId: "op-2" },
    providerIds: ["nvidia-omarchy-edge", "nvidia-kaggle-p100"],
    invoke: async () => { calls += 1; throw new Error("timeout after dispatch"); }
  });
  assert.equal(result.status, "reconciliation-required");
  assert.equal(calls, 1);
});

test("reuses a completed operation instead of executing twice", async () => {
  const store = new InMemoryOperationStore();
  let calls = 0;
  const input = { request: { ...request, operationId: "op-3" }, providerIds: ["a", "b"], store, invoke: async () => { calls += 1; return { artifactRef: "sha256:done" }; } };
  await executeWithRotation(input);
  await executeWithRotation(input);
  assert.equal(calls, 1);
});
