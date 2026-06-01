---
title: "I Built a Small Harness to Stop AI Coding Projects From Forgetting State"
date: "2026-06-01T16:34:20+08:00"
draft: false
tags:
  - ai/codex
  - agent-workflow
  - harness-engineering
  - ai-coding
  - open-source
  - public
  - note
categories:
  - tech


topics:
  - ai-coding
  - codex
  - agentic-coding
  - context-engineering
  - developer-tools
selected: true

---

AI coding agents are powerful.

But long-running AI coding projects break in a very specific way:

- the session is interrupted
- the context becomes too long
- the weekly quota runs out
- tomorrow's agent forgets yesterday's decisions
- the agent changes unrelated files
- the agent marks work done too early

The problem is not that AI cannot write code.

The problem is that AI coding projects often do not have durable project state.

So I built a small open-source template:

[ai-agent-harness-template](https://github.com/yanqian/ai-agent-harness-template)

Its goal is simple:

```text
Make AI coding projects resumable.
```

## This Is Not a Prompt Collection

There are many useful prompt collections.

This is not one of them.

The template is a repository-level harness for long-running AI coding work.

It is designed for tools like:

- Codex
- Claude Code
- Cursor Agent
- similar coding agents

But it does not depend on any one vendor.

The control boundary is the repository.

## The Core Idea

Agents should behave like stateless workers.

They should not rely on chat history.

They should reconstruct context from repository files every time.

The template keeps durable state in files:

- `SPEC.md` for requirements
- `feature_list.json` for executable feature state
- `progress.md` for recovery notes
- `AGENTS.md` for agent rules
- `QUALITY.md` for evaluator criteria
- `runs/` for evidence and handoff records

This means a future agent, a human maintainer, and CI can all inspect the same source of truth.

## Why Chat History Is the Wrong Database

Chat history is useful context.

But it is a bad system of record.

It is not versioned like code.

It is not validated by CI.

It is not easy for another agent to resume from.

And it disappears from the practical workflow when a session ends, context is compacted, or quota is exhausted.

For short tasks, this may not matter.

For long-running coding work, it matters a lot.

The harness moves project memory into the repository.

## Feature State as a Small State Machine

The heart of the template is `feature_list.json`.

It is not just a todo list.

Each feature tracks:

- `id`
- `title`
- `description`
- `acceptance`
- `passes`
- `status`
- `attempts`
- `last_error`
- `priority`

That makes the project state machine-readable.

An agent can pick one unfinished feature.

An evaluator can verify one feature.

CI can check whether the state is valid.

A human can see what happened.

## Evaluation Is a First-Class Role

One mistake I made early with AI coding was treating tests as the whole definition of done.

Tests are necessary.

But they are not always sufficient.

So the template includes `QUALITY.md`, which asks an evaluator to check:

- correctness
- completeness
- maintainability
- test coverage
- recoverability
- safety

The evaluator is not supposed to implement new features.

It is supposed to prevent premature completion.

## Failure Should Improve the Harness

The template also includes a failure-domain loop.

When a feature fails, the failure should not only become another retry.

It should be classified:

- was the requirement unclear?
- did tests miss something?
- did the prompt allow unsafe behavior?
- did the orchestrator lose state?
- did we assume external CLI behavior without evidence?

The failure can then become a better prompt, a better test, a better schema, a better doc, or a new feature.

This idea comes from my broader view of harness engineering:

[Harness Engineering Is About Limiting AI, Not Empowering It](/posts/publish/harness-engineering-is-about-limiting-ai-not-empowering-it/)

The practical lesson is:

```text
Do not just ask the agent to try again.
Make the loop harder to fail in the same way.
```

## The Orchestrator Is Intentionally Boring

The repo includes a small `orchestrator.py`.

But the orchestrator is not the main point.

It does not make agents smarter.

It only:

- runs the startup protocol
- selects one unfinished feature
- dispatches a Coding Agent prompt
- dispatches an Evaluator Agent prompt
- records state transitions

Real agent execution is handled through replaceable adapters:

- `scripts/run-coding-agent.sh`
- `scripts/run-evaluator-agent.sh`

By default, the orchestrator can run in dry-run mode and preview prompts.

That is intentional.

The template should remain vendor-neutral.

## A Tiny Example and a Go Server

The repo includes two examples:

- `examples/tiny-cli/`
- `examples/go-server/`

The Go example is a dependency-free HTTP server with:

- `GET /healthz`
- `GET /greet?name=Codex`

The point is not that these examples are complex.

The point is that the harness can verify real project files, not only markdown.

## How to Try It

Clone the repo:

```bash
git clone https://github.com/yanqian/ai-agent-harness-template.git
cd ai-agent-harness-template
```

Verify the template:

```bash
make ci
```

Use it in a new project:

```bash
make clean
make init
```

Then edit:

- `SPEC.md`
- `feature_list.json`
- `progress.md`

Ask your coding agent to follow `AGENTS.md` and implement one feature at a time.

Validate a feature:

```bash
make validate FEATURE=F001
```

## Real Projects Behind This Template

This template did not start as an abstract framework idea.

It came from using AI agents on real projects where stopping and resuming work was part of the normal workflow.

One project is [home-guard-tg](https://github.com/yanqian/home-guard-tg), a local Telegram bot for checking home camera state, photos, alerts, runtime status, and logs from a Mac.

That kind of project looks small from the outside.

But it touches many moving parts:

- local runtime behavior
- process status
- camera and file access
- Telegram commands
- alerting
- logs
- operational recovery

When an AI agent changes code in such a project, correctness is not only whether a function returns the right value.

It is whether the bot still behaves safely when I am not sitting in front of the machine.

Another project is [agent-remote-tg](https://github.com/yanqian/agent-remote-tg), a Telegram-based workflow for running and supervising coding agents remotely.

That project made the state problem even more obvious.

If the point is to operate an agent remotely, then the workflow itself cannot depend on the current chat session being alive.

The project needs to know:

- what the agent was trying to do
- what feature was active
- what had already passed
- what failed
- what should happen next

In both projects, I kept seeing the same failure pattern.

The agent was not failing because it could not produce code.

It was failing because the project did not always have a durable, inspectable memory of the work.

So the harness became a way to extract that memory into files.

`feature_list.json` records the work.

`progress.md` records recovery state.

`AGENTS.md` tells the next agent how to behave.

`QUALITY.md` explains what completion means.

`runs/` stores evidence and handoff notes.

The template is the reusable version of those lessons.

## Dogfooding

The template dogfoods its own state model.

Its own development history is tracked in `feature_list.json`.

The repo has gone through features such as:

- bootstrapping the harness
- adding an orchestrator
- adding evaluator rules
- adding failure-domain handling
- adding examples
- adding CI
- adding OSS readiness files
- adding `make clean`

There is also a future backlog item for bounded concurrent agent execution.

That may or may not be needed.

For now, sequential execution is safer.

## Why I Built This

I do not think the immediate future of AI coding is just more autonomous agents.

I think the important question is:

```text
How do we make AI-generated work recoverable, reviewable, and safe to continue?
```

For me, the answer starts with repository state.

Not chat memory.

Not one giant prompt.

Not a magical orchestrator.

Just a small harness that makes the workflow explicit.

If you use Codex, Claude Code, Cursor Agent, or another coding agent for long-running work, this might be useful.

Repository:

[github.com/yanqian/ai-agent-harness-template](https://github.com/yanqian/ai-agent-harness-template)
