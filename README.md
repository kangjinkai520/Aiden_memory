# Aiden Memory

English | [中文](README_zh.md)

Aiden Memory is a local Markdown memory skill for turning long-running AI conversations into reviewable cards, profiles, and deep profiles.

It is not a database service, not a surveillance archive, and not a plan to load someone's whole life into every new chat. It is a smaller thing with a human reason: when a person has spent months building trust, language, context, and a way of thinking with an AI, that continuity should not disappear just because a platform account becomes unavailable, a model changes, or a tool is replaced.

Aiden Memory keeps that continuity in files the user can inspect.

## What It Does

Aiden Memory helps a user:

- import AI conversation exports,
- clean noisy source formats such as Codex JSONL,
- normalize conversations into a Claude-like structure,
- generate task-specific memory cards,
- generate a default-readable `profile.md`,
- generate an explicit-use `deep-profile.md`,
- route the right cards during ordinary conversations,
- keep source coverage and history visible.

The intended shape is a **Skill**, not a platform. It is local, Markdown-first, reviewable, and intentionally modest.

## Why It Exists

The project started after a platform account became unavailable and made one thing clear: useful AI continuity should not live only inside a single company's account memory.

For some users, AI is not just a disposable Q&A box. It becomes a long-running thinking companion: it remembers how they plan, how they write, what they are afraid of, what they are trying to become, and how they prefer to be challenged. Losing that continuity can feel strangely intimate, not because the tool is magic, but because the conversations were real.

Aiden Memory is an attempt to keep that continuity without giving up control.

The user keeps raw exports local. The skill turns them into reviewed, dated, readable memory files. Future assistants can read only what the current task needs.

## Core Flow

```text
Raw exports
  -> Clean / normalize source conversations
  -> Summarize and identify high-signal conversations
  -> Draft cards, profile, and deep profile
  -> Review and promote selected memory
  -> Use relevant cards at runtime
```

Normal use should read existing memory. It should not read raw imports or regenerate profiles unless the user explicitly asks for import/update work.

## Repository Shape

```text
SKILL.md

docs/
  import-workflow.md
  skill-modes.md
  memory-lifecycle.md
  product-architecture.md

scripts/
  import-codex-sessions.mjs
  summarize-normalized-conversations.mjs

templates/
  memory/
    profile.template.md
    deep-profile.template.md
    coverage.template.md
    index.template.md
    cards/
      *.template.md

examples/
  synthetic-alex/

memory/      # private local memory instance, ignored by git
imports/     # private raw exports and normalized imports, ignored by git
```

`docs/`, `scripts/`, `templates/`, and `examples/` are the reusable skill layer.

`memory/` and `imports/` are private local data. They should stay untracked.

## Profiles And Cards

Aiden Memory uses three memory surfaces:

- `cards/*.md`: task-specific facts and preferences.
- `profile.md`: a default-readable orientation profile.
- `deep-profile.md`: a high-context personal profile for explicit deep use.

Every generated profile, deep profile, and card should show its source coverage near the top:

```text
Source:
Requested range:
Observed range:
Generated on:
Last processed through:
Status:
```

Memory content is separated into:

- **Current Snapshot**: recent state that should guide ordinary use.
- **Stable Patterns**: durable preferences and repeated patterns.
- **Historical Notes**: older context that may matter but should not dominate.

This prevents older imports from quietly overriding who the user is now.

## Skill Modes

Aiden Memory separates memory use from memory generation.

- **Use Memory**: read existing profile/cards for the current task.
- **Route Memory**: decide which cards should be read.
- **Add / Update Memory**: capture a user-provided memory, usually into `memory/inbox.md`, then promote after review.
- **Import Memory**: explicitly read raw or normalized exports and generate/rebuild memory.

If the user says something like "use Aiden Memory to understand me in this chat," the assistant should default to runtime use: infer the task, choose relevant cards, mention the coverage date, and continue. It should not automatically import raw chats.

## Codex Import Support

Codex Desktop session files are noisy JSONL logs. They can include system/developer messages, tool calls, sandbox approval records, and runtime metadata.

Use:

```powershell
node scripts/import-codex-sessions.mjs `
  --source <codex-sessions-dir> `
  --start 2026-06-01 `
  --end 2026-07-06 `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

Then generate the summary/routing layer:

```powershell
node scripts/summarize-normalized-conversations.mjs `
  --input imports/codex/2026-06-01_to_2026-07-06_codex-clean/conversations.normalized.json `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

These scripts prepare source material. They do not directly update active memory.

## Current Status

Aiden Memory is an early Skill MVP.

Already working:

- local Markdown memory structure,
- reusable templates,
- skill mode rules,
- Codex JSONL cleaner,
- normalized conversation format,
- deterministic conversation summaries,
- source coverage blocks,
- current/stable/history layering,
- synthetic example,
- tests for the import scripts.

Still manual or experimental:

- profile/card generation quality review,
- full one-command import-to-memory pipeline,
- ChatGPT export support,
- final packaging as an installed Codex skill.

## Safety Boundaries

Do not store secrets in this project.

Do not store:

- API keys
- account tokens
- passwords
- recovery codes
- payment details
- private credentials

Raw exports and personal memory instances should remain local unless the user intentionally creates a redacted or synthetic example.

## Docs

- [Skill modes and trigger rules](docs/skill-modes.md)
- [Import workflow](docs/import-workflow.md)
- [Memory lifecycle](docs/memory-lifecycle.md)
- [Product architecture](docs/product-architecture.md)
- [Implementation plan](docs/implementation-plan.md)
- [Project context and requirements](PROJECT_CONTEXT_AND_REQUIREMENTS.md)

## Example

- [Synthetic Alex example](examples/synthetic-alex/README.md): a fictional, safe-to-publish example showing source summary, default profile, deep profile, routing file, and cards.

## Repository Visibility

This repository is intended to be safe to publish as the reusable skill layer. Private local folders such as `memory/` and `imports/` must remain ignored and should not be committed.
