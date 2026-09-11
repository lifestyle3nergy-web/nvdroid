# NVDROID

TWGT’s governed Android thin-client and remote-compute service, providing deterministic workload routing across Android edge, CPU cloud, GitHub runners and optional NVIDIA GPU infrastructure.

NVDROID connects Android devices to TWGT’s execution architecture without making the phone responsible for heavy compilation, imagery processing or AI workloads.

`Android observes → TWGT admits → NVDROID selects path → runtime executes → GitHub records → telemetry verifies`

NVDROID is not a GeForce NOW integration. It applies the thin-client pattern to TWGT-controlled development and operational infrastructure.

## TWGT and Omarchy boundaries

TWGT owns orchestration, admission policy, durable task state, identity, secrets, model selection and audit authority. NVDROID owns the thin-client contract, provider translation and decision evidence.

[`lifestyle3nergy-web/omarchy`](https://github.com/lifestyle3nergy-web/omarchy) is an optional, commit-pinned x86_64 workstation and local NVIDIA process host. It is classified as a frozen TWGT `TOOL`, never the nucleus or control plane.

The two initial NVIDIA targets are:

- `nvidia-omarchy-edge`: no additional compute charge when suitable NVIDIA hardware is already owned; hardware is not free.
- `nvidia-kaggle-p100`: free hosted notebook quota subject to provider limits and availability; not an availability-guaranteed production service.

Both providers are disabled by default. Provider memory is never authoritative. Rotation requires an idempotent or checkpointed request, an immutable operation binding and an explicitly retry-safe failure. Ambiguous execution results remain locked in `reconciliation-required` until an authorised reconciliation process resolves them.

## Topics

`twgt` · `nvdroid` · `android` · `termux` · `nvidia` · `omarchy` · `edge-computing` · `remote-compute` · `policy-engine` · `workload-routing` · `github-actions` · `telemetry` · `digital-twin`

## Technical requirements

- Node.js 20 or 22.
- NodeNext-compatible ES modules.
- Zero production dependencies for the initial nucleus.
- Deterministic configuration validation.
- Syntax compilation using `node --check`.
- Node built-in test runner.
- Policy-first admission before scoring.
- NVIDIA execution disabled by default.
- CPU or local fallback for every NVIDIA workload.
- No credentials in requests, logs or evidence.
- Android zero-root compatibility.
- Metering independent from network transport.
- Human approval for consequential actions.
- Provider-neutral operation IDs, payload references, checkpoints and artifact references.
- Immutable request digest bound to each operation ID.
- Ambiguous operations fail closed and cannot rotate on a later invocation.

## Configure, compile and test

```bash
npm ci
npm run configure
npm run compile
npm test
npm run validate
npm run evidence
node src/cli.mjs examples/request.json
```

## Required branch protection

Protect `main` with:

- Pull requests required.
- At least one approving review.
- Code-owner review required.
- Dismiss stale approvals.
- Conversation resolution required.
- Branch must be current before merging.
- Required status checks.
- Linear history.
- Force pushes disabled.
- Branch deletion disabled.
- Administrator bypass restricted.
- Manual merge only; auto-merge disabled.

Required checks:

- `NVDROID CI / validate`
- `CodeQL / Analyze (javascript-typescript)`
- `CodeQL / Analyze (actions)`
- `Dependency Review / dependency-review`

Confirm the exact check names after their first successful runs before locking the ruleset.

## Security requirements

- Enable secret scanning and push protection.
- Enable Dependabot alerts and security updates.
- Run CodeQL on pull requests, `main` and Monday at 03:00 UTC.
- Fail Dependency Review on high or critical findings.
- Use read-only workflow permissions by default.
- Grant `security-events: write` only to CodeQL.
- Never commit NVIDIA or provider keys.
- Keep credentials in runner or deployment secret storage and pass only references.
- Produce commit-bound SHA-256 build evidence.

## Activation requirements

Initial state:

```json
{
  "component": "NVDROID",
  "state": "FROZEN",
  "automaticDeployment": false
}
```

Activation requires:

- Successful required checks on the exact candidate SHA.
- Zero high or critical security findings.
- One approving code-owner review.
- Signed architecture decision record.
- TWGT compatibility confirmation.
- Android device validation.
- CPU/local fallback test.
- NVIDIA adapter and quota-failure tests.
- Omarchy driver/CUDA/TensorRT compatibility evidence.
- Durable TWGT database integration test.
- Manual environment approval.
- Recorded rollback pin.

A successful merge creates a verified, frozen artifact only. It must not automatically deploy or activate NVDROID.

## Documentation

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/twgt-integration.md`](docs/twgt-integration.md)
- [`docs/configuration.md`](docs/configuration.md)
- [`docs/testing.md`](docs/testing.md)
- [`docs/github-governance.md`](docs/github-governance.md)

Repository description:

> TWGT governed Android thin-client and remote-compute service with deterministic policy-first routing, verifiable GitHub builds, edge-aware execution and optional NVIDIA GPU acceleration.
