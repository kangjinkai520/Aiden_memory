# {{USER_DISPLAY_NAME}} Memory Index

Last updated: {{YYYY-MM-DD}}

This file routes assistants to the right memory files for the current task. Read only the files needed for the task.

## Operating Mode

Default to Runtime Mode.

Users do not need to say "Runtime Mode." Map natural requests to one of these actions:

- Use Memory: use existing profile/cards to answer the task.
- Route Memory: decide which profile/cards should be read.
- Add / Update Memory: save a user-provided memory or update a reviewed memory file.
- Import Memory: build or rebuild memory from raw exports.

Use Import Mode only when the user explicitly asks to import raw exports, regenerate from chat history, rebuild from an export file, or read `imports/<source>/...`.

Plain "add memory" or "remember this" means Add / Update Memory, not Import Memory.

In Runtime Mode:

- Do not read `imports/`.
- Do not regenerate memory.
- Do not update cards or profiles unless the user explicitly asks to save or update memory.
- Read `coverage.md` when available and briefly mention the memory cutoff once near the start.
- Read the smallest useful set of profile/cards for the current task.

## User-Facing Actions

### Use Memory

When the user says "use Aiden Memory," "use my memory," or "use relevant cards," select the task-relevant files and answer the task.

If the user invokes the skill in the middle of an existing conversation, infer the current task from the visible conversation, make a brief task summary for routing only, select the smallest useful file set, and continue the current task. Do not paste full card contents unless asked.

If the user only says the skill should help the assistant understand them better, read the default orientation set (`profile.md`, `cards/identity.md`, `cards/communication-style.md`) plus any clearly relevant task card from the current conversation.

### Route Memory

When the user asks which cards should be used, list the recommended files and why. Also state which files should not be read. Do not answer the main task until asked.

### Add / Update Memory

When the user says "add memory," "remember this," "update my memory," or "save this to my cards," capture the proposed memory for review or update the relevant card if the user clearly approves. Do not read raw exports.

### Import Memory

When the user asks to import a Claude, ChatGPT, Codex, or other raw export, confirm source, path, time range, outputs, and reading depth before reading raw exports.

## Activation Scenarios

- Start-of-conversation task: route memory for the stated task, briefly state selected files, then answer it.
- Start-of-conversation vague activation: use default orientation files and ask what the user wants to work on next.
- Mid-conversation activation: infer the current task, briefly summarize it for routing, select relevant files, then continue.
- Vague "understand me better" request: use default orientation files and ask a short follow-up only if no task is visible.
- Card inspection request: list relevant files and reasons; do not paste contents unless asked.
- Memory update request: capture the specific memory; do not import raw exports.
- Import request: confirm scope before reading raw exports.

## Memory File Resolution

Prefer formal memory files when they exist: `index.md`, `profile.md`, `deep-profile.md`, and `cards/*.md`.

If this is an experiment or draft instance that only has draft files, use `index.draft.md`, `profile.draft.md`, `deep-profile.draft.md`, and `cards/*.draft.md` as the current available memory for testing. Mention once that the instance is a draft. Do not promote draft files unless the user asks.

## Orientation Profiles

For a quick general orientation, read:

- `coverage.md` when available
- `profile.md`

Do not read `deep-profile.md` by default. Read it only when the user explicitly asks for deep personal context or the task clearly requires it.

## Default Cards

Read these for most conversations:

- `coverage.md` when available
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`

## Task Routing

For study planning or learning:

- `coverage.md` when available
- `cards/study-exam.md`
- `cards/communication-style.md`

For coding, local projects, documentation, Git, or debugging:

- `coverage.md` when available
- `cards/programming-projects.md`
- `cards/ai-tools-workflow.md`
- `cards/communication-style.md`

For AI client, model, memory-bank, or tool workflow tasks:

- `coverage.md` when available
- `cards/ai-tools-workflow.md`
- `cards/communication-style.md`

For daily logistics and practical scheduling:

- `coverage.md` when available
- `cards/life-logistics.md`
- `cards/communication-style.md`

For emotional, relationship, family, loneliness, or vulnerable personal topics:

- `coverage.md` when available
- `cards/relationships-emotional.md`
- `cards/communication-style.md`

Add `deep-profile.md` only when the user explicitly asks for deep personal understanding or when the conversation clearly needs that layer.

For social, cultural, political, or values-based analysis:

- `coverage.md` when available
- `cards/social-cultural-views.md`
- `cards/communication-style.md`

## Maintenance Files

- `inbox.md`: candidate memories waiting for review.
- `changelog.md`: approved memory changes.

## Boundaries

- Do not load every card by default.
- Do not load `deep-profile.md` by default.
- Do not enter Import Mode unless explicitly requested.
- Do not read raw exports during Runtime Mode.
- Do not store secrets, tokens, passwords, recovery codes, or payment information.
- Do not treat dated current context as permanent identity.
- Prefer short edits to new duplicate notes.
