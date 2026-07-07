# Import Workflow

Last updated: 2026-07-06

This workflow describes the manual first version of Aiden Memory import. Later versions may automate parts of it, but the review boundaries should remain visible.

Import is an explicit mode. Do not run this workflow during ordinary Runtime Mode use.

## Choose Source Type

Aiden Memory can start from either local Agent session folders or exported web AI data. The user should not manually clean or reformat records before import.

### Local Agent / Desktop / CLI

If the source is a local Agent such as Codex Desktop, Claude Code, Cursor-style agents, or another CLI/Desktop assistant, ask for:

```text
Source:
Session/history folder:
Date range:
Requested outputs:
```

The import workflow should scan the folder, filter by date, clean noisy records, normalize conversations, and write draft outputs.

### Web AI Tools

If the source is a web product such as Claude Web or ChatGPT Web, first ask the user to check for an official export or data download.

If an export exists, ask for:

```text
Source:
Export file or folder:
Date range:
Requested outputs:
```

If no export exists, the user must first save or copy the relevant conversations locally. Aiden Memory can process saved files, but it cannot read private web-account history that is not available on disk.

### Unknown Formats

If the source tool is not supported yet, inspect a small sample before committing to an import. Report whether the format can be parsed and what assumptions would be needed.

## Place Source Files

Put copied source files, web exports, or normalized import outputs under:

```text
imports/<source>/
```

Examples:

```text
imports/claude/2026-04-05_to_2026-07-05_claude-memories.json
imports/chatgpt/2026-01-01_to_2026-03-31_chatgpt-export.json
```

The `imports/` directory is ignored by git.

## Clean Codex Sessions

Codex Desktop sessions are JSONL files that can include system/developer instructions, tool calls, sandbox approval transcripts, and other runtime noise. Do not feed raw Codex JSONL directly into profile or card generation.

Use the cleaner first:

```powershell
node scripts/import-codex-sessions.mjs `
  --source <codex-sessions-dir> `
  --start 2026-06-01 `
  --end 2026-07-06 `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

It writes:

- `manifest.json` / `manifest.md`: requested range, observed range, sessions, and rejection counts.
- `conversations.normalized.json`: Claude-like conversation objects with `chat_messages`, using `human` / `assistant` senders.
- `clean-conversations.json` / `clean-conversations.md`: user/assistant messages after context stripping.
- `rejected-messages.json` / `rejected-messages.md`: filtered messages with reasons and short previews.
- `raw/`: copied source JSONL files unless `--no-copy-raw` is used.

The cleaner prepares source material only. It does not update `memory/`, does not promote cards, and does not regenerate profiles by itself.

After normalization, generate a lightweight summary/routing layer:

```powershell
node scripts/summarize-normalized-conversations.mjs `
  --input imports/codex/2026-06-01_to_2026-07-06_codex-clean/conversations.normalized.json `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

It writes:

- `conversation-summaries.json` / `conversation-summaries.md`: one deterministic summary record per normalized conversation.
- `high-signal-conversations.md`: conversations ranked by domain hits and signal score for profile/deep-profile close reading.

This summary layer is a routing aid. It does not replace human review or deep-profile close reading.

## Choose Import Scope

Before reading raw exports, identify or ask for:

- source: Claude, ChatGPT, Codex, or another tool
- file path under `imports/<source>/`
- time range: all available data, recent N months, or an explicit start and end date
- outputs: cards, `profile.md`, `deep-profile.md`, or all
- reading depth: quick summary, standard import, or deep-profile close reading

If the user gives a time range, filter conversations by their timestamps before extracting memory. If the export does not contain the requested range, report the observed date range and continue only with user approval or a clearly stated assumption.

## Coverage Check

Before importing or updating memory:

1. Read `memory/coverage.md` if it exists.
2. Tell the user the current memory coverage, including the last processed date.
3. Parse the new export's actual timestamps. Do not rely only on the filename.
4. Tell the user the new export's observed date range.
5. Compare old coverage and new observed range:
   - continuation: new data starts after the old coverage end,
   - overlap: new data repeats dates already covered,
   - gap: dates are missing between old coverage and new data,
   - rebuild: user wants to regenerate a whole range.
6. Ask the user to confirm the update scope before generating memory.

After import, update `memory/coverage.md` with:

- requested source range,
- observed source range,
- memory generation date,
- last processed date,
- source file,
- outputs updated,
- notes about mismatches, gaps, or overlaps.

## Draft Memory Output

After cleaning and summarizing source material, create a draft memory instance first:

```text
memory/experiments/<date-or-name>/
  coverage.draft.md
  index.draft.md
  profile.draft.md
  deep-profile.draft.md
  cards/
    identity.draft.md
    communication-style.draft.md
    ...
  source/
    source-notes.md
```

The draft should include:

- candidate memory notes or source notes under `source/`,
- a default-readable `profile.draft.md`,
- an explicit-trigger `deep-profile.draft.md`,
- task-specific `cards/*.draft.md`,
- a `coverage.draft.md` that records source windows and last processed dates,
- an `index.draft.md` that routes future runtime use.

Do not overwrite active `memory/` until the user approves the draft or explicitly asks to finalize the import.

## First Pass

Read the source export and produce the draft files above.

Use different reading depth for different outputs:

- `profile.md` can be drafted from import summaries, current user instructions, and reviewed cards.
- `cards/*.md` should prioritize stable facts and task-specific reusable context.
- `deep-profile.md` needs a deeper pass. Do not make it only a longer summary of summaries.

## Deep Profile Close-Reading Pass

For `deep-profile.md`, use this workflow:

1. Use conversation summaries and metadata to identify high-signal conversations.
2. Prioritize conversations about identity, values, emotional patterns, relationships, long-term goals, AI continuity, repeated conflicts, strong reactions, and recurring analysis styles.
3. Close-read selected raw user messages from those conversations.
4. Extract recurring patterns, tensions, values, emotional texture, and collaboration preferences.
5. Avoid copying raw transcript passages into the profile.
6. Write the deep profile as a curated mirror: specific enough for the user to recognize themselves, but not a dump of private chat logs.
7. Ask the user to review what is accurate, too strong, too shallow, outdated, or missing.

## Review Rules

- Current user corrections override imported memory.
- Do not copy raw transcripts into cards.
- Do not copy raw transcripts into `deep-profile.md`; synthesize patterns instead.
- Use absolute dates.
- Keep profile files bilingual if the user wants a review translation.
- Record approved updates in `memory/changelog.md`.

## Reconciliation

Before promoting a draft to active memory, compare:

- profile vs cards,
- deep-profile vs cards,
- current instructions vs imported memory,
- dated context vs current context.

When conflicts appear, keep the current reviewed card facts and update profiles to match.

## Promote To Active Memory

After review and reconciliation:

1. Back up the current active memory to `memory/archive/<date-or-reason>/`.
2. Copy or rewrite approved draft files into active paths:
   - `memory/coverage.md`
   - `memory/index.md`
   - `memory/profile.md`
   - `memory/deep-profile.md`
   - `memory/cards/*.md`
3. Record the promotion in `memory/changelog.md`.
4. Keep raw exports and experiments untracked.
