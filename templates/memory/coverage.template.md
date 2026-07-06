# {{USER_DISPLAY_NAME}} Memory Coverage

Last updated: {{YYYY-MM-DD}}

This file tells assistants and users what time range the current memory instance covers.

## Current Coverage

- Primary source: {{SOURCE_NAME}}
- Requested source range: {{YYYY-MM-DD}} to {{YYYY-MM-DD}}
- Observed source range: {{YYYY-MM-DD}} to {{YYYY-MM-DD}}
- Memory generated on: {{YYYY-MM-DD}}
- Last import/update processed through: {{YYYY-MM-DD}}

## Runtime Notice

When using this memory instance, briefly tell the user:

```text
I am using memory based on conversations observed through {{YYYY-MM-DD}}.
```

Keep this notice short. Do not repeat it every turn unless the coverage matters, the user asks, or the conversation depends on recent changes.

## Import / Update Rules

Before importing or updating memory from raw exports:

1. Read this coverage file if it exists.
2. Report current memory coverage to the user.
3. Parse the new export's actual timestamps; do not rely only on the filename.
4. Report the new export's observed date range.
5. Detect whether the new export is a continuation, overlap, gap, or full rebuild.
6. Ask the user to confirm the update scope before generating or replacing memory.

## Import History

### {{YYYY-MM-DD}} {{SOURCE_NAME}} Import

- Source file: `{{IMPORT_PATH}}`
- Requested range: {{YYYY-MM-DD}} to {{YYYY-MM-DD}}
- Observed range: {{YYYY-MM-DD}} to {{YYYY-MM-DD}}
- Outputs updated:
  - {{OUTPUT}}
- Notes:
  - {{NOTE}}

---

# 中文翻译

最后更新：{{YYYY-MM-DD}}

这个文件告诉助手和用户，当前 memory 实例覆盖了哪一段时间。

## 当前覆盖范围

- 主要来源：{{SOURCE_NAME}}
- 用户请求/文件名范围：{{YYYY-MM-DD}} 到 {{YYYY-MM-DD}}
- 实际观察到的来源范围：{{YYYY-MM-DD}} 到 {{YYYY-MM-DD}}
- memory 生成日期：{{YYYY-MM-DD}}
- 最后一次导入/更新处理到：{{YYYY-MM-DD}}

## 运行时提示

使用这个 memory 实例时，简短告诉用户：

```text
我会基于截至 {{YYYY-MM-DD}} 可观察对话生成的 memory 来回答。
```

这个提示要短。除非覆盖范围很重要、用户询问，或对话依赖近期变化，否则不要每一轮都重复。

## 导入 / 更新规则

从原始导出导入或更新 memory 前：

1. 如果存在本 coverage 文件，先读取它。
2. 告知用户当前 memory 覆盖范围。
3. 解析新导出文件的实际时间戳；不要只依赖文件名。
4. 告知用户新导出实际观察到的日期范围。
5. 判断新导出是连续追加、重叠、存在缺口，还是完整重建。
6. 生成或替换 memory 前，请用户确认本次更新范围。

## 导入历史

### {{YYYY-MM-DD}} {{SOURCE_NAME}} 导入

- 来源文件：`{{IMPORT_PATH}}`
- 用户请求/文件名范围：{{YYYY-MM-DD}} 到 {{YYYY-MM-DD}}
- 实际观察范围：{{YYYY-MM-DD}} 到 {{YYYY-MM-DD}}
- 更新输出：
  - {{OUTPUT}}
- 备注：
  - {{NOTE}}
