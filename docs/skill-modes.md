# Skill Modes And Trigger Rules

Last updated: 2026-07-06

Aiden Memory has two internal operating modes:

- Import Mode: build or update memory from raw exports.
- Runtime Mode: use existing profiles and cards for the current task.

The default mode is Runtime Mode. Import Mode must be explicitly requested.

Users do not need to say "Runtime Mode." They should be able to use natural requests such as "use Aiden Memory," "which cards should you read?", "add this memory," or "import my Claude export." The skill maps those requests to the correct internal behavior.

## User-Facing Actions

Aiden Memory should expose four natural actions:

1. Use Memory
2. Route Memory
3. Add / Update Memory
4. Import Memory

### Use Memory

Use existing memory to answer the current task.

Typical user wording:

- use Aiden Memory for this
- use my memory to help with this
- based on what you know about me, help me plan this
- use the relevant cards
- use this skill to understand me better in this window

Behavior:

- stay in Runtime Mode
- select `profile.md` and task-relevant cards
- answer the task
- do not read `imports/`
- do not regenerate memory
- do not read `deep-profile.md` unless explicitly requested or clearly necessary

If the user invokes the skill in the middle of an existing conversation, first infer the current task from the conversation so far, then route memory for that task. Do not dump card contents into the chat unless the user asks to inspect them.

### Route Memory

Only decide which memory files are relevant.

Typical user wording:

- which cards should you use for this?
- use Aiden Memory to choose the right cards
- route this task
- tell me what memory you would read

Behavior:

- stay in Runtime Mode
- list the recommended files and why
- list files that should not be read
- do not answer the main task unless the user asks to continue
- do not read `imports/`
- do not regenerate memory

### Add / Update Memory

Save a user-provided memory or update an existing card/profile entry.

Typical user wording:

- add memory: ...
- remember that ...
- update my memory: ...
- save this to my cards
- my target changed to ...

Behavior:

- do not treat this as raw-export import
- capture the proposed memory in `memory/inbox.md` or update the relevant card after user confirmation
- use absolute dates when needed
- avoid storing secrets or unstable details
- record approved changes in `memory/changelog.md` when the memory is promoted

### Import Memory

Build or rebuild memory from raw exports.

Typical user wording:

- import my Claude export
- generate cards from this conversations file
- rebuild my deep profile from chat history
- import the last three months
- read `imports/claude/...`

Behavior:

- enter Import Mode
- confirm source, path, time range, outputs, and reading depth
- read raw exports only after the import scope is clear
- create drafts before replacing reviewed memory

## Activation Scenarios

### At The Start Of A Conversation

If the user starts with a task and asks to use Aiden Memory, route memory for that task and proceed.

Example:

```text
Use Aiden Memory to help me plan this week's study schedule.
```

Expected behavior:

- identify this as Use Memory
- read `profile.md` and study-related cards
- do not read `imports/`
- do not read `deep-profile.md`
- answer the study-planning task

If the opening request combines "use Aiden Memory" with a concrete task, do not stop at explaining what memory was loaded. Briefly state the selected files, then answer the task.

If the opening request only says "use Aiden Memory to understand me better" and gives no task, load the default orientation set and ask what the user wants to work on next.

### Mid-Conversation Activation

If the user invokes Aiden Memory after a conversation is already underway, do a lightweight current-window handoff:

1. Identify the current task from the visible conversation.
2. Make a brief task summary for routing purposes only.
3. Select the smallest useful set of profile/cards.
4. State the selected files briefly.
5. Continue helping with the current task.

Do not summarize the entire conversation unless the user asks for a full summary.

Do not paste full card contents unless the user asks to inspect them.

Do not read `imports/`.

Do not regenerate memory.

Example user wording:

```text
Use this skill here so you understand me better.
```

Expected behavior:

- infer the current task from context
- read `profile.md`, `cards/identity.md`, `cards/communication-style.md`, and 1-2 task-relevant cards
- avoid `deep-profile.md` unless the user asks for deep personal context
- continue the current task with better personalization

### Vague "Understand Me Better" Request

If the user says they want the skill to help the assistant understand them better, but does not specify a task:

1. Read the default orientation set:
   - `profile.md`
   - `cards/identity.md`
   - `cards/communication-style.md`
2. If the visible conversation has a clear task, add the relevant task card.
3. Ask a short follow-up only if no task can be inferred.

Do not read `deep-profile.md` unless the user says they want deep personal context, a long-term personal portrait, or friend-like self-understanding.

### Card Inspection Request

If the user asks to see cards or asks which cards are relevant, use Route Memory. List file names and reasons. Do not paste card contents unless asked.

### Memory Update Request

If the user says "add memory" or "remember this," use Add / Update Memory. Save or stage the specific user-provided memory. Do not read raw exports.

### Import Request

If the user asks to import chat history or rebuild memory from an export, use Import Memory. Confirm scope before reading raw exports.

## Memory File Resolution

Prefer formal memory files when they exist:

- `index.md`
- `profile.md`
- `deep-profile.md`
- `cards/*.md`

If the user points to an experiment or draft instance that only has draft files, use draft files as the current available memory for testing:

- `index.draft.md`
- `profile.draft.md`
- `deep-profile.draft.md`
- `cards/*.draft.md`

When using draft files, mention once that this is a draft instance. Do not repeatedly apologize or treat it as an error.

Do not convert draft files into formal memory files unless the user asks to promote or finalize the experiment.

## Mode Selection

Use this decision rule before reading memory files:

```text
If the user asks to import raw exports, regenerate from chat history,
rebuild from an export file, or read imports/<source>/...:
    enter Import Mode
Else if the user asks to add, remember, save, or update a specific memory:
    enter Runtime Mode with Add / Update Memory behavior
Else if the user asks which cards or memory files are relevant:
    enter Runtime Mode with Route Memory behavior
Else:
    enter Runtime Mode with Use Memory behavior
```

Do not infer Import Mode just because a raw export exists under `imports/`.

Do not read raw exports during Runtime Mode.

Do not regenerate profiles or cards during Runtime Mode.

## Import Mode

Import Mode is for creating or updating memory artifacts.

Trigger Import Mode only when the user asks for actions such as:

- import my chat history
- generate memory from this Claude export
- regenerate profile
- rebuild deep profile
- read `imports/<source>/...`
- import the last three months
- import conversations from 2026-04-01 to 2026-07-01

Before importing, identify or ask for:

- source: Claude, ChatGPT, Codex, or another tool
- file path under `imports/<source>/`
- time range: all available data, recent N months, or an explicit start and end date
- outputs: cards, `profile.md`, `deep-profile.md`, or all
- reading depth: quick summary, standard import, or deep-profile close reading

Import Mode may read raw exports, create draft memory files, and update cards or profiles after review.

Plain "add memory" or "remember this" is not Import Mode unless the user also asks to read raw exports or rebuild from chat history.

## Runtime Mode

Runtime Mode is for ordinary assistant use.

Examples:

- help me plan exam study
- continue this coding project
- explain this file
- help me debug
- help me think through this social issue
- I feel anxious
- write a README

In Runtime Mode:

- read only `profile.md` and task-relevant cards
- read `coverage.md` when available so the user knows the memory date range
- use `index.md` for routing
- do not read `imports/`
- do not regenerate memory
- do not update cards unless the user explicitly asks to save or update memory

When using memory in Runtime Mode, briefly mention the coverage date once near the start:

```text
I am using memory based on conversations observed through YYYY-MM-DD.
```

Do not repeat this every turn unless the date range matters or the user asks.

## Deep Profile Trigger

`deep-profile.md` is not part of the default runtime context.

Read `deep-profile.md` only when the user explicitly asks for deep personal context or the task clearly requires it, such as:

- what kind of person am I?
- understand me more deeply
- use my deep profile
- analyze my emotional pattern
- help me reflect on my relationship pattern
- talk to me like a long-term friend who knows me

For ordinary project, study, coding, Git, documentation, or logistics tasks, use `profile.md` and relevant cards instead.

## Runtime Routing Examples

Study planning:

- `coverage.md`
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`
- `cards/study-exam.md`

Coding or project work:

- `coverage.md`
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`
- `cards/programming-projects.md`
- `cards/ai-tools-workflow.md`

AI tooling or memory-bank work:

- `coverage.md`
- `profile.md`
- `cards/communication-style.md`
- `cards/ai-tools-workflow.md`
- relevant project card

Emotional or relationship topic:

- `coverage.md`
- `profile.md`
- `cards/communication-style.md`
- `cards/relationships-emotional.md`
- `deep-profile.md` only if explicitly requested or clearly necessary

Deep self-understanding:

- `coverage.md`
- `profile.md`
- `deep-profile.md`
- relevant sensitive cards

## Safety Rules

- Raw imports are archives, not runtime context.
- Runtime answers should make memory coverage visible without being noisy.
- Memory generation is an explicit action, not a side effect.
- Deep personal context is opt-in.
- Prefer the smallest useful context for the task.
- If unsure whether the user wants Import Mode, ask before reading raw exports.
