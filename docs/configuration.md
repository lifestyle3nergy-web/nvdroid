# Configuration

Policy is committed in `config/policy.json`. Secrets must be supplied to the remote runner through its secret manager and represented only by a reference. Task JSON must never carry credentials.

An NVIDIA execution path is enabled only when its health check succeeds, its processing location is permitted and the workload requires a declared GPU capability. CPU/local fallback remains part of each production deployment plan.
