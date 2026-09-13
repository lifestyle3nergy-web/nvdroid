import test from "node:test";
import assert from "node:assert/strict";
import { omarchyGpuCandidate, kaggleGpuCandidate, nvidiaCandidate, nvidiaProviderCatalog, redactAdapterConfiguration } from "../src/nvidia-adapter.mjs";
import { localCpuCandidate } from "../src/cpu-adapter.mjs";
test("NVIDIA capacity is disabled by default",()=>assert.equal(nvidiaCandidate().available,false));
test("two NVIDIA execution targets are registered and frozen",()=>{
  const providers = nvidiaProviderCatalog();
  assert.deepEqual(providers.map(x => x.id), ["nvidia-omarchy-edge", "nvidia-kaggle-p100"]);
  assert.ok(providers.every(x => x.available === false && x.cost === 0));
  assert.equal(omarchyGpuCandidate().processingLocation, "device-edge");
  assert.equal(kaggleGpuCandidate().processingLocation, "approved-public-cloud");
});
test("adapter evidence redacts secrets",()=>assert.deepEqual(redactAdapterConfiguration({endpoint:"x",apiToken:"secret"}),{endpoint:"x",apiToken:"[REDACTED]"}));
test("adapter evidence redacts nested secrets and array entries",()=>assert.deepEqual(
  redactAdapterConfiguration({auth:{credentials:[{password:"secret",credentialRef:"runner-secret"}]}}),
  {auth:{credentials:"[REDACTED]"}}
));
test("adapter evidence preserves credential reference names",()=>assert.deepEqual(
  redactAdapterConfiguration({credentialRef:"NVIDIA_RUNNER_TOKEN"}),
  {credentialRef:"NVIDIA_RUNNER_TOKEN"}
));
test("local CPU fallback covers every NVIDIA workload without a network dependency",()=>{
  const fallback = localCpuCandidate();
  for (const provider of nvidiaProviderCatalog()) {
    assert.ok(provider.capabilities.every(capability => fallback.capabilities.includes(capability)));
  }
  assert.equal(fallback.provider, "local-cpu");
  assert.equal(fallback.available, true);
  assert.equal(fallback.networkCost, 0);
});
