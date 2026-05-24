---
title: "Remote Agent Workflow"
aliases:
  - Remote Agent Workflow Series
  - Remote AI Development Workflow
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
selected: true
excludeFromLatest: true
---

# Remote Agent Workflow

This series is about moving from mobile SSH to a durable, repository-backed AI agent workflow.

The starting point was simple: I wanted to keep local Codex work moving when I was away from my Mac.

The deeper question became:

```text
How do I turn remote access into a recoverable, verifiable, long-running agent workflow?
```

## Articles

1. [Remote Agent Workflow, Part 1: Remote Mac Terminal for Codex](/posts/publish/remote-mac-terminal-for-codex/)  
   Set up phone-to-Mac terminal access with Tailscale, SSH, Termius, tmux, and caffeinate.

2. [Remote Agent Workflow, Part 2: From Remote Shell to Agent Control Plane](/posts/publish/from-remote-shell-to-agent-control-plane/)  
   Explain why mobile SSH is useful infrastructure but not a good daily interface for long-running agent work.

3. [Remote Agent Workflow, Part 3: Turning Telegram into a Local Codex Control Plane](/posts/publish/turning-telegram-into-a-local-codex-control-plane/)  
   Use a Telegram Bot in polling mode as a lightweight mobile control surface for local Codex tasks.

4. [Remote Agent Workflow, Part 4: In the Repository, Not in the Chat](/posts/publish/in-the-repository-not-in-the-chat/)  
   Treat the repository as agent memory, operating contract, and verification harness.

5. [Remote Agent Workflow, Part 5: What Still Matters After Codex Mobile](/posts/publish/what-still-matters-after-codex-mobile/)  
   Reframe the custom workflow after official Codex Mobile: not as a replacement, but as a project-side workflow adapter.

## Core Progression

```text
Remote terminal
  -> remote runtime
  -> mobile control plane
  -> repository memory
  -> repository harness
  -> workflow adapter
```

The goal is not to prove that one interface is better than another.

The goal is to make AI coding agents work inside a project workflow that can be resumed, verified, and improved over time.
