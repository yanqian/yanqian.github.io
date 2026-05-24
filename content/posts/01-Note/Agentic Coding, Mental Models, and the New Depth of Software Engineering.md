---
title: "AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding"
aliases:
  - "Agentic Coding, Mental Models, and the New Depth of Software Engineering"
  - "Agentic Coding and Mental Models"
  - "AI Coding and System Understanding"
tags:
  - ai/codex
  - agent-workflow
  - software-engineering
  - mental-models
  - public
  - note
categories:
  - tech
series: AI-Native Software Engineering
seriesOrder: 1
topics:
  - ai-native-software-engineering
  - ai-coding
  - software-engineering
selected: true
---

# AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding

AI can generate code. Harnesses can validate behavior. But who builds understanding?

This is Part 1 of the AI-Native Software Engineering series.

The series asks a larger question:

```text
When AI lowers the cost of implementation,
what remains scarce in software engineering?
```

This article starts with the first scarce resource:

```text
Understanding.
```

Over the past few months, I've been experimenting heavily with AI-assisted software development.

Not autocomplete.

Not AI as a coding copilot.

But a more agentic workflow:

```text
SPEC
-> Constraints
-> Harness
-> Agent Execution
-> Evaluation
-> Iteration
```

The experience has been fascinating.

I was able to ship projects using languages and frameworks I was not deeply familiar with. Development speed increased dramatically.

For small projects, this felt like magic.

For larger projects, something unexpected happened.

I discovered that implementation velocity and system understanding are not the same thing.

And eventually I hit an uncomfortable realization:

```text
If the AI disappeared tomorrow, I might struggle to continue developing parts of my own system.
```

That realization changed how I think about software engineering.

## The Traditional Model: Understanding Through Implementation

Historically, software engineering looked something like this:

```text
Human
-> Write Code
-> Build Mental Model
-> Operate System
```

Writing code was not only an implementation activity.

It was also a learning mechanism.

You learned by:

- debugging
- refactoring
- tracing execution
- fighting constraints
- making mistakes

Implementation created understanding.

Even if we didn't realize it.

## Agentic Coding Changes the Direction

With AI coding, the loop changes.

```text
Human
-> Describe Goal
AI
-> Generate Implementation
Human
-> Review Output
```

This is powerful.

But something subtle happens.

The implementation layer becomes compressed.

You see results.

You validate behavior.

But your brain never fully constructs the internal model.

You start operating systems that feel increasingly like inherited codebases.

Not because the code is bad.

But because your understanding was outsourced.

## Harness Engineering Solves Correctness, Not Understanding

My response to this problem was to introduce constraints.

Instead of letting AI freely generate software:

```text
SPEC
-> Feature Gates
-> Harness
-> Implementation
-> Evaluation
```

This worked surprisingly well.

Harnesses externalize correctness.

Instead of relying on:

```text
I believe the implementation is correct.
```

You move toward:

```text
The system behavior satisfies explicit constraints.
```

Examples:

```text
Input
-> Expected Output

Load Test
-> Expected Latency

Failure
-> Expected Recovery

Feature
-> Acceptance Criteria
```

This dramatically improves reliability.

But after using this workflow extensively, I realized something important:

```text
Harnesses prove behavior.

Harnesses do not create understanding.
```

## The Problem Is Not Losing Coding Ability

Initially I thought:

```text
Am I becoming dependent on AI?
```

Now I think that was the wrong question.

The real question is:

```text
How do humans build mental models when implementation is delegated?
```

Because modern AI can:

- modify 20 files
- introduce abstractions
- restructure modules
- migrate frameworks

much faster than humans can absorb.

The bottleneck is no longer writing.

The bottleneck becomes understanding.

## A New Skill: Collaborative Deep Diving

I no longer believe the answer is:

```text
Humans must understand every line.
```

That does not scale.

Instead:

```text
Humans need to remain capable of descending into implementation when needed.
```

Think of it as collaborative deep diving.

Normal operation:

```text
Behavior
-> Architecture
-> Constraints
```

Incident mode:

```text
Failure
-> Runtime Trace
-> Code Path
-> Implementation
-> Root Cause
```

AI becomes the exploration engine.

Humans maintain the cognitive loop.

Not:

```text
Human -> Code
```

But:

```text
Human
-> Question
AI
-> Expand Context
Human
-> Build Model
AI
-> Inspect Details
Human
-> Judge
```

## Designing Systems for Diveability

This changed how I think about engineering.

I care less about whether I can manually write everything.

I care more about whether I can re-enter understanding at any layer.

For every feature, I now want:

```text
Why
Why does this exist?

Invariant
What must never break?

Flow
How does data move?

Risk
Where does failure happen?

Debug Entry
Where should I start?
```

Not documentation.

Not code comments.

Understanding interfaces.

## Closing Thoughts

AI lowers the cost of implementation.

That does not eliminate engineering.

It shifts the bottleneck.

From:

```text
Can you build?
```

To:

```text
Can you understand what was built?
```

Harnesses validate.

Agents execute.

But mental models still need to be constructed.

And increasingly, that construction may become a collaborative process between humans and AI.

Not less engineering.

A different kind of engineering.

## Series

1. [[Agentic Coding, Mental Models, and the New Depth of Software Engineering|AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding]]
2. [[Harness Engineering Is About Limiting AI, Not Empowering It|AI-Native Software Engineering, Part 2: Harness Engineering and Correctness]]
3. [[Software Is Becoming Search - Why Engineers Are Turning Into Constraint Designers|AI-Native Software Engineering, Part 3: Software as Search]]
4. [[Against Vibe Coding - Why Human Judgment Still Matters|AI-Native Software Engineering, Part 4: Human Judgment Against Vibe Coding]]
