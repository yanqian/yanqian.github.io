---
title: "远程智能体工作流"
date: "2026-07-21T08:56:56+08:00"
draft: false
translationKey: remote-agent-workflow
tags:
  - ai/codex
  - remote-workflow
  - agent-workflow
  - public
  - note



topics:
  - remote-agent-workflow
  - codex
  - ai-agent-workflow

excludeFromLatest: true
---

![[file-20260601171151749.png]]
这个系列探讨如何从移动端 SSH 走向一套以代码仓库为依托、可以长期运行的 AI 智能体工作流。

起因很简单：离开 Mac 后，我仍然想继续推进本地的 Codex 工作。

但随着实践深入，问题很快变成了：

```text
怎样才能把远程访问转变为一套可恢复、可验证、可以长期运行的智能体工作流？
```

## 系列文章

1. [远程智能体工作流（一）：用手机连接 Mac 运行 Codex](/posts/publish/remote-mac-terminal-for-codex/)  
   借助 Tailscale、SSH、Termius、tmux 和 caffeinate，打通手机到 Mac 的终端连接。

2. [远程智能体工作流（二）：从远程 Shell 到智能体控制面](/posts/publish/from-remote-shell-to-agent-control-plane/)  
   解释为什么移动端 SSH 虽然是实用的基础设施，却不适合充当长期智能体任务的日常操作界面。

3. [远程智能体工作流（三）：把 Telegram 变成本地 Codex 的控制面](/posts/publish/turning-telegram-into-a-local-codex-control-plane/)  
   让 Telegram Bot 以轮询模式运行，把它变成一个轻量的移动端控制界面，用手机就能指挥本地 Codex 任务。

4. [远程智能体工作流（四）：在仓库中，而非聊天中](/posts/publish/in-the-repository-not-in-the-chat/)  
   让代码仓库同时承载智能体记忆、运行约定，并成为 Agent Harness。

5. [远程智能体工作流（五）：Codex Mobile 之后，什么依然重要](/posts/publish/what-still-matters-after-codex-mobile/)  
   官方 Codex Mobile 推出后，重新审视这套自建工作流：它不是替代品，而是项目侧的工作流适配器。

## 核心演进路径

```text
远程终端
  -> 远程运行环境
  -> 移动端控制面
  -> 仓库记忆
  -> 基于仓库的 Agent Harness
  -> 工作流适配器
```

目的并不是证明哪一种界面更好。

真正重要的是，把 AI 编程智能体纳入项目工作流：任务随时可以继续，结果能够验证，整套流程还能随着时间不断改进。
