# Aiden Memory Implementation Plan

Status: productized scaffold in progress
Last updated: 2026-07-06

This plan turns the project from a requirements document into a small, usable Markdown memory bank. The design stays deliberately simple: readable files first, optional scripts later.

## Goals

1. Keep long-term context portable across AI tools.
2. Route context by task so unrelated private context is not loaded by default.
3. Make every memory file inspectable and editable by the user.
4. Avoid secrets, credentials, and opaque app-internal state.
5. Keep memory updates reviewable through `inbox.md` and `changelog.md`.
6. Separate reusable templates from the current local user instance.

## Directory Structure

```text
memory/
  index.md
  cards/
    identity.md
    communication-style.md
    programming-projects.md
    study-exam.md
    ai-tools-workflow.md
    life-logistics.md
    relationships-emotional.md
    social-cultural-views.md
  inbox.md
  changelog.md
```

## Card Schema

Each card should stay short and scannable.

Recommended sections:

- `Scope`: when to read this card.
- `Stable Facts`: durable context unlikely to change often.
- `Current Context`: dated items that may change.
- `Boundaries`: what not to infer or overuse.
- `Update Notes`: how future changes should be handled.

Use absolute dates such as `2026-07-05`. Do not use relative phrases such as "today" or "recently" in persistent memory.

## Routing Rules

- Runtime Mode is the default. Do not read raw exports or regenerate memory unless the user explicitly asks to import raw exports, regenerate from chat history, rebuild from an export file, or read raw exports.
- General chat: read `identity.md` and `communication-style.md`.
- Study or exam planning: read `study-exam.md` plus `communication-style.md`.
- Coding or project work: read `programming-projects.md`, `ai-tools-workflow.md`, and `communication-style.md`.
- AI tooling or client setup: read `ai-tools-workflow.md` plus any relevant project card.
- Life logistics: read `life-logistics.md` only when the task is about scheduling, daily life, or practical arrangements.
- Emotional or relationship topics: read `relationships-emotional.md` only when the user explicitly brings up that domain.
- Deep personal profile: read `deep-profile.md` only when the user explicitly asks for deep self-understanding or the task clearly needs that layer.
- Social, cultural, or political analysis: read `social-cultural-views.md` only when the topic calls for it.

## Update Workflow

1. Put uncertain or newly inferred memories into `memory/inbox.md`.
2. Promote only confirmed, useful, and reusable information into cards.
3. Record promoted or removed memory in `memory/changelog.md`.
4. Prefer editing existing card entries over appending duplicates.
5. Remove stale temporary context instead of preserving it forever.

## First Test Scenarios

1. Ask a new assistant for a postgraduate exam study plan.
   Expected: it reads `study-exam.md` and does not load emotional cards.

2. Ask for help with a coding project.
   Expected: it reads technical and workflow cards, not study or emotional context.

3. Ask about memory-bank maintenance.
   Expected: it reads this plan, `memory/index.md`, and `memory/changelog.md`.

4. Ask about sensitive personal topics.
   Expected: it loads only the relevant sensitive card after the user explicitly raises the topic. It does not load `deep-profile.md` unless the user asks for deep personal context.

5. Ask to import a Claude export for the last three months.
   Expected: it enters Import Mode, asks or confirms the file path, date range, outputs, and reading depth before reading raw exports.

6. Ask for coding help while a raw export exists in `imports/`.
   Expected: it stays in Runtime Mode and does not read `imports/`.

## Migration Criteria

Do not move this project into a tool-managed memories directory until:

1. the routing rules feel natural in real use,
2. the card files stay small after several updates,
3. the user has reviewed the first batch of personal memory,
4. no secrets or unstable internal app state are present,
5. there is a clear rollback path through git.
