---
title: "AI-Native Software Engineering, Part 2: Harness Engineering and Correctness"
date: "2026-05-23T20:33:47+08:00"
draft: false
tags:
  - ai/codex
  - agent-workflow
  - harness-engineering
  - software-engineering
  - correctness
  - public
  - note
categories:
  - tech
series: "AI-Native Software Engineering"
seriesOrder: 2
topics:
  - ai-native-software-engineering
  - ai-coding
  - software-engineering
---

Why the most important part of AI-native software engineering may not be generation, but constraint.

This is Part 2 of the AI-Native Software Engineering series.

It continues from [AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding](/posts/publish/agentic-coding-mental-models-and-the-new-depth-of-software-engineering/).

The previous question was:

```text
If understanding no longer comes mainly from writing code,
how do humans build mental models in an agentic workflow?
```

The next question is:

```text
If implementation is delegated,
where does correctness come from?
```

The conversation around AI-assisted software development often focuses on one thing:

How much more software can we generate?

Faster coding.

Longer context.

Autonomous agents.

Multi-file edits.

Self-healing workflows.

But after building projects with AI agents for a while, I started arriving at an opposite conclusion:

```text
The most important engineering problem is not how to make AI more autonomous.

It is how to make AI more constrained.
```

Because unrestricted generation is rarely the bottleneck.

Correctness is.

In this article, constraints are not about creativity or search space yet.

They are about correctness:

```text
How do we make generated implementation safe to trust?
```

## The Classical Software Assumption

Traditional software development assumes something simple:

```text
Human
-> Implementation
-> Verification
```

The person writing the system also builds understanding.

Verification is often implicit.

You trust implementation because you produced it.

This scales surprisingly well for small teams.

Until complexity increases.

## AI Breaks This Assumption

Agentic coding changes the structure.

Now the loop becomes:

```text
Human
-> Intent
AI
-> Implementation
Human
-> Review
```

At first glance this seems efficient.

But there is a hidden issue.

Review is much cheaper than implementation.

And because review is cheaper:

```text
People approve changes they do not fully understand.
```

Especially when:

- multiple files changed
- abstractions evolved
- framework conventions shifted
- generated code appears reasonable

The danger is subtle.

The system may work.

Until it doesn't.

## Generation Is Cheap. Correctness Is Expensive.

Once implementation cost collapses, something else becomes dominant:

Verification.

This is where harness engineering becomes important.

A harness is not a test suite.

A harness is an executable definition of acceptable behavior.

Instead of saying:

```text
Build me a notification system.
```

You define:

```text
Given:
1000 requests

Expect:
p95 < 200ms

Failure:
Retry <= 3 times

Invariant:
No duplicate delivery
```

Now correctness exists outside implementation.

## Harnesses Are Contracts

A good harness acts like a contract.

It defines:

```text
Inputs
What conditions exist?

Outputs
What outcomes are acceptable?

Constraints
What cannot happen?

Failure Modes
What should happen under stress?

Recovery
How does the system return?
```

Example:

```text
Feature:
Upload image

Accept:
<2s response

Reject:
Files >10MB

Guarantee:
Metadata consistency
```

AI may generate ten implementations.

The harness selects one.

## Constraints Create Search Space

This changed how I think about AI.

Most people imagine AI coding as:

```text
More freedom
-> More capability
```

I increasingly think:

```text
More constraints
-> Better capability
```

Because software is not creativity.

Software is controlled exploration.

Harnesses reduce the search space.

They prevent:

- architectural drift
- hidden complexity
- accidental behavior
- local optimization

The harness becomes the boundary.

## The Engineering Shift

I think software roles may slowly evolve.

Old model:

```text
Engineer
=
Design
+
Implementation
+
Verification
```

Emerging model:

```text
Engineer
=
Intent
+
Constraint
+
Evaluation
```

AI becomes implementation infrastructure.

Humans remain responsible for correctness.

## My Current Workflow

For every feature:

```text
SPEC
-> Acceptance
-> Harness
-> Agent
-> Evaluation
-> Merge
```

And every feature must answer:

```text
Why does this exist?

What must never break?

How do we measure success?

How do we debug failure?
```

If these cannot be written, AI should not start coding.

## Closing Thoughts

AI does not remove engineering.

It removes implementation scarcity.

Which means the scarce resource becomes:

```text
Correctness.
```

And correctness is rarely generated.

It is designed.

Harness engineering is not about empowering AI.

It is about making AI safe to trust.

## Series

1. [AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding](/posts/publish/agentic-coding-mental-models-and-the-new-depth-of-software-engineering/)
2. [AI-Native Software Engineering, Part 2: Harness Engineering and Correctness](/posts/publish/harness-engineering-is-about-limiting-ai-not-empowering-it/)
3. [AI-Native Software Engineering, Part 3: Software as Search](/posts/publish/software-is-becoming-search-why-engineers-are-turning-into-constraint-designers/)
4. [AI-Native Software Engineering, Part 4: Human Judgment Against Vibe Coding](/posts/publish/against-vibe-coding-why-human-judgment-still-matters/)
