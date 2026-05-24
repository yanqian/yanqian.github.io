---
title: "AI-Native Software Engineering, Part 3: Software as Search"
date: "2026-05-23T20:33:47+08:00"
draft: false
tags:
  - ai/codex
  - agent-workflow
  - software-engineering
  - constraint-design
  - search
  - public
  - note
categories:
  - tech
series: "AI-Native Software Engineering"
seriesOrder: 3
topics:
  - ai-native-software-engineering
  - ai-coding
  - software-engineering
---

When implementation becomes abundant, engineering starts to look less like construction and more like navigation.

This is Part 3 of the AI-Native Software Engineering series.

It continues from [AI-Native Software Engineering, Part 2: Harness Engineering and Correctness](/posts/publish/harness-engineering-is-about-limiting-ai-not-empowering-it/).

The first article asked:

```text
How does understanding form when implementation is delegated?
```

The second article asked:

```text
How does correctness form when generation is cheap?
```

This article asks:

```text
If implementation keeps getting cheaper,
what are engineers actually doing?
```

Here, constraints shift meaning.

In Part 2, constraints were about correctness.

In this article, constraints are about search:

```text
How do we define the space of acceptable implementations?
```

For most of software history, building software meant constructing software.

You had an idea.

You designed the architecture.

You wrote the implementation.

You tested the result.

The bottleneck was obvious:

```text
Writing code.
```

That assumption shaped how we defined engineering skill.

The best engineers were often the people who could:

- implement faster
- debug faster
- remember more APIs
- master more frameworks
- produce more working code

AI changes that assumption.

Not by replacing engineers.

But by collapsing the cost of implementation.

And once implementation becomes cheap, software starts behaving differently.

It starts behaving like search.

## Classical Engineering: Construction Under Scarcity

Traditional development looked like this:

```text
Idea
-> Architecture
-> Implementation
-> Verification
```

Implementation was expensive.

Every decision had cost.

Every abstraction mattered.

You optimized before building because changing direction was painful.

Engineering was construction.

## AI Changes Construction Into Exploration

With modern coding agents, implementation becomes abundant.

You can generate:

- five architectures
- three refactors
- two database models
- multiple API approaches

in minutes.

Now the workflow becomes:

```text
Intent
-> Generate
-> Evaluate
-> Repeat
```

This no longer looks like construction.

It looks like search.

## Search Already Exists Everywhere

This sounds unfamiliar.

But we already use search systems.

Compilers:

```text
Program
-> Optimization Space
-> Binary
```

Database planners:

```text
Query
-> Execution Plans
-> Result
```

ML training:

```text
Objective
-> Parameter Search
-> Model
```

Modern AI coding may become:

```text
Constraint
-> Implementation Search
-> System
```

Code becomes output.

Not process.

## Search Needs Objective Functions

Search without evaluation becomes chaos.

This is where many AI workflows fail.

People write:

```text
Build me a blog.
```

AI generates.

They iterate randomly.

Eventually something works.

But this is not engineering.

This is wandering.

Search only works when objective functions exist.

Examples:

```text
Latency
Reliability
Cost
Correctness
Developer Experience
Failure Recovery
```

Without objective functions:

```text
Generation never converges.
```

## Constraints Define Possibility

A useful way to think about software:

```text
Implementation explores.

Constraints shape.
```

Imagine asking:

```text
Build an image upload system.
```

Infinite possibilities.

Now constrain:

```text
<500ms response
<50MB files
Retry supported
No duplicate writes
Deploy on Cloud Run
Monthly cost <$100
```

Search space collapses.

Generation improves.

This is not limiting creativity.

This is engineering.

## Engineers Become Search Designers

This realization changed my view of software.

Maybe engineers are gradually moving from:

```text
System Builder
```

toward:

```text
Search Space Designer
```

Responsibilities shift.

Old:

```text
Design
Write
Debug
```

Emerging:

```text
Define Intent
Define Constraints
Evaluate Outcomes
```

Implementation becomes infrastructure.

## The New Technical Skill

If this direction is correct, future technical depth may look different.

Less:

- memorizing syntax
- writing boilerplate
- framework expertise

More:

- defining invariants
- constructing harnesses
- understanding tradeoffs
- designing evaluation loops
- navigating complexity

The question changes from:

```text
Can you build it?
```

to:

```text
Can you define what success means?
```

## Closing Thoughts

Software is not disappearing.

Programming is not disappearing.

But implementation scarcity may be.

And when implementation becomes abundant:

```text
Engineering becomes search.

Search becomes constraint.

Engineers become the people who decide where the search is allowed to go.
```

