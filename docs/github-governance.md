# GitHub governance

Protect `main` with pull requests only, one approving review, dismissal of stale approvals, resolution of conversations, signed commits where supported, linear history and no force pushes or deletion.

Require the checks named in `governance/activation-policy.json`. Do not add deployment jobs. Repository creation, rulesets and environment approvals are organisation-administration operations and must be performed by an authorised owner.

The initial component state is `FROZEN`. A successful merge produces an artifact and evidence only; it does not activate NVDROID.
