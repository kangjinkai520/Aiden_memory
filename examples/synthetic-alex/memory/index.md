# Alex Chen Memory Index

This index controls how to use the Alex example memory.

Alex is an OASST1-derived composite demonstration user, not a real person. The raw source sample is not committed.

## Default Rule

Use existing memory by default. Do not read raw imports or regenerate memory unless Alex explicitly asks for import/rebuild work.

## Default Orientation Set

For vague activation such as "use Aiden Memory to understand me":

- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`
- one clearly relevant task card, if the visible conversation implies one

Mention once that this is a public derived example.

## Task Routing

For business, software implementation, testing, content creation, or practical project advice:

- `cards/work-projects.md`
- `cards/communication-style.md`

For explanations, learning, history, math, simplification, or text rewriting:

- `cards/learning.md`
- `cards/communication-style.md`

For AI memory, assistant persona, continuity, roleplay, or reflective interaction:

- `cards/personal-reflection.md`
- `cards/communication-style.md`

Add `deep-profile.md` only when Alex explicitly asks for deep-profile behavior, AI continuity, persona continuity, or deeper interaction-pattern analysis.

## Add / Update Memory

If Alex provides a new memory or preference:

1. Capture it as a candidate.
2. Ask for review or use explicit approval.
3. Promote it to the relevant card only after approval.
4. Record the change in `changelog.md` if this were a full memory instance.

## Import Mode

Use Import Mode only when Alex explicitly asks to import raw exports, summarize chat history, or rebuild memory from source data.

During Runtime Mode:

- do not read `imports/`;
- do not read raw OASST1 messages;
- do not regenerate cards;
- do not dump full card contents unless asked.

## Boundaries

- Do not treat Alex as a real person.
- Do not infer demographics or private life facts.
- Do not load every card by default.
- Do not load `deep-profile.md` by default.
- Do not treat sample-derived patterns as permanent identity.

---

# 中文翻译

这个 index 控制如何使用 Alex 示例 memory。

Alex 是基于 OASST1 小样本生成的复合演示用户，不是真实人物。原始来源样本不提交到仓库。

## 默认规则

默认使用已有 memory。除非 Alex 明确要求导入或重建，否则不要读取 raw imports，也不要重新生成 memory。

## 默认定位文件

当用户模糊触发，比如说“use Aiden Memory to understand me”：

- `profile.md`
- `cards/identity.md`
- `cards/communication-style.md`
- 如果当前对话明显涉及某个任务，再加一张相关 task card

只需说明一次：这是公开派生示例。

## 任务路由

商业、软件实现、测试、内容创作或实际项目建议：

- `cards/work-projects.md`
- `cards/communication-style.md`

解释、学习、历史、数学、简化说明或文本改写：

- `cards/learning.md`
- `cards/communication-style.md`

AI 记忆、助手人格、连续性、角色扮演或反思型交互：

- `cards/personal-reflection.md`
- `cards/communication-style.md`

只有当 Alex 明确要求 deep-profile 行为、AI 连续性、人格连续性，或更深层交互模式分析时，才加入 `deep-profile.md`。

## Add / Update Memory

如果 Alex 提供新的记忆或偏好：

1. 先作为候选记录。
2. 等待审阅，或使用明确批准。
3. 批准后再提升到相关 card。
4. 如果这是完整 memory 实例，则在 `changelog.md` 记录变更。

## Import Mode

只有当 Alex 明确要求导入原始导出、总结聊天记录，或从来源数据重建 memory 时，才使用 Import Mode。

Runtime Mode 中：

- 不读取 `imports/`；
- 不读取 OASST1 原始消息；
- 不重新生成 cards；
- 除非被要求，不粘贴完整 card 内容。

## 边界

- 不要把 Alex 当成真实人物。
- 不要推断人口学或私人生活事实。
- 不要默认加载所有 cards。
- 不要默认加载 `deep-profile.md`。
- 不要把样本派生模式当成永久身份。
