---
name: aiden-memory
description: Local Markdown memory skill for AI conversation continuity. Use only when the user asks to use or operate Aiden Memory, local memory files, memory cards, profile/deep-profile, or this Aiden_memory project; asks to choose relevant memory cards; asks to add/promote a memory; or explicitly asks to import/rebuild/summarize Claude, Codex, ChatGPT, or other AI chat exports into reviewable memory files.
---

# Aiden Memory

Use Aiden Memory to turn exported AI conversations into local, reviewable Markdown memory, then use only the relevant memory files during future tasks.

Keep the skill small in behavior:

- Import/build memory only when explicitly asked.
- Use existing memory by default.
- Route to the smallest useful profile/cards.
- Keep raw exports and personal memory private.

## First Decision

Before reading files, classify the request:

```text
If the user asks to import, rebuild, regenerate, summarize exports, or read imports/<source>/:
    use Import Memory
Else if the user asks to add, remember, save, update, or promote a specific memory:
    use Add / Update Memory
Else if the user asks which cards/files should be read:
    use Route Memory
Else:
    use Use Memory
```

Do not infer Import Memory just because exports exist.

## Hard Rules

- Keep `imports/` and `memory/` private and untracked.
- Treat `<project>/memory` as the default active memory instance.
- Treat `memory/experiments/*` as draft/test instances. Use one only when the user explicitly supplies that experiment path.
- Do not read raw imports during ordinary runtime use.
- Do not read `deep-profile.md` by default.
- Do not regenerate profiles/cards unless the user explicitly asks for import, rebuild, or update work.
- Mention memory coverage once near the start when using memory.
- Treat generated memory as draft until reviewed or promoted.
- Current user instructions override older imported memory.

## Memory Instance Layout

Default active instance:

```text
<project>/memory
```

Expected files:

```text
memory/
  coverage.md
  index.md
  profile.md
  deep-profile.md
  cards/
    identity.md
    communication-style.md
    ...
  inbox.md
  changelog.md
```

If testing an experiment with only draft files, use `*.draft.md` and say once that it is a draft instance. Do not promote draft files unless the user asks.

## Use Memory

Use when the user wants help with a current task and invokes Aiden Memory for context.

1. Read `coverage.md` and `index.md` from the active or supplied memory instance.
2. Read `profile.md` plus the smallest relevant card set.
3. Mention the memory cutoff briefly.
4. Continue the task. Do not dump full card contents unless asked.
5. Do not read `imports/`.
6. Do not rebuild memory.

Default orientation set:

- `coverage.md`
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`

Add task cards only when relevant.

## Route Memory

Use when the user asks which cards/files should be used.

1. Infer the current task.
2. Recommend files and give a short reason for each.
3. State which files should not be read, especially `imports/` and usually `deep-profile.md`.
4. Do not answer the main task unless the user asks to continue.

## Add / Update Memory

Use when the user gives a specific memory, correction, or preference.

1. Capture uncertain or unapproved memory in `memory/inbox.md`.
2. Promote only after explicit approval.
3. Update the smallest relevant card/profile.
4. Record approved changes in `memory/changelog.md`.
5. Use absolute dates for dated facts.
6. Do not store secrets, tokens, passwords, payment details, or recovery codes.

## Import Memory

Use only when the user explicitly asks to import, rebuild, regenerate, or summarize raw/normalized exports.

1. Confirm source, path, requested date range, outputs, and reading depth when unclear.
2. Read existing `memory/coverage.md` if present and report:
   - current memory range;
   - new export range;
   - whether the update is append, overlap, gap, or full rebuild.
3. For Codex Desktop JSONL, run:

```powershell
node scripts/import-codex-sessions.mjs `
  --source <codex-sessions-dir> `
  --start YYYY-MM-DD `
  --end YYYY-MM-DD `
  --out imports/codex/<date-range>_codex-clean
```

4. Summarize normalized conversations:

```powershell
node scripts/summarize-normalized-conversations.mjs `
  --input imports/codex/<date-range>_codex-clean/conversations.normalized.json `
  --out imports/codex/<date-range>_codex-clean
```

5. Draft or update:
   - `coverage.draft.md`
   - `index.draft.md`
   - `profile.draft.md`
   - `deep-profile.draft.md`
   - `cards/*.draft.md`
6. Put draft outputs under `memory/experiments/<date-or-name>/` unless the user explicitly asks to update active memory directly.
7. Promote to active `memory/` only after review or explicit approval. Back up the previous active memory under `memory/archive/<date-or-reason>/`.

## Deep Profile

`deep-profile.md` is opt-in.

Read it only when the user explicitly asks for deep personal context or the task clearly involves identity, emotional continuity, values, relationships, social judgment, AI companionship, or a major life decision.

For ordinary study, coding, Git, docs, logistics, or tool tasks, use `profile.md` and relevant cards instead.

## When Not To Use

Do not use Aiden Memory for:

- secrets, tokens, passwords, payment details, recovery codes, or private credentials;
- automatic deep personality profiling without user review;
- loading an entire personal history into every new chat;
- replacing simple project instructions such as `AGENTS.md`, `CLAUDE.md`, or short preference files;
- storing temporary moods as permanent identity;
- publishing raw exports or personal memory without explicit redaction.

## Source Coverage

Every generated profile, deep profile, card, and coverage file should make the source window visible:

```text
Source:
Requested range:
Observed range:
Generated on:
Last processed through:
Status:
```

Use three layers inside memory content when useful:

- Current Snapshot: recent state that should guide ordinary use.
- Stable Patterns: durable preferences and repeated patterns.
- Historical Notes: older context that may matter but should not dominate.

## Resource Routing

Read extra docs only when needed:

- `docs/skill-modes.md`: detailed runtime/import routing, activation scenarios, and card selection.
- `docs/import-workflow.md`: import workflow and source handling.
- `docs/memory-lifecycle.md`: current/stable/history rules and update lifecycle.
- `docs/product-architecture.md`: reusable product architecture and privacy boundaries.
- `templates/memory/`: output templates for profile, deep profile, coverage, index, and cards.
- `examples/synthetic-alex/`: safe public example for expected output shape.

Use scripts instead of rewriting import logic:

- `scripts/import-codex-sessions.mjs`: clean Codex Desktop JSONL sessions into normalized conversations.
- `scripts/summarize-normalized-conversations.mjs`: summarize normalized conversations and identify high-signal sessions.

## Validation

After changing scripts or import behavior, run:

```powershell
node --test tests/import-codex-sessions.test.mjs tests/summarize-normalized-conversations.test.mjs
```

Before publishing or pushing, verify private data is untracked:

```powershell
git ls-files imports memory docs/superpowers
```

Expected output: nothing.
