# nvdroid

Short description

TWGT’s governed Android thin-client and remote-compute service, providing deterministic workload routing across Android edge, CPU cloud, GitHub runners and optional NVIDIA GPU infrastructure.

Repository purpose

NVDROID connects Android devices to TWGT’s execution architecture without making the phone responsible for heavy compilation, imagery processing or AI workloads.

Core flow:

Android observes → TWGT admits → NVDROID selects path → runtime executes → GitHub records → telemetry verifies

NVDROID is not a GeForce NOW integration. It adopts the thin-client principle while using TWGT-controlled infrastructure, contracts and evidence.

GitHub settings

Owner: lifestyle3nergy-web

Visibility: Public

Default branch: main

Initialise repository: Yes

README: Yes

.gitignore: None

Licence: None


The import bundle contains these files.

Topics

twgt
nvdroid
android
termux
nvidia
edge-computing
remote-compute
policy-engine
workload-routing
github-actions
telemetry
digital-twin

Technical requirements

Node.js 20 or 22

NodeNext-compatible ES modules

Zero production dependencies for the initial nucleus

Deterministic configuration validation

Syntax compilation using node --check

Node built-in test runner

Policy-first admission before scoring

NVIDIA execution disabled by default

No credentials in requests, logs or evidence

CPU or local fallback for every NVIDIA workload

Android zero-root compatibility

Metering independent from network transport

Human approval for consequential actions


Required commands

npm ci
npm run configure
npm run compile
npm test
npm run validate
npm run evidence

Required branch protection

Protect main with:

Pull requests required

At least one approving review

Code-owner review required

Dismiss stale approvals

Conversation resolution required

Branch must be current before merging

Required status checks

Linear history

Force pushes disabled

Branch deletion disabled

Administrator bypass restricted

Manual merge only

Auto-merge disabled


Required status checks

NVDROID CI / validate
CodeQL / Analyze (javascript-typescript)
CodeQL / Analyze (actions)
Dependency Review / dependency-review

Confirm the exact names after their first successful runs before locking the ruleset.

Security requirements

Enable secret scanning

Enable push protection

Enable Dependabot alerts

Enable Dependabot security updates

Run CodeQL on pull requests, main and Monday at 03:00 UTC

Fail dependency review on high or critical findings

Require read-only workflow permissions by default

Grant security-events: write only to CodeQL

Never place NVIDIA keys in committed configuration

Keep provider credentials in runner or deployment secret storage

Produce SHA-256 build evidence


Activation requirements

Initial state:

{
  "component": "NVDROID",
  "state": "FROZEN",
  "automaticDeployment": false
}

Activation requires:

Successful required checks on the exact candidate SHA

Zero high or critical security findings

One approving code-owner review

Signed architecture decision record

TWGT compatibility confirmation

Android device validation

CPU/local fallback test

NVIDIA adapter failure test

Manual environment approval

Recorded rollback pin


A successful merge creates a verified artifact only. It must not automatically deploy or activate NVDROID.

 Repository Description

> TWGT governed Android thin-client and remote-compute service with deterministic policy-first routing, verifiable GitHub builds, edge-aware execution and optional NVIDIA GPU acceleration.
