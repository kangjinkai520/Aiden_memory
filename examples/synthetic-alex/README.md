# Example: Alex Chen

This example shows what Aiden Memory output can look like without exposing a real user's private memory.

Alex Chen is a composite demonstration user derived from a small local sample of [OpenAssistant/oasst1](https://huggingface.co/datasets/OpenAssistant/oasst1) validation conversations. The source sample used for this local experiment contained 8 English message trees, 48 total messages, and 24 human messages. No topic or safety filtering was applied when selecting the local sample.

The raw OASST1 sample is not committed. Only the derived source summary and memory files are included here.

## What This Example Demonstrates

- A source summary derived from public assistant-style conversation data.
- A default-readable `profile.md`.
- An explicit-trigger `deep-profile.md`.
- A task routing `index.md`.
- A few task-specific cards.
- The difference between private raw imports and public derived examples.

## Files

```text
source/
  synthetic-chat-summary.md

memory/
  profile.md
  deep-profile.md
  index.md
  cards/
    identity.md
    communication-style.md
    work-projects.md
    learning.md
    personal-reflection.md
```

## Data Note

The public files in this directory are derived examples, not a direct copy of the raw OASST1 conversations. The raw local corpus lives under `imports/openassistant/`, which is ignored by git.

---

# 中文说明

这个示例展示 Aiden Memory 的输出大概可以是什么样，同时不暴露真实用户的私人 memory。

Alex Chen 是一个演示用的复合用户，基于本地抽样的 OpenAssistant/oasst1 validation conversations 生成。这个本地样本包含 8 个英文 message trees、48 条总消息、24 条 human messages。抽样时没有刻意删除敏感、危险或争议话题。

仓库里不提交 OASST1 原始对话，只提交整理后的 source summary 和 memory 文件。
