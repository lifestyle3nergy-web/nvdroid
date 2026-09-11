import test from "node:test";
import assert from "node:assert/strict";
import { omarchyGpuCandidate, kaggleGpuCandidate, nvidiaCandidate, nvidiaProviderCatalog, redactAdapterConfiguration } from "../src/nvidia-adapter.mjs";
test("NVIDIA capacity is disabled by default",()=>assert.equal(nvidiaCandidate().available,false));
test("two NVIDIA execution targets are registered and frozen",()=>{
  const providers = nvidiaProviderCatalog();
  assert.deepEqual(providers.map(x => x.id), ["nvidia-omarchy-edge", "nvidia-kaggle-p100"]);
  assert.ok(providers.every(x => x.available === false && x.cost === 0));
  assert.equal(omarchyGpuCandidate().processingLocation, "device-edge");
  assert.equal(kaggleGpuCandidate().processingLocation, "approved-public-cloud");
});
test("adapter evidence redacts secrets",()=>assert.deepEqual(redactAdapterConfiguration({endpoint:"x",apiToken:"secret"}),{endpoint:"x",apiToken:"[REDACTED]"}));
