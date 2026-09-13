const COMMON_CAPABILITIES = ["gpu-inference", "imagery", "digital-twin"];

export function omarchyGpuCandidate(overrides = {}) {
  return {
    id: "nvidia-omarchy-edge",
    provider: "nvidia-local",
    runtime: "cuda-tensorrt",
    capabilities: COMMON_CAPABILITIES,
    available: false,
    consequential: false,
    processingLocation: "device-edge",
    latencyMs: 35,
    cost: 0,
    reliability: .95,
    energyCost: 6,
    networkCost: 0,
    privacyRisk: 1,
    deviceLoad: 5,
    ...overrides
  };
}

export function kaggleGpuCandidate(overrides = {}) {
  return {
    id: "nvidia-kaggle-p100",
    provider: "kaggle",
    runtime: "notebook-gpu",
    capabilities: COMMON_CAPABILITIES,
    available: false,
    consequential: false,
    processingLocation: "approved-public-cloud",
    latencyMs: 240,
    cost: 0,
    reliability: .75,
    energyCost: 1,
    networkCost: 8,
    privacyRisk: 6,
    deviceLoad: 1,
    ...overrides
  };
}

// Compatibility alias. New integrations should register explicit providers.
export function nvidiaCandidate(overrides = {}) {
  return kaggleGpuCandidate({ id: "nvidia-gpu-remote", ...overrides });
}

export function nvidiaProviderCatalog() {
  return [omarchyGpuCandidate(), kaggleGpuCandidate()];
}

export function redactAdapterConfiguration(config) {
  if (Array.isArray(config)) return config.map(redactAdapterConfiguration);
  if (!config || typeof config !== "object") return config;
  return Object.fromEntries(Object.entries(config).map(([key, value]) => [
    key,
    /(?:credential|secret|token|password|api[-_]?key)/i.test(key) && !/ref$/i.test(key) ? "[REDACTED]" : redactAdapterConfiguration(value)
  ]));
}
