# Aiden Memory

English | [中文](README_zh.md)

Aiden Memory is a local Markdown memory skill for turning long-running AI conversations into reviewable cards, profiles, and deep profiles.

It is not a database service, not a surveillance archive, and not a plan to load someone's whole life into every new chat. It is a smaller thing with a human reason: when a person has spent months building trust, language, context, and a way of thinking with an AI, that continuity should not disappear just because a platform account becomes unavailable, a model changes, or a tool is replaced.

Aiden Memory keeps that continuity in files the user can inspect.

## What It Does

Aiden Memory helps a user:

- import local Agent session folders or web AI conversation exports,
- clean noisy source formats such as Codex JSONL,
- normalize conversations into a Claude-like structure,
- generate task-specific memory cards,
- generate a default-readable `profile.md`,
- generate an explicit-use `deep-profile.md`,
- route the right cards during ordinary conversations,
- keep source coverage and history visible.

The intended shape is a **Skill**, not a platform. It is local, Markdown-first, reviewable, and intentionally modest.

## Start Here

### 5-Minute Quick Start

```text
1. Clone this repo.
2. Find where your chat history lives: a local session/history folder, or a web export file.
3. Tell Codex the source path and date range.
4. Ask Codex: "Use Aiden Memory in Import Memory mode to build a draft memory from this source."
5. Review the generated draft files.
6. Promote the reviewed draft into memory/.
7. In future chats, ask: "Use Aiden Memory with memory instance <path-to-Aiden_memory>/memory."
```

The first run builds memory. Later chats should use the generated memory, not re-import raw exports.

The most important rule:

> Import once, generate memory once, then reuse the generated memory. Do not re-import raw chat history every time you open a new conversation.

Aiden Memory has two different jobs:

- **Import / Build Memory**: use local sessions or web exports to create `cards/`, `profile.md`, `deep-profile.md`, `coverage.md`, and `index.md`.
- **Use Memory**: in a normal new chat, read only the already-generated profile/cards that match the current task.

Most daily use should be **Use Memory**, not Import.

### Choose Your Source Type

Different AI tools store chat history differently. Users should not manually clean or reformat chat records. They only need to tell Aiden Memory where the source data is and what date range to process.

#### Local Agent / Desktop / CLI Tools

Tools such as Codex Desktop, Claude Code, Cursor-style agents, or other local AI agents often save sessions, history, or logs on disk.

For these tools, give Aiden Memory:

```text
Source: Codex / Claude Code / Cursor / other local Agent
Session folder: <path-to-session-or-history-folder>
Date range: YYYY-MM-DD to YYYY-MM-DD
Output: draft memory
```

Aiden Memory should scan the folder, filter by date, clean noisy records, normalize them into AI-friendly JSON, generate summaries, and draft memory files under `memory/experiments/`.

#### Web AI Tools

For web products such as Claude Web or ChatGPT Web, first check whether the product provides an official export or data download.

If an official export exists:

```text
Source: Claude Web / ChatGPT Web / other web AI
Export file or folder: <path-to-export>
Date range: YYYY-MM-DD to YYYY-MM-DD
Output: draft memory
```

If no export exists, the user may need to manually download, copy, or otherwise save the relevant conversations first. Aiden Memory can help process the saved files, but it cannot read private web-account history that has not been exported or saved locally.

#### Unknown Or Unsupported Tools

If the tool saves local files but Aiden Memory does not support its format yet, give the folder path and a small sample first. The assistant should inspect the structure, explain whether it can parse it, and avoid guessing silently.

### First-Time Setup

1. Identify the source: local Agent session folder, official web export, or saved conversation files.
2. Give the assistant the source path and requested date range.
3. Ask the assistant to use Aiden Memory in **Import Memory** mode.
4. Let Aiden Memory clean/normalize supported sources and create a draft memory instance under `memory/experiments/`.
5. Review the generated drafts before promoting them into active `memory/`.

After this step, you should have files like:

```text
memory/
  coverage.md
  index.md
  profile.md
  deep-profile.md
  cards/
    communication-style.md
    ai-tools-workflow.md
    ...
```

By default, the active memory instance is:

```text
<path-to-Aiden_memory>/memory
```

Experiment folders such as `memory/experiments/*` are draft or test instances. Assistants should not use them unless the user explicitly provides that experiment path as the memory instance.

### New Chat Usage

When starting a new chat, tell the assistant where the project and memory instance are:

```text
Use Aiden Memory to understand me for this conversation.
Project path: <path-to-Aiden_memory>
Memory instance: <path-to-Aiden_memory>/memory
Follow the skill-modes rules.
```

The assistant should:

1. use **Runtime / Use Memory** mode;
2. read `index.md`, `profile.md`, and only relevant cards;
3. mention the memory coverage date;
4. continue the current task;
5. avoid raw imports and avoid rebuilding memory.

### Mid-Conversation Usage

If you are already discussing a task and then invoke Aiden Memory, the assistant should infer the current task from the visible conversation, choose the smallest relevant card set, and continue.

Example:

```text
Use Aiden Memory here so you understand my context better.
Project path: <path-to-Aiden_memory>
Memory instance: <path-to-Aiden_memory>/memory
Follow the skill-modes rules.
```

This should still be **Use Memory**, not Import Memory.

### Updating Memory Later

When you have new chat history, do not blindly rebuild everything. First check `coverage.md`.

The assistant should tell you:

- what date range the current memory is based on;
- what new date range the export contains;
- whether this is an append, overlap, gap, or full rebuild.

Then it can update the memory drafts. The generated files should keep source coverage visible so the user knows what period the memory represents.

## Why It Exists

The project started after a platform account became unavailable and made one thing clear: useful AI continuity should not live only inside a single company's account memory.

For some users, AI is not just a disposable Q&A box. It becomes a long-running thinking companion: it remembers how they plan, how they write, what they are afraid of, what they are trying to become, and how they prefer to be challenged. Losing that continuity can feel strangely intimate, not because the tool is magic, but because the conversations were real.

Aiden Memory is an attempt to keep that continuity without giving up control.

The user keeps local sessions and raw exports local. The skill turns them into reviewed, dated, readable memory files. Future assistants can read only what the current task needs.

## Core Flow

```text
Local sessions or web exports
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

## New Discovery: Deep Profile Risk

Aiden Memory should help preserve continuity, not define a person's identity for them.

Early use revealed an important risk: a generated `deep-profile.md` can become dangerously convincing when it turns limited conversation history into a smooth psychological narrative. Users should treat any generated deep profile as a dated, partial, reviewable reflection aid, not as a diagnosis, personality verdict, or identity authority.

See [Deep Profile Risk](docs/deep-profile-risk.md) for the maintainer note and design rules behind this boundary.

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

## Draft-To-Active Memory Path

After raw exports are cleaned and summarized, the assistant should create a draft memory instance first:

```text
memory/experiments/<date-or-name>/
  coverage.draft.md
  index.draft.md
  profile.draft.md
  deep-profile.draft.md
  cards/
    communication-style.draft.md
    ai-tools-workflow.draft.md
    ...
  source/
    source-notes.md
```

Review the draft before it becomes the active memory. When approved, promote it into:

```text
memory/
  coverage.md
  index.md
  profile.md
  deep-profile.md
  cards/
    communication-style.md
    ai-tools-workflow.md
    ...
```

Keep the previous active memory under `memory/archive/<date-or-reason>/` before replacing it.

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

- model-assisted profile/card generation and quality review,
- full one-command import-to-active-memory pipeline,
- ChatGPT export support,
- final packaging as an installed Codex skill.

## When Not To Use

Aiden Memory is not the right tool for every kind of memory.

Do not use it for:

- secrets, API keys, tokens, passwords, recovery codes, payment details, or private credentials;
- automatic deep personality profiling without user review;
- loading someone's full history into every new chat;
- replacing simple project instructions such as `AGENTS.md`, `CLAUDE.md`, or a short preferences file;
- storing unstable one-off moods as permanent identity;
- publishing raw exports or personal memory without explicit redaction.

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
- [Deep profile risk](docs/deep-profile-risk.md)
- [Product architecture](docs/product-architecture.md)
- [Implementation plan](docs/implementation-plan.md)
- [Project context and requirements](PROJECT_CONTEXT_AND_REQUIREMENTS.md)

## Example

- [Synthetic Alex example](examples/synthetic-alex/README.md): a fictional, safe-to-publish example showing source summary, default profile, deep profile, routing file, and cards.

## Repository Visibility

This repository is intended to be safe to publish as the reusable skill layer. Private local folders such as `memory/` and `imports/` must remain ignored and should not be committed.
