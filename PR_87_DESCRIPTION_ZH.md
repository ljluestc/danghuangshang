## Thinking Path
> - Issue #87 的核心不是“能不能混用模型”，而是“怎么按职能稳定地混用”：既要保证关键任务质量，又要控制长期成本。  
> - 仓库已有 `openclaw.example.json` 的 provider + agent 映射能力，适合给出可直接落地的分层建议，而不是抽象原则。  
> - 用户明确提到“1 个云端大模型 + 闲置 PC 上 Ollama 小模型”，因此建议应覆盖：任务分层、模型分层、升级机制、失败兜底、与现有部门职责的映射。  
> - 为避免“便宜模型拖慢关键决策”或“强模型成本失控”，需要把“谁默认用强模型、谁默认用快/省模型、何时升级到强模型”写成可执行规则。  
> - 本 PR 描述聚焦给出一套默认可用的职能划分与配置示例，降低首次混合部署的试错成本。  

## 📋 变更类型
- [ ] 🐛 Bug 修复
- [ ] ✨ 新功能
- [x] 📚 文档更新
- [ ] ♻️ 代码重构
- [ ] ⚡ 性能优化
- [ ] 🧪 测试
- [x] 🔧 配置建议

## 🎯 关联 Issue
Closes #87

## 📝 PR 标题建议
`docs(config): add provider-role split guidance for cloud + local models`

## 📝 变更描述
本 PR 提供一套针对多 Agent 团队的 **Provider/Model 职能划分建议**，重点回答：

1. 哪些部门/角色建议默认用云端强模型（高质量、高上下文）  
2. 哪些部门/角色建议默认用本地或低成本模型（高频、标准化任务）  
3. 何时从“便宜模型”升级到“强模型”  
4. 如何在 `openclaw.json` 中配置“双 Provider（云 + 本地 Ollama）”

### 建议的默认分层

#### A. 强模型（云端）——关键决策与高风险任务
- 内阁（规划与 Prompt 优化）
- 都察院（代码审查/安全审查）
- 兵部（复杂架构、疑难编码）
- 任何涉及：架构决策、跨模块排障、安全与合规、关键上线评审

#### B. 快/省模型（本地 Ollama 或低价云模型）——高频执行任务
- 礼部（内容生成/改写）
- 吏部（进度整理、流程跟踪）
- 工部（日常运维脚本、标准巡检）
- 刑部（模板化法务检查，复杂场景再升级）

### 升级触发规则（建议写入部门提示词）
- 本地模型连续两次输出“无法确定/上下文不足/需要更多信息”
- 任务涉及生产环境变更或安全权限操作
- 用户明确要求“高置信度方案 / 最终审查”
- 预估错误成本高于单次强模型调用成本

### `openclaw.json` 双 Provider 示例（云端 + 本地 Ollama）
```json
{
  "models": {
    "providers": {
      "cloud-primary": {
        "baseUrl": "https://your-cloud-provider-api",
        "apiKey": "YOUR_CLOUD_API_KEY",
        "api": "openai-completions",
        "models": [
          { "id": "strong-model", "name": "云端强模型" },
          { "id": "fast-model", "name": "云端快模型" }
        ]
      },
      "local-ollama": {
        "baseUrl": "http://127.0.0.1:11434/v1",
        "apiKey": "ollama",
        "api": "openai-completions",
        "models": [
          { "id": "qwen2.5:14b", "name": "本地中等模型" },
          { "id": "qwen2.5:7b", "name": "本地轻量模型" }
        ]
      }
    }
  },
  "agents": {
    "list": [
      {
        "id": "neige",
        "model": { "primary": "cloud-primary/strong-model" }
      },
      {
        "id": "duchayuan",
        "model": { "primary": "cloud-primary/strong-model" }
      },
      {
        "id": "libu",
        "model": { "primary": "local-ollama/qwen2.5:7b" }
      },
      {
        "id": "gongbu",
        "model": { "primary": "local-ollama/qwen2.5:14b" }
      }
    ]
  }
}
```

### 实施建议（落地顺序）
1. 先给每个部门设置“默认模型”，确保系统稳定可跑。  
2. 再增加“升级触发规则”，避免所有任务都打到强模型。  
3. 最后记录每部门的月调用量与失败率，按数据微调分配。  

## 🧪 测试与验证
- 文档/配置建议类变更，无运行时代码改动。  
- 配置片段已对照现有 `openclaw.example.json` 的 provider/agent 结构编写。  

## ⚠️ 风险评估
- 主要风险是“本地模型质量波动”，可能在复杂任务上出现不稳定输出。  
- 通过“升级触发规则 + 关键部门固定强模型”可显著降低风险。  

## Model Used
- Warp Oz（auto 模型路由，启用本地仓库读取与编辑工具）。

## ✅ 检查清单
- [x] 已包含从问题背景到方案落地的思考路径（Thinking Path）
- [x] 已给出可直接使用的 `openclaw.json` 双 Provider 示例
- [x] 已给出按部门职责的模型分层建议
- [x] 已补充升级触发与风险控制策略
- [x] 已声明本次为文档/建议性质，不包含运行时代码改动
