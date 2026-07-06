# Memory Lifecycle

Last updated: 2026-07-06

Aiden Memory should keep current context useful without letting old context disappear completely.

The memory system uses three time layers:

- Current Layer: recent state that should guide ordinary use.
- Stable Layer: durable preferences, values, and collaboration patterns.
- History Layer: older context that remains useful but should not dominate current answers.

## Why This Exists

Long-running memory can become inaccurate if every new import only appends more detail.

Users change:

- goals change,
- projects end,
- emotional situations cool down,
- study or work priorities shift,
- old conflicts stop being relevant.

If old context stays in the same priority position as current context, assistants may overfit to outdated versions of the user.

## Layer Definitions

### Current Layer

Use this for the user's recent state.

Typical contents:

- current goals,
- current study/work/project focus,
- active constraints,
- recent emotional or practical context,
- current preferred next steps.

Default window: the most recent 1-3 months, unless the user chooses another range.

Current Layer should be compact and easy to replace.

### Stable Layer

Use this for durable patterns that have remained true across time.

Typical contents:

- communication preferences,
- recurring reasoning style,
- long-term values,
- stable collaboration preferences,
- long-term interests,
- safety boundaries.

Stable Layer should change slowly and only after repeated evidence or user confirmation.

### History Layer

Use this for older context that may still matter but should not drive ordinary responses.

Typical contents:

- past projects,
- past targets or goals,
- resolved emotional situations,
- older conflicts,
- previous life phases,
- archived import summaries.

History Layer should be dated and clearly marked as historical.

## File-Level Guidance

Every generated profile, deep profile, and card should include a `Source Coverage` block near the top:

```text
Source:
Requested range:
Observed range:
Generated on:
Last processed through:
Status:
```

This makes the memory's time boundary visible during ordinary review and runtime use. Users should not need to open `coverage.md` just to know what period a profile or card is based on.

### `profile.md`

Focus on:

- Current Layer,
- Stable Layer,
- short caveats for outdated history.

Avoid long historical narrative.

### `deep-profile.md`

Use explicit sections:

- Current Deep Context,
- Stable Patterns,
- Historical Notes.

The deep profile may be thicker, but older material should be marked as historical so it does not dominate the user's present.

### `cards/*.md`

Each card should separate:

- Stable Facts,
- Current Context,
- Historical Notes,
- Boundaries.

When updating a card, move stale current context into Historical Notes or archive it instead of leaving it as current.

### `coverage.md`

Use coverage to tell the assistant and user what import range the current memory is based on.

Coverage does not decide relevance by itself; it only provides the time boundary.

### `changelog.md`

Use the changelog to record when context moves between layers:

- current to history,
- history to archive,
- new stable pattern promoted,
- stale pattern removed.

## Update Rules

When importing new data or updating memory:

1. Identify what is current, stable, historical, or obsolete.
2. Put recent active context in Current Layer.
3. Promote only repeated or user-confirmed patterns into Stable Layer.
4. Move stale but useful context into History Layer.
5. Remove or archive stale context that no longer helps.
6. Use absolute dates.
7. Ask the user before changing sensitive deep-profile material.

## Runtime Rule

Assistants should prioritize Current Layer first, then Stable Layer.

Use History Layer only when:

- the user asks about the past,
- the current task needs background,
- a current pattern makes sense only with historical context,
- the user explicitly asks for deep personal continuity.

Do not let History Layer override current user instructions.

---

# 中文翻译

最后更新：2026-07-06

Aiden Memory 应该让当前上下文保持有用，同时又不让旧上下文彻底消失。

这个记忆系统使用三个时间层：

- 当前层：最近状态，应当指导普通使用。
- 稳定层：长期偏好、价值观和协作模式。
- 历史层：较旧但仍有参考价值的上下文，不应该主导当前回答。

## 为什么需要这个

长期记忆如果只是不断追加细节，就会变得不准确。

用户会变化：

- 目标会变化；
- 项目会结束；
- 情绪情境会冷却；
- 学习或工作优先级会转移；
- 旧冲突会不再相关。

如果旧上下文和当前上下文拥有同样优先级，助手可能会过度拟合一个已经过时的用户版本。

## 分层定义

### 当前层

用于用户最近状态。

典型内容：

- 当前目标；
- 当前学习/工作/项目重点；
- 活跃约束；
- 近期情绪或实际生活背景；
- 当前偏好的下一步。

默认窗口：最近 1-3 个月，除非用户选择其他范围。

当前层应当紧凑，并且容易替换。

### 稳定层

用于长期保持成立的模式。

典型内容：

- 沟通偏好；
- 反复出现的推理方式；
- 长期价值观；
- 稳定协作偏好；
- 长期兴趣；
- 安全边界。

稳定层应该缓慢变化，只在反复证据或用户确认后更新。

### 历史层

用于较旧但仍可能有用的上下文。

典型内容：

- 过去项目；
- 过去目标；
- 已解决的情绪情境；
- 较旧冲突；
- 过去人生阶段；
- 已归档导入摘要。

历史层应有日期，并明确标记为历史。

## 文件级指导

### `profile.md`

重点放在：

- 当前层；
- 稳定层；
- 对过时历史的简短提醒。

避免写成长篇历史叙事。

### `deep-profile.md`

使用明确分区：

- 当前深层上下文；
- 稳定模式；
- 历史备注。

Deep profile 可以更厚，但旧材料应标记为历史，避免主导用户现在的画像。

### `cards/*.md`

每张卡片应区分：

- 稳定事实；
- 当前上下文；
- 历史备注；
- 边界。

更新卡片时，把过时的当前上下文移入历史备注或归档，不要继续留在当前层。

### `coverage.md`

用 coverage 告诉助手和用户，当前 memory 基于哪段导入范围。

Coverage 本身不决定相关性；它只提供时间边界。

### `changelog.md`

用 changelog 记录上下文何时在层之间移动：

- 当前转为历史；
- 历史转为归档；
- 新稳定模式被提升；
- 过时模式被移除。

## 更新规则

导入新数据或更新 memory 时：

1. 判断哪些是当前、稳定、历史或废弃内容。
2. 把近期活跃上下文放入当前层。
3. 只有反复出现或用户确认的模式才提升为稳定层。
4. 把过时但仍有用的上下文移入历史层。
5. 移除或归档不再有帮助的过时上下文。
6. 使用绝对日期。
7. 修改敏感 deep-profile 内容前先询问用户。

## 运行时规则

助手应优先使用当前层，然后使用稳定层。

只有在以下情况使用历史层：

- 用户询问过去；
- 当前任务需要背景；
- 某个当前模式必须结合历史上下文才能理解；
- 用户明确要求深层个人连续性。

不要让历史层覆盖用户当前指令。
