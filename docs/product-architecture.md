# Aiden Memory Product Architecture

Last updated: 2026-07-06

Aiden Memory is intended to be a reusable local memory-bank system, not a single user's personal memory folder. The local `memory/` directory is a private working instance and should not be treated as the reusable product layer.

## Core Model

```text
Source Imports
  -> Candidate Extraction
  -> Reviewed Cards
  -> Profile / Deep Profile
  -> Coverage
  -> Lifecycle Review
  -> Task Routing
  -> Changelog And Review
```

## Operating Modes

Aiden Memory separates memory generation from memory use:

- Import Mode reads raw exports and creates or updates memory artifacts.
- Runtime Mode uses existing profiles and cards for the current task.

Runtime Mode is the default. Import Mode must be explicitly requested by the user. A task request such as coding help, study planning, documentation, or emotional support should not automatically read `imports/` or regenerate memory.

See `docs/skill-modes.md` for trigger rules.

## Layers

### Source Imports

Raw exports from Claude, ChatGPT, Codex, or other tools live under `imports/`. This directory is ignored by git because it may contain private data.

Raw exports are archives and import sources. They are not runtime context.

### Candidate Extraction

Potential memories should first go into `memory/inbox.md`. The system should not silently promote inferred memories into official cards.

### Reviewed Cards

Cards are the maintainable fact layer. They store reviewed, reusable, task-routed memory.

### Profiles

`profile.md` is the default-readable orientation layer.

`deep-profile.md` is the explicit-trigger high-context layer.

Profiles summarize cards and reviewed imports. Over time, cards should be treated as the more precise source of truth for factual details.

The two profiles should not be generated with the same reading depth:

- `profile.md` should stay compact and task-safe. It can rely mostly on summaries, current instructions, and reviewed cards.
- `deep-profile.md` should be built from a close-reading pass over selected high-signal conversations. Its job is not to list more facts, but to synthesize recurring patterns, values, emotional texture, tensions, and AI-collaboration preferences.

This keeps the default layer useful for ordinary tasks while allowing the deep layer to feel genuinely personal when the user explicitly asks for it.

Deep profiles also have a specific misuse risk: they can convert limited conversation evidence into a highly coherent psychological story. That story may feel deeply accurate because it is well-written, not because every inference is well-supported.

For that reason, `deep-profile.md` should be treated as a reflection aid, not an identity authority. It should distinguish observed facts, user-confirmed patterns, and assistant hypotheses. It should avoid totalizing explanations, keep uncertainty visible, and never override current user corrections or lived reality.

### Coverage

`coverage.md` records what date range the current memory instance is based on.

It should include:

- requested source range,
- observed source range parsed from timestamps,
- memory generation date,
- last processed date,
- import history.

Runtime Mode should use coverage to briefly tell the user what memory cutoff is being used. Import Mode should use coverage to detect continuations, overlaps, gaps, and rebuilds before updating memory.

### Lifecycle Review

Memory should be organized by time relevance:

- Current Layer: recent state that should guide ordinary use.
- Stable Layer: durable preferences, values, and collaboration patterns.
- History Layer: older context that remains useful but should not dominate current answers.

See `docs/memory-lifecycle.md`.

### Task Routing

`index.md` controls which files should be read for which task.

Task routing applies in Runtime Mode. It should choose the smallest useful context and should not escalate to Import Mode unless the user explicitly asks to import raw exports, regenerate from chat history, rebuild from an export file, or read raw exports.

When the user activates Aiden Memory in the middle of an existing conversation, routing should use the visible conversation to infer the current task, briefly summarize that task for routing, select relevant files, and continue the task. It should not display full card contents or rebuild memory unless explicitly requested.

### Changelog And Review

`changelog.md` records approved memory changes so users can inspect how their memory evolves.

## First-Import Rule

During a first import, profiles and cards may both be generated from the source export. After that first import, cards should become the fact source and profiles should be maintained as summaries derived from reviewed memory.

For first-import deep profiles, use summaries to choose which raw conversations deserve close reading. A high-quality deep profile should be based on selected raw user messages, not only on precomputed conversation summaries.

## Product vs Instance

- `templates/`: reusable product templates.
- `docs/`: product documentation.
- `memory/`: current local user instance.
- `imports/`: local raw source material, ignored by git.
