---
name: aiden-memory
description: Local Markdown memory skill for importing AI conversation exports into reviewable cards, profile, and deep-profile files, then using the right memory at runtime. Use when a user asks to use Aiden Memory, import Claude/Codex/ChatGPT conversations, generate or update memory cards/profile/deep-profile, route memory for a task, add a memory, or explain this Aiden_memory project.
---

# Aiden Memory

Aiden Memory is a local Markdown memory skill. Use it to turn AI conversation history into reviewable memory files, then read only the relevant memory during future tasks.

## Core Rules

- Keep `imports/` and `memory/` private and untracked.
- Do not read raw imports during ordinary runtime use.
- Do not read `deep-profile.md` by default.
- Do not regenerate memory unless the user explicitly asks for import or rebuild.
- Mention source coverage when using memory: source, observed range, and last processed date.
- Treat generated memory as draft until reviewed.

## Modes

### Use Memory

Use when the user wants help with a current task and invokes Aiden Memory for context.

1. Read `memory/index.md` or the supplied memory instance index.
2. Read `profile.md` plus only the relevant cards.
3. Mention the memory coverage date briefly.
4. Continue the task without dumping full card contents.

### Route Memory

Use when the user asks which cards should be used.

1. Infer the current task.
2. Select relevant cards.
3. Explain the selection briefly.
4. Do not import raw data.

### Add / Update Memory

Use when the user gives a specific new memory or preference.

1. Capture the candidate in `memory/inbox.md`.
2. Ask for or use explicit approval before promotion.
3. Promote to the relevant card only after review.
4. Record approved changes in `memory/changelog.md`.

### Import Memory

Use only when the user explicitly asks to import, rebuild, summarize exports, or update memory from chat history.

1. Confirm source, path, and requested date range.
2. Check existing `memory/coverage.md` if present.
3. Report requested range and observed range.
4. For Codex JSONL, run `scripts/import-codex-sessions.mjs` before memory generation.
5. Run `scripts/summarize-normalized-conversations.mjs` on normalized conversations.
6. Draft cards, `profile.md`, `deep-profile.md`, `coverage.md`, and `index.md`.
7. Keep drafts separate until reviewed.

## File Structure

- `docs/skill-modes.md`: detailed mode rules.
- `docs/import-workflow.md`: import workflow.
- `docs/memory-lifecycle.md`: current/stable/history rules.
- `templates/memory/`: reusable output templates.
- `scripts/import-codex-sessions.mjs`: Codex JSONL cleaner.
- `scripts/summarize-normalized-conversations.mjs`: deterministic conversation summaries.
- `examples/synthetic-alex/`: safe public example.

## Memory Surfaces

- `cards/*.md`: task-specific facts and preferences.
- `profile.md`: default-readable orientation profile.
- `deep-profile.md`: explicit-use deep personal profile.
- `coverage.md`: source timeline and last processed date.
- `inbox.md`: candidate memories awaiting review.
- `changelog.md`: approved memory changes.

## Source Coverage

Every generated profile, deep profile, and card should include:

```text
Source:
Requested range:
Observed range:
Generated on:
Last processed through:
Status:
```

## Lifecycle Layers

Use three layers:

- Current Snapshot: recent state that should guide ordinary use.
- Stable Patterns: durable preferences and repeated patterns.
- Historical Notes: older context that may matter but should not dominate.

Current user instructions override older imported memory.
