<h1 align="center">Taproot</h1>

<p align="center">
  <em>Leaves show symptoms. The root is where the bug began.</em>
</p>

---

A bug report points at a leaf: a crash, a failing test, a weird value. Taproot
makes the agent dig until it finds the first wrong state, fixes the owner of
that invariant, and leaves a regression guard behind.

Ponytail asks: **Does this need to exist?**  
Sheepdog asks: **Does this belong here?**  
Taproot asks: **What broke first?**

## What it stops

AI agents are good at making visible failures disappear. Taproot blocks the
quickfix shapes that pass the named test while leaving the real bug alive:

- caller-only guards for shared causes
- copied checks instead of one owner fix
- broad `except`, silent `None`, or fallback defaults
- early returns that skip real behavior
- deletion/bypass patches without causal proof
- fixture/test overfitting
- weakened assertions
- green tests without a failing-before regression

## Root laws

1. **No edit from vibes.** Reproduce the failure or name the concrete expectation.
2. **Fix the first wrong state.** Not where it finally crashes.
3. **Fix at the invariant owner.** Shared cause means shared fix.
4. **Grep callers before shared edits.** API, scheduler, worker, retry, CLI, tests.
5. **Regression must fail before and pass after.** Visible green is not proof.
6. **Patch smells are suspect.** Guards, deletions, early returns, broad catches,
   relaxed validation, sleeps, retries, and fallbacks need causal proof.
7. **Stateful systems need state checks.** Old bad data, partial success,
   idempotency, dedupe, retry, audit visibility.
8. **Contracts move together.** Schemas, payloads, routes, models, generated clients.

## Block format

```md
BLOCKED by Taproot Law 2 — First-Wrong-State Law

Symptom leaf: failing API test returns 500
Missing root: earliest wrong state not traced
Patch smell: caller guard would only hide bad normalized data

Smallest safe move:
1. Reproduce with the raw payload
2. Find the normalizer/domain owner of the violated invariant
3. Add the smallest failing regression
```

Block means **not this patch**, not **never fix it**.

## Commands

| Command | What it does |
|---|---|
| `/taproot [on | off | status]` | Set/report Taproot mode. |
| `/skill:taproot` | Load the Taproot skill directly. |

## Break-glass quickfix

Emergency mitigation is allowed only when explicitly accepted. Mark it so no
agent copies it as a pattern:

```py
# taproot: accepted symptom patch, production mitigation; root: parser owner; trigger: replace before next parser change
```

No reason, root, and trigger = not accepted.

## Install

### Claude Code

```text
/plugin marketplace add filipores/taproot
/plugin install taproot@taproot
```

### Codex

```bash
codex plugin marketplace add filipores/taproot
codex
```

Open `/plugins`, select the Taproot marketplace, install Taproot, review and
trust hooks, then start a new thread.

### Pi agent harness

```bash
pi install git:github.com/filipores/taproot
```

## Development

```bash
npm test
```

## License

MIT.
