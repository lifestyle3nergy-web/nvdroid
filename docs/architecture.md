# Architecture

`Android observation → TWGT admission → deterministic filters → path scoring → local/CPU/GPU execution → signed result → evidence`

NVDROID owns the thin-client contract and decision evidence. TWGT- owns governance and shared contracts. AI-OS owns task execution. Intelligent-Nexus owns optional model routing. Swarm-Mind-Console owns operational telemetry. The NVIDIA adapter owns only provider translation and health.

GeForce NOW is a design reference, not a runtime dependency. NVDROID never automates, embeds or attempts to extend the GeForce NOW client.
