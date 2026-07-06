# Aiden Memory（中文说明）

[English](README.md) | 中文

Aiden Memory 是一个本地 Markdown Memory Skill，用来把长期 AI 对话整理成可审阅的 cards、profile 和 deep-profile。

它不是数据库服务，不是监控式档案，也不是把一个人的全部人生经历塞进每个新对话。它是一个更小、更克制的东西：当一个人和 AI 花了几个月建立信任、语言、上下文和思考方式之后，这种连续性不应该因为某个平台账号突然不可用、模型更换、工具迁移就突然消失。

Aiden Memory 把这种连续性放回用户自己能检查的文件里。

## 它做什么

Aiden Memory 帮用户：

- 导入 AI 聊天记录；
- 清洗 Codex JSONL 这类噪音很多的来源格式；
- 把不同来源转换成类似 Claude conversations 的统一结构；
- 生成分任务 memory cards；
- 生成默认可读的 `profile.md`；
- 生成需要明确触发的 `deep-profile.md`；
- 在普通新对话里按场景选择相关 cards；
- 让来源时间线和历史层保持可见。

这个项目的目标是一个 **Skill**，不是平台。它是本地的、Markdown-first 的、可审阅的，也应该保持克制。

## 为什么做这个

这个项目起源于一次平台账号突然不可用的经历。那件事让人意识到：有价值的 AI 连续性不应该只活在某个平台账号里。

对有些用户来说，AI 不是一次性的问答框。它会慢慢变成长期的思考伙伴：知道你怎么做计划，怎么写东西，害怕什么，想成为什么样的人，以及你希望别人怎么提醒你、挑战你。失去这种连续性会有一种很细微但真实的失落感，不是因为工具有多神秘，而是因为那些对话确实发生过。

Aiden Memory 想解决的是：既保留这种连续性，又不放弃控制权。

原始导出留在本地。Skill 把它们整理成经过审阅、有日期、可阅读的 memory 文件。未来的助手只读取当前任务真正需要的部分。

## 核心流程

```text
原始导出
  -> 清洗 / 统一 conversation 格式
  -> 生成摘要索引并识别高信号对话
  -> 草拟 cards、profile、deep-profile
  -> 审阅并提升 selected memory
  -> runtime 按场景读取相关 cards
```

普通使用应该读取已有 memory。除非用户明确要求导入或更新，否则不应该读取 raw imports，也不应该重新生成 profile。

## 仓库结构

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

memory/      # 私人的本地 memory 实例，被 git 忽略
imports/     # 私人的原始导出和 normalized imports，被 git 忽略
```

`docs/`、`scripts/`、`templates/`、`examples/` 是可复用的 Skill 层。

`memory/` 和 `imports/` 是用户本地私人数据，应该保持不被 git 追踪。

## Profiles 和 Cards

Aiden Memory 使用三类 memory surface：

- `cards/*.md`：分任务事实和偏好；
- `profile.md`：默认可读的总览 profile；
- `deep-profile.md`：只有明确需要深层个人理解时才读取的高上下文 profile。

每个生成出来的 profile、deep profile 和 card 顶部都应该显示来源覆盖范围：

```text
Source:
Requested range:
Observed range:
Generated on:
Last processed through:
Status:
```

memory 内容按三层组织：

- **Current Snapshot**：最近状态，普通使用优先参考；
- **Stable Patterns**：长期稳定偏好和反复出现的模式；
- **Historical Notes**：过去发生过、仍可能有参考价值，但不应该主导当前判断。

这样可以避免旧导入悄悄覆盖用户现在的状态。

## Skill 模式

Aiden Memory 把“使用记忆”和“生成记忆”分开。

- **Use Memory**：为当前任务读取已有 profile/cards。
- **Route Memory**：判断当前任务应该读取哪些 cards。
- **Add / Update Memory**：捕捉用户明确提供的新记忆，通常先进入 `memory/inbox.md`，审阅后再 promote。
- **Import Memory**：明确读取 raw 或 normalized exports，并生成或重建 memory。

如果用户说“用 Aiden Memory 在这个对话里更了解我”，助手应该默认走 runtime use：判断当前任务，选择相关 cards，说明当前 memory 的覆盖日期，然后继续对话。不要自动导入 raw chats。

## Codex 导入支持

Codex Desktop session 文件是噪音很多的 JSONL。里面可能包含 system/developer messages、tool calls、sandbox approval records 和 runtime metadata。

先运行：

```powershell
node scripts/import-codex-sessions.mjs `
  --source <codex-sessions-dir> `
  --start 2026-06-01 `
  --end 2026-07-06 `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

再生成摘要 / 路由层：

```powershell
node scripts/summarize-normalized-conversations.mjs `
  --input imports/codex/2026-06-01_to_2026-07-06_codex-clean/conversations.normalized.json `
  --out imports/codex/2026-06-01_to_2026-07-06_codex-clean
```

这些脚本只准备 source material，不会直接更新 active memory。

## 当前状态

Aiden Memory 现在是一个早期 Skill MVP。

已经可用：

- 本地 Markdown memory 结构；
- 可复用模板；
- Skill mode 规则；
- Codex JSONL cleaner；
- normalized conversation 格式；
- 确定性 conversation summaries；
- source coverage 时间线；
- current / stable / history 分层；
- synthetic example；
- import scripts 的测试。

仍然是手动或实验状态：

- profile / card 生成质量审阅；
- 从导入到完整 memory 的一键 pipeline；
- ChatGPT export 支持；
- 最终打包成可安装 Codex skill。

## 安全边界

不要在这个项目里保存秘密。

不要保存：

- API keys
- account tokens
- passwords
- recovery codes
- payment details
- private credentials

raw exports 和个人 memory 实例应该留在本地，除非用户明确创建脱敏或合成示例。

## 文档

- [Skill 模式与触发规则](docs/skill-modes.md)
- [导入流程](docs/import-workflow.md)
- [记忆生命周期](docs/memory-lifecycle.md)
- [产品架构](docs/product-architecture.md)
- [实施计划](docs/implementation-plan.md)
- [项目背景与需求](PROJECT_CONTEXT_AND_REQUIREMENTS.md)

## 示例

- [Synthetic Alex example](examples/synthetic-alex/README.md)：一个虚构、可安全发布的示例，展示 source summary、default profile、deep profile、routing file 和 cards。

## 仓库可见性

这个仓库的公开部分应当只包含可复用的 Skill 层。`memory/` 和 `imports/` 这类私人本地目录必须保持 git ignored，不能提交。
