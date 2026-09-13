export function validateConfiguration({ packageJson, policy, providers, hosts, activationPolicy }) {
  if (Object.keys(packageJson.dependencies ?? {}).length !== 0) throw new Error("core nucleus must have zero production dependencies");
  if (!Array.isArray(policy.allowedProcessingLocations) || !policy.allowedProcessingLocations.length) throw new Error("allowedProcessingLocations is required");
  if (providers.activation !== "FROZEN") throw new Error("provider activation must remain FROZEN");
  const acceleratedProviders = providers.providers.filter(provider => provider.id.startsWith("nvidia-"));
  if (acceleratedProviders.some(provider => provider.enabled !== false)) throw new Error("NVIDIA providers must be disabled");
  const cpuFallback = providers.providers.find(provider => provider.id === "local-cpu-fallback");
  if (!cpuFallback?.enabled || acceleratedProviders.some(provider => provider.fallbackProviderId !== cpuFallback.id)) throw new Error("every NVIDIA provider requires the enabled local CPU fallback");
  if (new Set(providers.providers.map(provider => provider.id)).size !== providers.providers.length) throw new Error("provider ids must be unique");
  if (hosts.profiles.some(host => host.state !== "FROZEN" || !/^[0-9a-f]{40}$/.test(host.verifiedCommit))) throw new Error("host profiles require a frozen 40-character commit pin");
  if (activationPolicy.component !== "NVDROID" || activationPolicy.initialState !== "FROZEN") throw new Error("NVDROID activation policy must remain FROZEN");
  if (activationPolicy.automaticDeployment !== false) throw new Error("automatic deployment must remain disabled");
}
