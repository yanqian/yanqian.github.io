---
title: "A Podcast Summarizer Taught Me That Summaries Are Not Understanding"
date: "2026-06-10T15:43:19+08:00"
draft: false
tags:
  - ai
  - ai-product
  - knowledge-work
  - software-engineering
  - public
  - note
categories:
  - tech


topics:
  - ai-products
  - knowledge-work
  - software-engineering


---

Someone asked me a simple question about a project on my resume:

```text
Did this software actually solve your problem?
```

It was a good question.

The project was a podcast summarizer.

The source code is public here: [yanqian/podcast-summarizer](https://github.com/yanqian/podcast-summarizer).

The original idea was straightforward.

Long audio is expensive to consume.

If I could transcribe it, summarize it, and read the summary, then maybe I could understand the whole episode without spending an hour listening.

The product assumption looked like this:

```text
long content
  -> transcript
  -> summary
  -> understanding
```

After building it, I realized that assumption was wrong.

Not completely wrong.

But wrong in the way that matters.

The software could summarize.

It could demonstrate an AI workflow.

It could ingest a podcast, process audio, create transcript segments, generate summary segments, and show the mapping between them.

As an engineering demo, it worked.

As a tool for understanding, it did not solve the real problem.

## The Original Problem Was Not Length

At first, I thought the problem was content length.

A podcast episode is long.

A blog post can be long.

A meeting transcript can be long.

So the obvious product idea is compression:

```text
make the content shorter
```

That is what summarization promises.

It gives you fewer words.

It removes repetition.

It turns conversation into structure.

It feels efficient.

But after using the output, I noticed something uncomfortable.

I could read the summary and still not really know what happened.

I knew the topic.

I knew the rough conclusion.

I knew some key points.

But I did not understand the shape of the conversation.

I lost:

- how the idea was introduced
- what question triggered it
- which details were uncertain
- what examples supported it
- what tradeoffs were discussed
- what emotional or practical context mattered
- where the speaker changed direction

The summary was not false.

It was just not enough.

## Summaries Destroy the Path

A good summary preserves destination.

It does not preserve path.

That is the core issue.

Understanding often depends on the path.

When people discuss an idea, the important part is not only the final statement.

It is the movement:

```text
question
  -> context
  -> example
  -> objection
  -> clarification
  -> conclusion
```

A summary tends to collapse that movement into one clean paragraph.

That makes the result easier to scan.

It also removes many of the cues that make the idea understandable.

This is especially true for exploratory content.

Podcasts, interviews, essays, design discussions, and technical conversations often contain partially formed ideas.

The value is not only in the final answer.

The value is in watching the answer become possible.

A summary can tell me:

```text
The speaker argued that X matters.
```

But I often need to know:

```text
Why did X become the important point here?
What problem were they reacting to?
What did they rule out?
What evidence made the argument convincing?
```

That is not only summarization.

That is contextual reading.

## What the Project Actually Demonstrated

The project was still useful as a software project.

It forced me to build a full local workflow:

```text
podcast URL
  -> metadata lookup
  -> audio download
  -> audio chunking
  -> transcription
  -> transcript segments
  -> summary segments
  -> source mappings
  -> frontend viewer
```

That mattered.

The implementation was not just a prompt wrapped in a UI.

It had persistence.

It had idempotent ingestion.

It had local storage.

It had a backend pipeline.

It had a frontend viewer that placed summaries near the transcript segments they came from.

That last detail was important.

The mapping between summary and transcript was already a step beyond plain summarization.

It created the beginning of a better interface:

```text
summary -> source transcript
```

But it stopped too early.

It showed the source.

It did not turn the source into an interactive reading surface.

## The Missing Interaction Was Zoom

The better product model is not:

```text
content -> summary
```

It is:

```text
zoom out
  -> inspect
  -> zoom in
  -> ask
  -> verify
  -> zoom out again
```

A summary is useful for zooming out.

It helps me see the map.

But when something matters, I need to zoom in.

I want to click into a segment and ask:

- What is the context here?
- What did the speaker mean by this?
- What happened before this point?
- What examples support this claim?
- What are the tradeoffs?
- Did they mention an alternative?
- Can you test whether I understood this part?

That interaction changes the product category.

It is no longer a summarizer.

It becomes a reading and reasoning interface over source material.

The summary is only one layer.

The source remains active.

## Evidence-Grounded Q&A

The most natural next feature would not be a better summary prompt.

It would be evidence-grounded contextual Q&A.

The interaction would look like this:

```text
select a summary segment
  -> expand mapped transcript segments
  -> ask a question
  -> answer with citations
  -> highlight source segments
```

The answer should not float above the source.

It should be attached to it.

For every answer, the system should return:

- the transcript segment IDs used
- the timestamp range
- the exact source snippets or paraphrased evidence
- whether the answer used only the selected segment or nearby context
- what is uncertain or not present in the source

This matters because AI answers are easy to trust too quickly.

A fluent answer feels like understanding.

But understanding needs grounding.

The user should be able to ask:

```text
Where did this answer come from?
```

And the product should answer without drama:

```text
Here.
```

Then it should show the original material.

## Better Segmentation Matters More Than Better Chunking

At one point, I wondered whether audio chunking could improve the product.

Maybe smaller chunks would produce better samples.

Maybe finer chunks would improve summarization.

But that is only partly true.

Audio chunking mainly solves pipeline problems:

- file size limits
- retry behavior
- local storage
- transcription boundaries
- operational recovery

It does not automatically solve understanding.

The more important segmentation happens after transcription.

The unit should not be:

```text
whatever audio chunk was convenient for Whisper
```

The unit should be closer to:

```text
one coherent topic movement
```

That means topic segmentation.

A better pipeline would use small transcript units first:

```text
utterances or short transcript segments
```

Then detect topic boundaries.

A practical approach is:

```text
transcript units
  -> embeddings
  -> adjacent-window similarity
  -> candidate topic boundaries
  -> LLM boundary correction
  -> structured chapter output
```

Embeddings can find places where nearby content stops being semantically similar.

But embeddings alone are not enough.

They identify candidate breaks.

A language model can then correct the boundaries using discourse signals:

- new question
- topic shift
- recap
- speaker transition
- conclusion
- example introduced
- objection introduced

The final output should be structured:

```text
chapter title
start segment
end segment
summary
keywords
reason for boundary
```

This is better than fixed-size grouping.

Fixed-size grouping is easy to implement.

But conversations do not respect fixed sizes.

## Why NotebookLM Felt Closer

Eventually I found that NotebookLM was closer to the product I actually wanted.

Not because it produced the perfect summary.

Because it let the source remain queryable.

I could ask follow-up questions.

I could inspect specific sections.

I could move between broad understanding and local detail.

I could test whether I understood a part.

That workflow felt closer to the real job:

```text
not compressing information
but navigating information
```

This changed how I think about AI summarization tools.

The best tool is not the one that produces the shortest accurate summary.

The best tool is the one that helps me build a stable mental model of the source.

Sometimes that requires compression.

Sometimes it requires expansion.

Sometimes it requires evidence.

Sometimes it requires a question.

Sometimes it requires going back to the original text.

## The Real Product Lesson

The project taught me a useful lesson about AI products.

It is easy to start with model capability:

```text
AI can summarize.
```

Then build the product around that capability:

```text
Let's build a summarizer.
```

But the user problem may be different:

```text
I need to understand long material efficiently.
```

Those are not the same problem.

Summarization is a capability.

Understanding is a workflow.

This distinction matters.

A capability can be impressive in a demo.

A workflow has to survive real use.

My summarizer compressed content.

But the real workflow needed navigation:

```text
overview
  -> evidence
  -> local explanation
  -> follow-up question
  -> source verification
  -> synthesis
```

Once I saw that, the product direction changed.

The important feature was no longer:

```text
make the summary better
```

It became:

```text
make the source explorable
```

## What I Would Build If I Continued

If I continued the project, I would not start by changing the prompt.

I would build four things.

First, topic-level chapters.

The app should identify meaningful sections of the transcript, not only audio chunks or fixed segment groups.

Second, evidence-grounded Q&A.

Every answer should point back to transcript segments and timestamps.

Third, zoomable reading.

The UI should let the user move from whole episode summary, to chapter, to segment, to source text, and back.

Fourth, active recall.

The system should generate questions that test whether the user understood a selected section.

That last part is easy to underestimate.

Reading a summary can create the feeling of understanding.

Answering questions exposes whether understanding exists.

## Why I Would Also Stop

But I probably would not continue this project right now.

That is also part of the lesson.

A project does not need to become a company to be valuable.

This one already served its purpose.

It demonstrated an AI-enabled software pipeline.

It helped me practice local-first architecture, backend/frontend boundaries, persistence, model adapters, and resumable processing.

More importantly, it helped me discover that the original product assumption was incomplete.

That is a good outcome.

The honest conclusion is:

```text
The software solved the engineering demo.
It did not solve the understanding problem.
```

And that is worth saying clearly.

Because mature engineering is not only making software work.

It is noticing when working software solves the wrong problem.

## The Better Frame

I would now describe the project differently.

Not as:

```text
I built a podcast summarizer.
```

But as:

```text
I built a local AI pipeline for podcast transcription and summarization,
then realized that summarization is only one layer of a deeper reading workflow.
```

That is a better story.

It shows implementation ability.

It also shows product judgment.

The technical path forward is clear:

```text
semantic segmentation
  -> grounded Q&A
  -> source citations
  -> zoomable reading
  -> understanding checks
```

But the deeper lesson is simpler:

```text
Do not confuse shorter text with better understanding.
```

Summaries are useful.

They are not understanding.

Understanding requires movement between levels:

```text
zoom out
zoom in
verify
ask
return
```

That is the product I was actually looking for.
