export function nvidiaCandidate(overrides = {}) {
  return {
    id: "nvidia-gpu-remote",
    capabilities: ["gpu-inference", "imagery", "digital-twin"],
    available: false,
    consequential: false,
    processingLocation: "tenant-cloud",
    latencyMs: 120,
    cost: 1,
    reliability: .98,
    energyCost: 2,
    networkCost: 8,
    privacyRisk: 3,
    deviceLoad: 1,
    ...overrides
  };
}

export function redactAdapterConfiguration(config) {
  const safe = structuredClone(config);
  for (const key of Object.keys(safe)) if (/key|secret|token|password/i.test(key)) safe[key] = "[REDACTED]";
  return safe;
}
