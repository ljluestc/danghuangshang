# PR 标题（建议）
docs(faq): 澄清 Telegram 多 Bot 提及触发规则，修复“提及一个机器人所有机器人都回答”的使用误区

## 关联 Issue
- Closes #129

## 背景与问题
Issue #129 反馈了两个高频现象：

1. `Bot A @Bot B` 看起来“不触发”
2. 明明只 @ 了一个 Bot，却“所有 Bot 都回复”

这两个现象在 Telegram 多 Bot 同群配置里都可能出现，但根因并不矛盾，而是由 `requireMention` 模式与提及写法差异共同导致。当前文档缺少集中解释，用户很容易把配置问题误判为系统 Bug。

## 根因分析（面向用户的可执行解释）
- 当 `requireMention: true` 时，系统要求**命中该 Bot 的真实 Telegram 用户名 mention**（如 `@silijian_bot`）。  
  使用中文展示名（如 `@司礼监`）通常不会命中。
- 当 `requireMention: false` 时，同群消息默认可触发；多个 Bot 同时允许触发时，就会出现“@一个 Bot，其他 Bot 也回复”的现象。
- 若 Bot 无法读取到必要群消息，还会叠加 Telegram Privacy Mode / 群权限带来的观测偏差。

## 本次改动
文档改动仅涉及 `docs/faq.md`，新增并完善 Telegram 多 Bot FAQ 条目，重点包括：

1. 明确解释 `requireMention: true/false` 下的不同行为与现象对应关系  
2. 给出“多 Bot 同群最稳”推荐方案：
   - 保持 `channels.telegram.groups.<GROUP_ID>.requireMention: true`
   - 使用真实 Telegram 用户名 `@xxx_bot`
   - 为每个 agent 显式配置 `groupChat.mentionPatterns`
   - 必要时关闭 Privacy Mode（或授予群管理员）以保证消息可见
3. 提供可直接参考的 JSON 配置片段，降低误配成本
4. 增加策略提示：若希望“平时自动回复，但 @其他 Bot 时忽略”，应优先从 mention 策略设计入手，而不是放开 `requireMention`

## 改动范围
- `docs/faq.md`（文档增强，无运行时代码改动）

## 验证方式
- 文档自检：核对 FAQ 新增条目与现有配置字段一致（`requireMention`、`mentionPatterns`、群配置路径）
- 场景一致性检查：
  - 场景 A：`requireMention: true` + `@xxx_bot`，仅目标 Bot 响应
  - 场景 B：`requireMention: false`，同群多 Bot 可能并发响应（符合文档说明）

## 风险评估
- 仅文档修改，不涉及运行逻辑变更
- 无兼容性风险，主要收益是减少误判与重复提问

## 用户收益
- 直接解释“为什么会同时出现不触发与全体触发”这组常见困惑
- 提供可落地配置模板，帮助快速定位并修复多 Bot 提及行为问题
- 降低社区支持成本，提高首次部署成功率

## Release Note
完善 FAQ：新增 Telegram 多 Bot 提及触发规则说明与推荐配置，明确“提及一个机器人，所有机器人都回答”的原因与规避方法。
