---
title: "AI-Native Software Engineering, Part 4: Human Judgment Against Vibe Coding"
aliases:
  - "Against Vibe Coding: Why Human Judgment Still Matters"
  - "Against Vibe Coding"
  - "Why Human Judgment Still Matters"
  - "AI Coding and Human Judgment"
tags:
  - ai/codex
  - agent-workflow
  - software-engineering
  - judgment
  - ownership
  - vibe-coding
  - public
  - note
categories:
  - tech
series: AI-Native Software Engineering
seriesOrder: 4
topics:
  - ai-native-software-engineering
  - ai-coding
  - software-engineering
selected: true
---

# AI-Native Software Engineering, Part 4: Human Judgment Against Vibe Coding

You can automate implementation. You can automate evaluation. But judgment remains stubbornly human.

This is Part 4 of the AI-Native Software Engineering series.

It continues from [[Software Is Becoming Search - Why Engineers Are Turning Into Constraint Designers|AI-Native Software Engineering, Part 3: Software as Search]].

The first article asked how understanding forms.

The second asked how correctness forms.

The third argued that software is starting to look like search.

This article pushes back on a dangerous misunderstanding:

```text
If we have agents, harnesses, and constraints,
software can produce itself.
```

That is not true.

In Part 2, constraints helped produce correctness.

In Part 3, constraints shaped implementation search.

This article asks who is responsible for the constraints themselves:

```text
Who decides what should be optimized,
what should be rejected,
and what is worth building at all?
```

After adopting AI-assisted software workflows, I noticed something surprising.

The more capable the implementation became, the more valuable judgment became.

At first this felt counterintuitive.

Shouldn't better AI reduce the importance of human decisions?

Instead, the opposite happened.

Implementation stopped being the bottleneck.

Direction became the bottleneck.

## Vibe Coding Works Until It Doesn't

Most developers have experienced this.

You start with a simple idea:

```text
Build X.
```

AI generates.

You tweak.

It works.

You continue.

Small victories accumulate.

Eventually the project grows.

Then suddenly:

- architecture drifts
- abstractions multiply
- debugging slows
- confidence collapses

The system still runs.

But nobody understands why.

The project enters a strange state:

```text
Everything feels reversible.

Nothing feels controllable.
```

I call this vibe coding.

Not because AI is bad.

But because progress becomes disconnected from deliberate decisions.

## The Illusion of Passing Tests

One common response is:

```text
Just add more tests.
```

I did this too.

Harnesses improved reliability.

Acceptance gates improved stability.

But eventually I realized:

```text
Passing evaluation is not equivalent to delivering value.
```

Example:

```text
Objective:
Increase click-through rate

Result:
Aggressive notifications

Metric:
Improved

Outcome:
Users leave
```

The system optimized correctly.

The objective was wrong.

Engineering did not fail.

Judgment failed.

## Constraints Are Also Decisions

Earlier in this series I argued:

```text
Constraints shape search.
```

I still believe that.

But constraints themselves are human outputs.

Someone decides:

```text
What to optimize
What to ignore
What tradeoffs are acceptable
What failures matter
```

Those decisions are not objective.

They require:

- context
- ownership
- values
- experience

This is where engineering remains deeply human.

## Why Ownership Matters More in the AI Era

Traditional software created natural ownership.

You wrote it.

You maintained it.

You felt responsible.

Agentic workflows weaken this connection.

Now:

```text
Prompt
-> Generate
-> Review
-> Merge
```

Nobody truly owns implementation.

Which creates a dangerous gap:

```text
Authority without understanding.

Progress without responsibility.
```

Ownership must become explicit.

## Judgment Happens at Boundaries

I've started thinking about human judgment differently.

Humans do not need to decide everything.

Humans decide boundaries.

Questions like:

```text
Should this feature exist?
What tradeoff is acceptable?
When is performance sufficient?
What risks are acceptable?
What should never happen?
```

These decisions define the system.

Everything else can be delegated.

## The New Role of Engineers

Maybe engineers are not becoming less important.

Maybe their responsibilities are becoming more concentrated.

Old:

```text
Understand Everything
```

Impossible.

New:

```text
Decide Correctly
```

Still difficult.

Maybe more difficult.

## My Current Rule

When using AI:

I ask three questions before merging.

```text
Would I know where to debug?

Would I defend this design publicly?

Would I still accept this if AI disappeared tomorrow?
```

If the answer is no, I probably do not understand enough.

## Closing Thoughts

AI may eventually generate most software.

Harnesses may verify most behavior.

Evaluation loops may automate most correctness.

But somebody still needs to answer:

```text
Should this system exist?
```

And that question is rarely technical.

Judgment may become the last non-delegatable engineering skill.

## Series

1. [[Agentic Coding, Mental Models, and the New Depth of Software Engineering|AI-Native Software Engineering, Part 1: Mental Models in Agentic Coding]]
2. [[Harness Engineering Is About Limiting AI, Not Empowering It|AI-Native Software Engineering, Part 2: Harness Engineering and Correctness]]
3. [[Software Is Becoming Search - Why Engineers Are Turning Into Constraint Designers|AI-Native Software Engineering, Part 3: Software as Search]]
4. [[Against Vibe Coding - Why Human Judgment Still Matters|AI-Native Software Engineering, Part 4: Human Judgment Against Vibe Coding]]
