# TWGT integration contract

NVDROID is an adapter and Android control surface. It does not own orchestration, policy, durable task state, identity, secrets or model selection.

| Boundary | Authoritative owner | NVDROID responsibility |
|---|---|---|
| Task and execution graph | TWGT Runtime | Submit and display status |
| Admission and provider score | Intelligence Router | Publish capability/cost/health facts |
| Durable operation state | TWGT database | Use operation IDs, payload references and checkpoints |
| Provider credentials | TWGT secret boundary | Accept only injected credential references |
| Audit and telemetry | TWGT / Swarm-Mind-Console | Emit redacted attempts, durations and outcomes |
| Build evidence | GitHub | Preserve commit, checks, artifact digest and approval |

## Rotation invariant

Provider memory is never the system of record. Before dispatch, TWGT persists the operation ID, task ID, immutable payload digest, current checkpoint and provider attempt. Every provider receives the same idempotency key. Rotation is permitted only after an explicitly retry-safe failure and only for idempotent or checkpointed workloads.

An unknown result after dispatch is `reconciliation-required`, not retryable. This prevents duplicate inference side effects or competing geospatial writes.

## Provider targets

1. `nvidia-omarchy-edge`: local CUDA/TensorRT execution on an already-owned x86_64 NVIDIA workstation running the [`lifestyle3nergy-web/omarchy`](https://github.com/lifestyle3nergy-web/omarchy) fork. Omarchy already detects NVIDIA PCIe hardware and installs its selected DKMS driver/utilities. CUDA/TensorRT remain a separately validated NVDROID layer. NVIDIA software can be available without a separate runtime charge, but hardware is not free.
2. `nvidia-kaggle-p100`: hosted Kaggle Notebook acceleration. Kaggle documents free NVIDIA Tesla P100 access, subject to quota and capacity. It is appropriate for development, research and recoverable batch work—not an availability-guaranteed production service.

Both providers remain disabled until an ADR, compatibility evidence, privacy review, CodeQL, Dependency Review, CI and human approval pass.

## Omarchy boundary

The Omarchy fork is pinned through `config/host-profiles.json`; a moving branch name is never sufficient deployment evidence. It is classified as a TWGT `TOOL`, not the `NUCLEUS`. Omarchy owns the operator workstation, NVIDIA driver and local process host. It cannot choose providers, store authoritative task state, receive raw long-lived secrets or bypass TWGT admission.

The reviewed Omarchy commit detects NVIDIA hardware with `lspci` and selects `nvidia-open-dkms`/`nvidia-utils` or its legacy driver branch. That proves graphics-driver accommodation, not CUDA/TensorRT compatibility. Activation therefore requires a separate matrix covering kernel, driver, CUDA, TensorRT, GPU compute capability and container toolkit versions. Jetson is not represented by this Omarchy profile because Jetson is an ARM/Linux-for-Tegra platform rather than the reviewed PCIe workstation path.

## Activation sequence

1. Register both adapters as `FROZEN` in the TWGT repository catalog.
2. Validate the pinned Omarchy host against the NVIDIA compatibility matrix, then implement provider-specific runners outside the neutral rotation core.
3. Store payloads, checkpoints and artifacts in a provider-neutral durable store.
4. Run conformance, failover, privacy, quota-exhaustion and ambiguous-result tests.
5. Activate only one bounded workload class with manual approval and rollback evidence.

## Sources

- [NVIDIA TensorRT documentation](https://docs.nvidia.com/deeplearning/tensorrt/)
- [NVIDIA JetPack SDK](https://developer.nvidia.com/embedded/jetpack)
- [Kaggle efficient GPU usage](https://www.kaggle.com/docs/efficient-gpu-usage)
- [Google Colab resource limits](https://research.google.com/colaboratory/faq.html#resource-limits)
- [TWGT Omarchy fork](https://github.com/lifestyle3nergy-web/omarchy)
