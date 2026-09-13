export const POLICY_VERSION = "nvdroid-policy-1";
const SENSITIVE_KEY = /(?:credential|secret|token|password|api[-_]?key)/i;
const REFERENCE_KEY = /ref$/i;

export function containsSensitiveKey(value) {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nested]) => (SENSITIVE_KEY.test(key) && !REFERENCE_KEY.test(key)) || containsSensitiveKey(nested));
}

export function validateRequest(value) {
  const errors = [];
  if (!value || typeof value !== "object") return ["request must be an object"];
  if (containsSensitiveKey(value)) errors.push("request must contain credential references only, never credential values");
  if (!value.taskId || typeof value.taskId !== "string") errors.push("taskId must be a non-empty string");
  if (!Number.isFinite(value.maxLatencyMs) || value.maxLatencyMs < 0) errors.push("maxLatencyMs must be >= 0");
  if (!Number.isFinite(value.maxCost) || value.maxCost < 0) errors.push("maxCost must be >= 0");
  if (!Number.isFinite(value.batteryPct) || value.batteryPct < 0 || value.batteryPct > 100) errors.push("batteryPct must be between 0 and 100");
  if (typeof value.metered !== "boolean") errors.push("metered must be boolean");
  if (!value.transport || typeof value.transport !== "string") errors.push("transport must be a non-empty string");
  if (!Array.isArray(value.requiredCapabilities) || value.requiredCapabilities.length === 0) errors.push("requiredCapabilities must be non-empty");
  return errors;
}

export function validateCandidate(value) {
  const errors = [];
  if (!value?.id || typeof value.id !== "string") errors.push("candidate id must be non-empty");
  if (!Array.isArray(value?.capabilities)) errors.push("candidate capabilities must be an array");
  for (const key of ["latencyMs", "cost", "energyCost", "networkCost", "privacyRisk", "deviceLoad"]) {
    if (!Number.isFinite(value?.[key]) || value[key] < 0) errors.push(`${key} must be >= 0`);
  }
  if (!Number.isFinite(value?.reliability) || value.reliability < 0 || value.reliability > 1) errors.push("reliability must be between 0 and 1");
  return errors;
}
