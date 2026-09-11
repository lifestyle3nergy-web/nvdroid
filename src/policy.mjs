import { POLICY_VERSION, validateCandidate, validateRequest } from "./contracts.mjs";

function reject(candidate, reason) { return { candidateId: candidate.id, admitted: false, reason }; }

export function decide(request, candidates, policy) {
  const requestErrors = validateRequest(request);
  if (requestErrors.length) return { status: "rejected", policyVersion: POLICY_VERSION, errors: requestErrors, decisions: [] };
  const decisions = [];
  const admitted = [];
  for (const candidate of candidates) {
    const errors = validateCandidate(candidate);
    if (errors.length) { decisions.push(reject(candidate, errors.join("; "))); continue; }
    if (!request.requiredCapabilities.every(x => candidate.capabilities.includes(x))) { decisions.push(reject(candidate, "capability mismatch")); continue; }
    if (!candidate.available) { decisions.push(reject(candidate, "execution path unavailable")); continue; }
    if (candidate.latencyMs > request.maxLatencyMs) { decisions.push(reject(candidate, "latency deadline exceeded")); continue; }
    if (candidate.cost > request.maxCost) { decisions.push(reject(candidate, "cost budget exceeded")); continue; }
    if (request.batteryPct < policy.criticalBatteryPct && candidate.energyCost > policy.criticalEnergyLimit) { decisions.push(reject(candidate, "critical battery policy")); continue; }
    if (!request.humanApproved && candidate.consequential) { decisions.push(reject(candidate, "human approval required")); continue; }
    if (!policy.allowedProcessingLocations.includes(candidate.processingLocation)) { decisions.push(reject(candidate, "processing location prohibited")); continue; }
    const meteredPenalty = request.metered ? candidate.networkCost * policy.meteredMultiplier : candidate.networkCost;
    const score = candidate.reliability * 100 - candidate.latencyMs * .05 - candidate.cost * 10 - candidate.energyCost - meteredPenalty - candidate.privacyRisk - candidate.deviceLoad;
    admitted.push({ candidateId: candidate.id, admitted: true, score: Number(score.toFixed(3)) });
  }
  admitted.sort((a,b) => b.score - a.score || a.candidateId.localeCompare(b.candidateId));
  decisions.push(...admitted);
  return {
    status: admitted.length ? "selected" : "no-admissible-path",
    policyVersion: POLICY_VERSION,
    selectedCandidateId: admitted[0]?.candidateId ?? null,
    decisions
  };
}
