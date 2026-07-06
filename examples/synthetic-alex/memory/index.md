# Alex Chen Memory Index

Last updated: 2026-04-01

This file routes assistants to the right memory files for the current task. Read only the files needed for the task.

## Operating Mode

Default to Runtime Mode.

Alex does not need to say "Runtime Mode." Map natural requests to one of these actions:

- Use Memory: use existing profile/cards to answer the task.
- Route Memory: decide which profile/cards should be read.
- Add / Update Memory: save a user-provided memory or update a reviewed memory file.
- Import Memory: build or rebuild memory from raw exports.

Use Import Mode only when Alex explicitly asks to import raw exports, regenerate from chat history, rebuild from an export file, or read raw imports.

Plain "add memory" or "remember this" means Add / Update Memory, not Import Memory.

In Runtime Mode:

- Do not read raw imports.
- Do not regenerate memory.
- Read `coverage.md` when available and briefly mention the memory cutoff once near the start.
- Read the smallest useful set of profile/cards for the current task.

## User-Facing Actions

### Use Memory

When Alex says "use Aiden Memory," "use my memory," or "use relevant cards," select the task-relevant files and answer the task.

If Alex invokes the skill in the middle of an existing conversation, infer the current task from the visible conversation, make a brief task summary for routing only, select the smallest useful file set, and continue the current task. Do not paste full card contents unless asked.

If Alex only says the skill should help the assistant understand them better, read the default orientation set (`profile.md`, `cards/identity.md`, `cards/communication-style.md`) plus any clearly relevant task card from the current conversation.

### Route Memory

When Alex asks which cards should be used, list the recommended files and why. Also state which files should not be read. Do not answer the main task until asked.

### Add / Update Memory

When Alex says "add memory," "remember this," "update my memory," or "save this to my cards," capture the proposed memory for review or update the relevant card if Alex clearly approves. Do not read raw imports.

### Import Memory

When Alex asks to import a Claude, ChatGPT, Codex, or other raw export, confirm source, path, time range, outputs, and reading depth before reading raw imports.

## Activation Scenarios

- Start-of-conversation task: route memory for the stated task, briefly state selected files, then answer it.
- Start-of-conversation vague activation: use default orientation files and ask what Alex wants to work on next.
- Mid-conversation activation: infer the current task, briefly summarize it for routing, select relevant files, then continue.
- Vague "understand me better" request: use default orientation files and ask a short follow-up only if no task is visible.
- Card inspection request: list relevant files and reasons; do not paste contents unless asked.
- Memory update request: capture the specific memory; do not import raw exports.
- Import request: confirm scope before reading raw exports.

## Memory File Resolution

Prefer formal memory files when they exist: `index.md`, `profile.md`, `deep-profile.md`, and `cards/*.md`.

If this is an experiment or draft instance that only has draft files, use `index.draft.md`, `profile.draft.md`, `deep-profile.draft.md`, and `cards/*.draft.md` as the current available memory for testing. Mention once that the instance is a draft. Do not promote draft files unless Alex asks.

## Orientation Profiles

For a quick general orientation, read:

- `coverage.md` when available
- `profile.md`

Do not read `deep-profile.md` by default. Read it only when Alex explicitly asks for deep personal context or the task clearly needs it.

## Default Cards

Read these for most conversations:

- `coverage.md` when available
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`

## Task Routing

For product design, specs, portfolio work, or interface copy:

- `coverage.md` when available
- `cards/work-projects.md`
- `cards/communication-style.md`

For learning, skill development, or career growth:

- `coverage.md` when available
- `cards/learning.md`
- `cards/communication-style.md`

For burnout, motivation, creative identity, or long-term personal patterns:

- `coverage.md` when available
- `cards/personal-reflection.md`
- `cards/communication-style.md`

Add `deep-profile.md` only when Alex explicitly asks for deep personal understanding or when the conversation clearly needs that layer.

## Boundaries

- Do not load every card by default.
- Do not load `deep-profile.md` by default.
- Do not enter Import Mode unless explicitly requested.
- Do not read raw imports during Runtime Mode.
- Do not treat dated current context as permanent identity.

---

# 中文翻译

最后更新：2026-04-01

这个文件把助手路由到当前任务所需的正确记忆文件。只读取任务需要的文件。

## 运行模式

默认使用 Runtime Mode。

Alex 不需要说 “Runtime Mode”。把自然语言请求映射到下面四类动作：

- Use Memory：使用已有 profile / cards 回答当前任务。
- Route Memory：判断应该读取哪些 profile / cards。
- Add / Update Memory：保存用户提供的新记忆，或更新已审阅记忆文件。
- Import Memory：从原始导出生成或重建 memory。

只有当 Alex 明确要求导入原始导出、从聊天记录重新生成、从导出文件重建，或读取原始导入资料时，才使用 Import Mode。

单纯的 “add memory” 或 “remember this” 表示 Add / Update Memory，不是 Import Memory。

在 Runtime Mode 中：

- 不要读取原始导入资料。
- 不要重新生成 memory。
- 如果存在 `coverage.md`，读取它，并在开头附近简短说明 memory 截止日期。
- 只读取当前任务最小必要的 profile / cards。

## 面向用户的动作

### Use Memory

当 Alex 说 “use Aiden Memory”、“use my memory” 或 “use relevant cards” 时，选择当前任务相关文件并回答任务。

如果 Alex 在已有对话中途调用这个 skill，先从可见对话中推断当前任务，做一个仅用于路由的简短任务摘要，选择最小必要文件集，然后继续当前任务。除非 Alex 要求查看，否则不要粘贴完整 card 内容。

如果 Alex 只是说希望这个 skill 让助手更了解自己，读取默认定位文件（`profile.md`、`cards/identity.md`、`cards/communication-style.md`），再根据当前对话加入明显相关的任务 card。

### Route Memory

当 Alex 问应该使用哪些 cards 时，列出推荐文件和理由，也说明不应该读取哪些文件。除非 Alex 继续要求，否则不要直接回答主任务。

### Add / Update Memory

当 Alex 说 “add memory”、“remember this”、“update my memory” 或 “save this to my cards” 时，把候选记忆记录下来供审阅，或在 Alex 明确批准时更新相关 card。不要读取原始导入资料。

### Import Memory

当 Alex 要求导入 Claude、ChatGPT、Codex 或其他原始导出时，先确认来源、路径、时间范围、输出内容和读取深度，再读取原始导入资料。

## 激活场景

- 对话开头直接给任务：为该任务路由 memory，简短说明选中文件，然后回答。
- 对话开头只模糊激活：使用默认定位文件，并询问 Alex 接下来想处理什么。
- 对话中途调用：推断当前任务，简短总结用于路由，选择相关文件，然后继续。
- 模糊的“让我更了解我”：使用默认定位文件；如果看不出任务，再简短追问。
- 查看 cards 请求：列出相关文件和理由；除非要求查看内容，否则不粘贴正文。
- 更新记忆请求：记录用户明确提供的记忆；不要导入原始导出。
- 导入请求：先确认范围，再读取原始导出。

## 记忆文件解析

优先使用正式记忆文件：`index.md`、`profile.md`、`deep-profile.md` 和 `cards/*.md`。

如果当前是实验或草稿实例，且只有 draft 文件，则把 `index.draft.md`、`profile.draft.md`、`deep-profile.draft.md` 和 `cards/*.draft.md` 当作当前测试可用记忆。只需说明一次这是草稿实例；除非 Alex 要求，不要把草稿提升为正式文件。

## 定位画像

如果需要快速总体定位，读取：

- `coverage.md`（如果存在）
- `profile.md`

不要默认读取 `deep-profile.md`。只有当 Alex 明确要求深层个人上下文，或任务明显需要时，才读取它。

## 默认卡片

大多数对话读取：

- `coverage.md`（如果存在）
- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`

## 任务路由

如果任务涉及产品设计、规格文档、作品集项目或界面文案：

- `coverage.md`（如果存在）
- `cards/work-projects.md`
- `cards/communication-style.md`

如果任务涉及学习、技能发展或职业成长：

- `coverage.md`（如果存在）
- `cards/learning.md`
- `cards/communication-style.md`

如果任务涉及倦怠、动力、创作身份或长期个人模式：

- `coverage.md`（如果存在）
- `cards/personal-reflection.md`
- `cards/communication-style.md`

只有当 Alex 明确要求深层个人理解，或对话明显需要这一层时，才额外加入 `deep-profile.md`。

## 边界

- 不要默认加载所有卡片。
- 不要默认加载 `deep-profile.md`。
- 除非明确请求，不要进入 Import Mode。
- Runtime Mode 中不要读取原始导入资料。
- 不要把带日期的当前状态当成永久身份。
