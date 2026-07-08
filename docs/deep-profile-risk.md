# Deep Profile Risk

Last updated: 2026-07-09

Aiden Memory should help preserve continuity, not define a person's identity for them.

This note records an early product lesson from using Aiden Memory: a generated `deep-profile.md` can become dangerously convincing when it turns limited conversation history into a smooth psychological narrative.

## Maintainer Note

I once generated a very detailed `deep-profile.md` from an exported memory file. At first it felt moving and even impressive. It seemed to organize scattered things I had said into a layered explanation of who I was: inner movements, core tensions, fears, patterns, and emotional texture.

Later I realized that this was exactly the dangerous part. The file was not only reminding me what I had said or done. It was beginning to tell me why I was the way I was.

Because I already like self-analysis, the writing felt satisfying and easy to believe. It gave me the feeling of being seen. But that satisfaction was not the same as truth. A profile based on limited conversations should not become a definition of the self.

This became an important lesson for Aiden Memory: if a memory system becomes "too understanding," it can quietly attract the user into depending on the AI's explanation instead of looking at what is happening now.

## What Went Wrong

The problem was not that the generated deep profile was simply false.

The risk was subtler:

- it turned scattered source material into a complete-feeling story;
- it converted assistant inference into confident-sounding self-knowledge;
- it used emotionally resonant language that made the profile feel more certain than it was;
- it explained many different parts of life through one coherent frame;
- it could train future assistants to respond from that frame, creating a feedback loop.

That feedback loop matters. If a deep profile shapes the assistant, and the assistant then shapes how the user understands themselves, the generated memory stops being a passive record. It starts becoming a script.

## Product Principle

`deep-profile.md` is a reflection aid, not an identity authority.

It should help a user notice patterns, question them, and revise them. It should not tell the user who they truly are. Current lived reality and explicit user corrections always override imported memory.

The healthiest use of `deep-profile.md` is as a mirror the user can argue with, not as a script the assistant or user must obey.

## Design Rules

When generating or reviewing a deep profile:

- separate observed facts from assistant hypotheses;
- mark low-confidence or unconfirmed interpretations clearly;
- distinguish user-confirmed patterns from assistant-inferred patterns;
- avoid turning temporary moods, loneliness, anger, fatigue, or life pressure into permanent identity;
- avoid totalizing language such as "core fear," "true self," "deep essence," or "the real reason" unless the user explicitly confirms it;
- keep dates and source coverage visible;
- let current user corrections and lived reality override imported memory;
- use `deep-profile.md` sparingly, and do not let it shape ordinary technical, study, Git, documentation, or logistics tasks.

## Safer Deep Profile Shape

A safer deep profile should prefer sections like:

- Observed Facts
- User-Confirmed Patterns
- Assistant Hypotheses
- Low-Confidence Possibilities
- Current Context
- Historical Notes
- Boundaries And Non-Claims

Each psychological interpretation should make its status clear. If something is only an assistant hypothesis, say so. If something comes from a narrow source window, say so. If something may be outdated, say so.

## What Aiden Memory Should Remember

The goal is not to make deep profiles colder or useless.

The goal is to keep the warmth while reducing false authority. A good deep profile can still feel personal, but it should remain reviewable, dated, partial, and open to correction.

Continuity is valuable. But the user's right to revise themselves is more important than any generated portrait.

---

# Deep Profile 风险

最后更新：2026-07-09

Aiden Memory 应该帮助用户保留连续性，而不是替用户定义自己是谁。

这篇文档记录了 Aiden Memory 早期使用中的一个产品教训：生成出来的 `deep-profile.md` 如果把有限的对话历史组织成一套非常顺滑的心理叙事，会显得异常有说服力，也因此可能变得危险。

## 维护者手记

我曾经从一份导出的 memory 文件出发，让 AI 参考着生成了一份很详细的 `deep-profile.md`。刚读的时候，它很打动我，甚至让我觉得这套东西写得比原生记忆还细、还完整。它把我说过的一些零散事情组织成了一套很有层次的解释：内心运动、核心张力、恐惧、模式、情绪质感。

但后来我意识到，危险恰恰在这里。它不只是在提醒我“我说过什么、做过什么”，而是在开始告诉我“我为什么会这样”。

因为我本来就喜欢分析自己，这种写法会让我觉得很爽、很像被看透，也很容易越读越相信它。但这种爽感不等于真实。建立在有限对话样本上的 profile，不应该变成对自我的定义。

这成为 Aiden Memory 的一个重要教训：如果一个记忆系统做得“太懂你”，它反而可能让用户依赖 AI 给出的解释，而不是回到当下真实发生的事情。

## 问题出在哪里

问题不是生成出来的 deep profile 简单地“写错了”。

风险更隐蔽：

- 它把零散材料整理成了一个看起来很完整的故事；
- 它把助手推断包装成了很确定的自我知识；
- 它使用有情绪吸附力的语言，让 profile 显得比实际更可靠；
- 它能用同一个框架解释生活里的很多部分；
- 它可能训练未来助手按这个框架回应用户，从而形成反馈回路。

这个反馈回路很重要。如果 deep profile 塑造助手，而助手又反过来塑造用户对自己的理解，那么生成出来的 memory 就不再只是被动记录。它开始变成剧本。

## 产品原则

`deep-profile.md` 是反思辅助，不是身份权威。

它应该帮助用户看见模式、质疑模式、修正模式。它不应该告诉用户“你真正是谁”。当前真实生活和用户明确修正，永远优先于旧的导入记忆。

`deep-profile.md` 最健康的用法，是作为一面用户可以反驳的镜子，而不是一份助手或用户必须服从的剧本。

## 设计规则

生成或审阅 deep profile 时：

- 区分可观察事实和助手假设；
- 明确标记低置信度或未经用户确认的解释；
- 区分用户确认过的模式和助手推断出的模式；
- 不要把阶段性的情绪、孤独、愤怒、疲惫或生活压力写成永久身份；
- 避免使用“核心恐惧”“真正的自我”“深层本质”“真正原因”这类过度总括的语言，除非用户明确确认；
- 保留日期和 source coverage；
- 让用户当前的修正和现实生活覆盖旧的导入记忆；
- 谨慎使用 `deep-profile.md`，不要让它影响普通技术、学习、Git、文档或生活事务。

## 更安全的 Deep Profile 形态

更安全的 deep profile 应该优先使用这些区块：

- 可观察事实
- 用户确认过的模式
- 助手假设
- 低置信度可能性
- 当前上下文
- 历史备注
- 边界与非主张

每条心理性解释都应该说明自己的状态。如果只是助手假设，就明确说是助手假设。如果来自很窄的来源窗口，就明确说明来源窗口。如果可能已经过期，也要明确说明。

## Aiden Memory 应该记住什么

目标不是让 deep profile 变得冰冷或无用。

目标是保留温度，同时降低虚假的权威感。好的 deep profile 仍然可以是个人化的，但它必须保持可审阅、有日期、局部、可修正。

连续性很有价值。但用户修正自己的权利，比任何生成出来的画像都重要。
