---
name: taproot-loop
description: >
  Parent-orchestrated Taproot review/fix/review loop for bug-fix diffs or a
  named target. Use when asked to run taproot loop, root-cause loop, prevent
  quickfixes, or review fixes for symptom patches and test overfitting.
---

# Taproot Loop

Loop until no fix-now root-cause blockers remain or the cap is reached. Default
cap: **3 rounds**.

## Invariants

- Parent owns orchestration, synthesis, and stop decision.
- Fresh-context reviewers are read-only.
- Exactly one writer may edit at a time.
- No child may spawn agents for this loop.
- Fix only evidence-backed symptom patches or missing regression guards.
- Preserve behavior; no feature work, broad refactor, or speculative cleanup.
- Do not weaken validation, security, business-safety, idempotency, retry,
  rate-limit, audit, or external API guards without explicit approval.

## Loop

1. Scope: current diff unless the user names a target.
2. Review with 2-3 fresh-context reviewers:
   - first wrong state / invariant owner
   - regression quality / test overfitting
   - stateful side effects / contracts when relevant
3. Synthesize only fix-now findings that prove the patch hides a symptom or
   lacks the smallest needed guard.
4. Apply the smallest safe fix: move the change to the owner, remove copied
   guards, restore swallowed errors, or add the failing-before regression.
5. Run focused tests/static checks.
6. Review again only after material changes.

Stop and ask the user when:

- the original bug cannot be reproduced or specified well enough
- multiple plausible roots need product/runtime evidence
- the only safe move is an emergency symptom patch
- the next move is broad refactor unrelated to the requested fix
- max rounds reached

## Reviewer Prompt Shape

```text
Review the current git diff/target for Taproot violations. Do not modify files.
Angle: <angle>

Find only bug-fix/root-cause issues worth fixing before done.
Each finding: severity (blocker|fix-now|optional), file/line, symptom leaf,
missing root evidence, earliest wrong state if known, invariant owner, patch
smell, smallest safe move, regression/check.

Ignore pure style and architecture-only issues. Say ROOTED if no fix-now
findings.
```

## Final output

```md
taproot-loop: clean | stopped | mitigation-needed | cap-reached
changed: <files>
root fixes: <owner moves / tests added / smells removed>
checks: <commands>
remaining: <none or blockers>
```
