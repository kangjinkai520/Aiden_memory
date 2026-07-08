# Aiden Memory（中文说明）

[English](README.md) | 中文

Aiden Memory 是一个本地 Markdown Memory Skill，用来把长期 AI 对话整理成可审阅的 cards、profile 和 deep-profile。

它不是数据库服务，不是监控式档案，也不是把一个人的全部人生经历塞进每个新对话。它是一个更小、更克制的东西：当一个人和 AI 花了几个月建立信任、语言、上下文和思考方式之后，这种连续性不应该因为某个平台账号突然不可用、模型更换、工具迁移就突然消失。

Aiden Memory 把这种连续性放回用户自己能检查的文件里。

## 它做什么

Aiden Memory 帮用户：

- 导入本地 Agent session 文件夹，或者网页版 AI 的聊天记录导出；
- 清洗 Codex JSONL 这类噪音很多的来源格式；
- 把不同来源转换成类似 Claude conversations 的统一结构；
- 生成分任务 memory cards；
- 生成默认可读的 `profile.md`；
- 生成需要明确触发的 `deep-profile.md`；
- 在普通新对话里按场景选择相关 cards；
- 让来源时间线和历史层保持可见。

这个项目的目标是一个 **Skill**，不是平台。它是本地的、Markdown-first 的、可审阅的，也应该保持克制。

## 先看这里

### 5 分钟快速开始

```text
1. Clone 这个仓库。
2. 找到你的聊天记录在哪里：本地 session/history 文件夹，或者网页版导出文件。
3. 告诉 Codex 来源路径和日期范围。
4. 告诉 Codex：“Use Aiden Memory in Import Memory mode to build a draft memory from this source.”
5. 审阅生成出来的 draft files。
6. 把确认过的 draft promote 到 memory/。
7. 以后新开聊天时说：“Use Aiden Memory with memory instance <path-to-Aiden_memory>/memory.”
```

第一次运行是为了生成 memory。之后的新聊天应该使用已经生成好的 memory，而不是每次重新导入原始聊天记录。

最重要的一句话：

> 先导入一次聊天记录，让它生成 memory；之后新开对话时，默认只使用已经生成好的 memory，不要每次都重新导入原始聊天记录。

Aiden Memory 有两个完全不同的动作：

- **Import / Build Memory**：读取本地 sessions 或网页版导出，生成 `cards/`、`profile.md`、`deep-profile.md`、`coverage.md` 和 `index.md`。
- **Use Memory**：普通新对话里，只读取已经生成好的 profile/cards，并且只读取当前任务需要的部分。

大多数日常使用都应该是 **Use Memory**，不是 Import。

### 根据来源选择做法

不同 AI 工具保存聊天记录的方式不一样。用户不需要自己手动清洗或整理格式，只需要告诉 Aiden Memory：数据在哪里，以及要处理哪段日期。

#### 本地 Agent / 桌面端 / CLI 工具

像 Codex Desktop、Claude Code、Cursor 类 Agent，或者其他本地 AI Agent，通常会把 sessions、history 或 logs 保存在本地磁盘上。

这类工具只需要提供：

```text
Source: Codex / Claude Code / Cursor / other local Agent
Session folder: <path-to-session-or-history-folder>
Date range: YYYY-MM-DD to YYYY-MM-DD
Output: draft memory
```

Aiden Memory 应该扫描这个文件夹，按日期筛选，清洗噪音记录，标准化成 AI 友好的 JSON，生成摘要，并在 `memory/experiments/` 下生成 draft memory 文件。

#### 网页版 AI 工具

像 Claude Web、ChatGPT Web 这类网页产品，先检查平台有没有官方导出或数据下载功能。

如果有官方导出：

```text
Source: Claude Web / ChatGPT Web / other web AI
Export file or folder: <path-to-export>
Date range: YYYY-MM-DD to YYYY-MM-DD
Output: draft memory
```

如果没有官方导出，用户就需要先手动下载、复制，或者用其他方式把相关对话保存到本地。Aiden Memory 可以继续处理这些保存下来的文件，但它不能直接读取一个还没有导出或保存到本地的网页登录账号历史。

#### 未知或暂未支持的工具

如果某个工具确实在本地保存了文件，但 Aiden Memory 还不支持它的格式，先提供文件夹路径和少量样例。助手应该检查结构，说明能不能解析，不要静默猜测。

### 第一次使用

1. 确认来源：本地 Agent session 文件夹、网页版官方导出，或者已经保存下来的 conversation 文件。
2. 给助手来源路径和请求的日期范围。
3. 让助手按 Aiden Memory 的 **Import Memory** 模式处理。
4. 让 Aiden Memory 清洗/标准化已支持的来源，并在 `memory/experiments/` 下生成 draft memory 实例。
5. 先审阅生成的草稿，再 promote 到正式 `memory/`。

完成后，通常会有这些文件：

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

默认正式 memory 实例是：

```text
<path-to-Aiden_memory>/memory
```

`memory/experiments/*` 下面的是实验、草稿或测试实例。除非用户明确把某个 experiment 路径指定为 memory instance，否则助手不应该默认读取它们。

### 新开窗口怎么用

新开一个对话时，可以这样告诉助手：

```text
Use Aiden Memory to understand me for this conversation.
Project path: <path-to-Aiden_memory>
Memory instance: <path-to-Aiden_memory>/memory
Follow the skill-modes rules.
```

助手应该：

1. 走 **Runtime / Use Memory** 模式；
2. 读取 `index.md`、`profile.md` 和少量相关 cards；
3. 简短说明当前 memory 截止到哪一天；
4. 继续处理当前任务；
5. 不读取 raw imports，也不重新生成 memory。

### 聊到一半怎么用

如果对话已经进行到一半，用户突然说想用 Aiden Memory，助手应该先根据当前可见对话判断用户正在做什么，再选择最小必要 card set。

例子：

```text
Use Aiden Memory here so you understand my context better.
Project path: <path-to-Aiden_memory>
Memory instance: <path-to-Aiden_memory>/memory
Follow the skill-modes rules.
```

这种情况仍然应该是 **Use Memory**，不是 Import Memory。

### 以后怎么更新

当用户过了一段时间又有新的聊天记录来源时，不要直接全部重建。

先看 `coverage.md`，助手应该告诉用户：

- 现在的 memory 基于哪段日期；
- 新来源覆盖哪段日期；
- 这是追加、重叠、缺口，还是需要完整重建。

更新后的 profile、deep-profile 和 cards 都应该保留 source coverage，让用户知道这份画像基于哪一段时间。

## 为什么做这个

这个项目起源于一次平台账号突然不可用的经历。那件事让人意识到：有价值的 AI 连续性不应该只活在某个平台账号里。

对有些用户来说，AI 不是一次性的问答框。它会慢慢变成长期的思考伙伴：知道你怎么做计划，怎么写东西，害怕什么，想成为什么样的人，以及你希望别人怎么提醒你、挑战你。失去这种连续性会有一种很细微但真实的失落感，不是因为工具有多神秘，而是因为那些对话确实发生过。

Aiden Memory 想解决的是：既保留这种连续性，又不放弃控制权。

本地 sessions 和原始导出都留在本地。Skill 把它们整理成经过审阅、有日期、可阅读的 memory 文件。未来的助手只读取当前任务真正需要的部分。

## 核心流程

```text
本地 sessions 或网页版导出
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

## 新的发现：Deep Profile 风险

Aiden Memory 应该帮助用户保留连续性，而不是替用户定义自己是谁。

在早期使用中，一个重要风险变得很清楚：生成出来的 `deep-profile.md` 如果把零散的对话历史组织成一套非常顺滑的心理叙事，会显得异常有说服力。即使内容不明显错误，这种结构也可能让助手的推断看起来比来源材料本身更确定。

维护者手记：

> 我曾经从一份导出的 memory 文件出发，让 AI 参考着生成了一份很详细的 `deep-profile.md`。刚读的时候，它很打动我，甚至让我觉得这套东西写得比原生记忆还细、还完整。它把我说过的一些零散事情组织成了一套很有层次的解释：内心运动、核心张力、恐惧、模式、情绪质感。
>
> 但后来我意识到，危险恰恰在这里。它不只是在提醒我“我说过什么、做过什么”，而是在开始告诉我“我为什么会这样”。因为我本来就喜欢分析自己，这种写法会让我觉得很爽、很像被看透，也很容易越读越相信它。但这种爽感不等于真实。建立在有限对话样本上的 profile，不应该变成对自我的定义。
>
> 这成为 Aiden Memory 的一个重要教训：如果一个记忆系统做得“太懂你”，它反而可能让用户依赖 AI 给出的解释，而不是回到当下真实发生的事情。

用户应该把任何生成出来的 deep profile 当作一份有日期、局部、可审阅的反思辅助。它不是诊断，不是人格判词，也不是比用户自己的自我理解更权威的版本。

生成或审阅 deep profile 时应该注意：

- 区分可观察事实和助手假设；
- 明确标记低置信度或未经用户确认的解释；
- 不要把阶段性的情绪、孤独、愤怒、疲惫或生活压力写成永久身份；
- 避免使用“核心恐惧”“真正的自我”“深层本质”这类过度总括的语言，除非用户明确确认；
- 让用户当前的修正和现实生活覆盖旧的导入记忆；
- 谨慎使用 `deep-profile.md`，不要让它影响普通技术、学习或生活事务。

`deep-profile.md` 最健康的用法，是作为一面用户可以反驳的镜子，而不是一份助手或用户必须服从的剧本。

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

## 从 Draft 到正式 Memory

本地 sessions 或网页版导出完成清洗和摘要之后，助手应该先创建一个草稿 memory 实例：

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

先审阅草稿，再把它作为正式 memory 使用。确认后，promote 到：

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

替换正式 memory 之前，先把旧版本备份到 `memory/archive/<date-or-reason>/`。

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

- 借助模型生成 profile / cards，并进行质量审阅；
- 从导入到正式 active memory 的一键 pipeline；
- ChatGPT export 支持；
- 最终打包成可安装 Codex skill。

## 不适合用它的场景

Aiden Memory 不是所有“记忆”问题的答案。

不要用它来保存：

- secrets、API keys、tokens、passwords、recovery codes、payment details 或私人凭证；
- 未经用户审阅的自动深层人格画像；
- 每次新聊天都加载某个人的全部历史；
- 替代简单项目说明，比如 `AGENTS.md`、`CLAUDE.md` 或一份很短的偏好文件；
- 把一次性的情绪状态保存成永久身份；
- 未经明确脱敏就公开 raw exports 或个人 memory。

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
