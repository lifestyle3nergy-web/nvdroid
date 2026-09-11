# NVDROID

NVDROID is the bounded Android-to-remote-compute reference service for the TWGT ecosystem. Android observes and controls; the TWGT router admits and selects an execution path; GitHub records builds; optional NVIDIA capacity accelerates only declared workloads.

NVDROID is not GeForce NOW integration. It applies the thin-client pattern to owned development and operational infrastructure.

## Quick start

```bash
npm ci
npm run validate
npm run evidence
node src/cli.mjs examples/request.json
```

## Invariants

- Deterministic policy filters run before scoring.
- `metered` and `transport` are independent fields.
- NVIDIA is optional; CPU and local paths remain valid.
- No provider key is accepted in a task payload or emitted in evidence.
- Consequential execution requires explicit human approval.
- Every decision contains reasons and a policy version.

See `docs/architecture.md`, `docs/configuration.md`, `docs/testing.md` and `docs/github-governance.md`.
