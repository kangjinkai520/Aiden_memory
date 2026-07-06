# Aiden Memory Project Context And Requirements

This document is the public-safe project context for Aiden Memory. It describes the product problem and design boundaries without including real user memory, raw exports, private paths, or personal history.

## Background

Aiden Memory exists because long-running AI conversations often contain valuable continuity: communication style, project context, preferences, recurring goals, and the user's preferred way of being helped.

That continuity is fragile when it lives only inside one vendor account, one model, or one client. A local memory skill gives the user a way to preserve useful context in files they can inspect, edit, delete, and move.

The project is intentionally small. It is not a database service, a surveillance archive, or a plan to load a person's whole life into every new chat. It is a local Markdown skill for converting exported AI conversations into reviewable memory surfaces.

## Core Product Idea

Aiden Memory uses a memory-card system instead of one giant all-purpose profile.

```text
Raw exports
  -> Normalized conversations
  -> Candidate summaries
  -> Reviewable cards
  -> Profile / Deep Profile
  -> Runtime routing
  -> Changelog
```

The most important design principle is routing:

- Coding or project tasks should use project/tooling cards.
- Study or planning tasks should use study/planning cards.
- Emotional or personal reflection should use sensitive cards only when explicitly relevant.
- General conversation should usually use identity and communication-style context.
- Deep personal profile content should be opt-in.

This prevents useful memory from turning into context pollution.

## Requirements

### Human-Readable

All core memory files should be Markdown. Users should be able to open, read, edit, and delete memory without a special database tool.

### Domain-Separated

Memory should be split by domain, for example:

- identity and stable background
- communication style
- programming and projects
- study or planning
- AI tools and workflow
- life logistics
- relationships and emotional context
- social and cultural views

The separation is a privacy and relevance mechanism, not just file organization.

### Routed By Task

An index or mode document should tell future assistants which cards to read for which kind of task. Ordinary runtime use should read existing reviewed memory, not raw imports.

### Privacy-Preserving By Default

The assistant should not automatically load sensitive material for unrelated tasks. Sensitive memory should be opt-in by topic or explicit user request.

### No Secrets

The repository and memory files must not store:

- API keys
- account tokens
- passwords
- payment details
- recovery codes
- raw private credentials

The project may mention that a tool exists, but not the secrets used to access it.

### Reviewable Updates

Memory updates should be explicit and reviewable:

1. Candidate memory goes into `memory/inbox.md`.
2. The user reviews or approves it.
3. Approved changes are promoted into the relevant card.
4. `memory/changelog.md` records what changed.

This avoids silent memory drift.

### Portable Across Tools

The memory format should be usable by different assistants and clients because it is plain Markdown plus simple JSON import artifacts.

### Git-Friendly

The reusable project layer can be versioned. Private local data must remain untracked:

- `memory/`
- `imports/`
- local experiment folders containing real user data

## Current Chosen Direction

Aiden Memory borrows ideas from memory systems such as atomic memories, long-term profiles, routing, and reviewed updates, but keeps the implementation lightweight:

- local files first
- Markdown first
- review before promotion
- task routing before retrieval
- explicit deep-profile use
- no hidden memory mutation

## Success Criteria

The first useful version succeeds if:

1. a user can inspect and edit every memory surface;
2. a new assistant can use relevant cards without reading unrelated private context;
3. source coverage and cutoff dates are visible;
4. updates are reviewable;
5. raw imports remain local and ignored;
6. the system feels like continuity, not surveillance.
