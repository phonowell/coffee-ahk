---
name: task-confirm
description: 🚨 MUST USE IMMEDIATELY when user message starts with "任务：" - Force confirmation of requirements before execution (project)
allowed-tools: Read, Grep, Glob, AskUserQuestion
---

# 任务确认工作流

## 何时使用

**唯一触发条件**：用户消息以 `任务：` 开头

其余情况保持缄默，不主动触发此 skill

## 核心原则

1. **需求不明确必须先确认，禁止模棱两可地推进**
2. **利用上下文**：优先使用上下文已有信息，节省 tokens
3. **效率优先**：直接使用 Read/Grep/Glob 工具，避免调用 Task 工具

## 工作流程

### 1. 理解需求

分析用户开发目标 · 用 Grep/Read 搜索相关代码理解现有实现 · 识别核心概念和不确定的业务逻辑

### 2. 确认理解（强制）

**必须用 `AskUserQuestion` 向用户确认：**

- 列出理解的核心要点（功能/业务概念/改动范围）
- 标注推测的部分（如："推测 XX 是指...，对吗？"）
- 提供预设选项：`理解正确 / 需要调整 / 理解有误`
- **等待确认**后才能继续

### 3. 开发实现

根据确认的需求开发，遵循项目规范
