const FALLBACK_CAPABILITIES = ["gpu-inference", "imagery", "digital-twin"];

export function localCpuCandidate(overrides = {}) {
  return {
    id: "local-cpu-fallback",
    provider: "local-cpu",
    runtime: "node",
    capabilities: FALLBACK_CAPABILITIES,
    available: true,
    consequential: false,
    processingLocation: "device",
    latencyMs: 450,
    cost: 0,
    reliability: 0.9,
    energyCost: 2,
    networkCost: 0,
    privacyRisk: 0,
    deviceLoad: 8,
    ...overrides
  };
}
