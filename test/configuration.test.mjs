import test from "node:test";
import assert from "node:assert/strict";
import { validateConfiguration } from "../src/configuration.mjs";

const valid = {
  packageJson: {},
  policy: { allowedProcessingLocations: ["device"] },
  providers: { activation: "FROZEN", providers: [
    { id: "local-cpu-fallback", enabled: true },
    { id: "nvidia-edge", enabled: false, fallbackProviderId: "local-cpu-fallback" }
  ] },
  hosts: { profiles: [{ state: "FROZEN", verifiedCommit: "a".repeat(40) }] },
  activationPolicy: { component: "NVDROID", initialState: "FROZEN", automaticDeployment: false }
};

test("accepts the frozen zero-dependency nucleus",()=>assert.doesNotThrow(()=>validateConfiguration(structuredClone(valid))));
test("rejects automatic deployment",()=>assert.throws(
  ()=>validateConfiguration({...structuredClone(valid), activationPolicy:{...valid.activationPolicy, automaticDeployment:true}}),
  /automatic deployment must remain disabled/
));
test("rejects production dependencies",()=>assert.throws(
  ()=>validateConfiguration({...structuredClone(valid), packageJson:{dependencies:{client:"1.0.0"}}}),
  /zero production dependencies/
));
