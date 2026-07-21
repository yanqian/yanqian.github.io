---
title: "Building a Human-Gated Bilingual Publishing Pipeline with Obsidian and Hugo"
date: "2026-07-22T00:13:30+08:00"
draft: false
translationKey: building-a-human-gated-bilingual-publishing-pipeline-with-obsidian-and-hugo
tags:
  - project
  - obsidian
  - hugo
  - localization
  - publishing
  - public
  - note



topics:
  - publishing
  - obsidian
  - hugo
  - localization


---

In [Building a Private-to-Public Publishing Pipeline with Obsidian, Hugo, and GitHub Pages](https://yanqian.github.io/posts/publish/building-a-personal-blog-with-obsidian-hugo-and-github-pages/), I described the boundary that keeps my private vault separate from my public website.

That solved where an article should live. It did not solve what happens when the same article needs to exist in two languages.

At first, bilingual publishing looked like a translation task: send the Markdown to a model, ask for Chinese or English, and save the response beside the original. In practice, that was the least interesting part of the problem.

The real questions were architectural:

- Which version is the source of truth?
- How do I preserve code blocks, links, images, and Hugo metadata while rewriting the prose?
- How do I know whether a long-running job is active, failed, or never started?
- Who is allowed to move a generated draft onto the public website?

The system I ended up with treats localization as a controlled publishing pipeline, not a translation button.

The core rule is simple:

> Articles are written in Obsidian. Publisher code is maintained in the Hugo repository. Nothing reaches the website until a human approves the generated draft.

![Human-gated bilingual publishing pipeline](assets/bilingual-publishing-pipeline/human-gated-bilingual-pipeline.svg)

---

## The Source Article Stays Canonical

An article may begin in English or Simplified Chinese. The publisher detects the source language and generates the other version:

```text
English source -> Chinese localization
Chinese source -> English localization
```

The original Obsidian note remains canonical. The localized article is a derived projection, not a second source that I edit independently.

This matters because two editable masters drift quickly. A corrected date might reach the English article but not the Chinese one. A rewritten conclusion might appear in one language while the other still reflects an earlier argument. Once both files are treated as originals, every edit becomes a synchronization problem.

The source note only needs to declare that it may enter the publishing pipeline:

```yaml
publish: true
```

Series articles also carry their reading order:

```yaml
series: Remote Agent Workflow
seriesOrder: 2
```

The next article in a series is selected by `seriesOrder`, never at random. This sounds like a small operating rule, but it prevents automation from publishing a valid article in the wrong narrative sequence.

---

## Why One-Shot Translation Was Not Enough

A single prompt has to do too many jobs at once. It must understand the argument, produce natural target-language prose, preserve every fact, and avoid damaging Markdown. When those concerns are mixed together, a fluent result can still be wrong, and a faithful result can still read like a translation.

I separated the work into four stages.

### 0. Understand the Article

The first pass does not translate anything. It extracts the thesis, intended audience, reasoning chain, facts, terminology, voice, and structural artifacts.

This gives later stages a semantic map. They no longer have to infer the author's intent while simultaneously choosing target-language sentences.

### 1. Rewrite for the Target Language

The second pass writes the article for a native reader. It expresses the same ideas without following the source sentence by sentence.

That distinction is important. English and Chinese organize emphasis, subjects, transitions, and rhythm differently. A good localized article should feel as if the author originally thought through the subject in that language.

### 2. Edit as a Native Speaker

The third pass looks only at readability: rhythm, collocation, sentence movement, and traces of source-language grammar.

The editor may improve how the article sounds, but it may not add ideas, remove qualifications, or reorganize the article. Its authority is deliberately narrow.

### 3. Review Factual Consistency

The final model pass compares the localized draft with the canonical source section by section. It checks omissions, additions, reasoning, conclusions, names, dates, numbers, and technical terms.

This reviewer does not get permission to “make the writing better.” It may correct the smallest affected passage, or fail the run when a safe local correction is impossible.

The separation creates a useful tension:

```text
Rewrite for native expression
        +
Edit for native readability
        +
Review against canonical facts
```

Natural prose and factual fidelity are different quality dimensions. The pipeline gives each one its own pass.

The default model is currently `gpt-5.6-sol`. A source note can override the model for any stage when a particular article needs a different tradeoff:

```yaml
understandModel:
rewriteModel:
editorModel:
reviewModel:
```

Keeping these choices in frontmatter makes the exception visible beside the article instead of hiding it in machine-specific plugin settings.

---

## Markdown Is a Contract, Not Just Text

An article is more than prose. It also contains structures that models should not be free to improvise.

After every generated stage, the publisher checks:

- heading hierarchy
- fenced code blocks
- image destinations
- link destinations
- Obsidian wikilink targets and embeds
- footnote identifiers
- table dimensions
- Hugo shortcodes

The treatment of code blocks is intentionally language-aware:

- A `text` fence contains natural language and should be localized.
- A `js`, `sh`, `bash`, `json`, or other code fence is protected byte for byte.
- A shell comment such as `# On the Mac` is code, not a Markdown heading.

This last distinction came from a real failure. A long article once appeared to be stuck during localization. The actual problem was a validator reading comments inside a Shell code block as article headings. Other checks then rejected headings such as `SSH`, `Tailscale`, and `tmux` because they looked like untranslated English.

In addition, all model stages also receive the same terminology conventions. For example:

```json
{
  "source": "control plane",
  "target": "控制面",
  "avoid": ["控制平面"]
}
```

Rewrite, editing, and factual review all receive the same rule. A deterministic final check still stops the pipeline if the preferred term is missing or a rejected variant remains.

Prompts guide behavior. Validators enforce invariants. I need both.

---

## The Publisher Belongs with the Website Code

The first version of the publisher lived only inside my Obsidian vault. That made it easy to run, but difficult to govern.

There was no reliable version history, no CI coverage, and no simple way to prove that the installed QuickAdd script matched the code I thought I was testing. A plugin reload could even leave an older user-script module in memory.

The canonical publisher now lives in the Hugo repository:

```text
tools/obsidian-publisher/
├── publish-note.js
├── terminology.json
├── prompts/
├── tests/
└── bin/
    ├── publish-note
    └── install
```

The repository owns the runtime, prompts, terminology, installer, tests, and operational runbook. Obsidian receives installed copies under `Scripts/`.

Before a run, the launcher checks that the installed runtime, all prompts, and the terminology file have the same hashes as their canonical repository versions. It also verifies the required tools and confirms that GitHub Publisher has periodic synchronization disabled.

This creates a clean responsibility split:

| Location | Responsibility |
| --- | --- |
| Obsidian source note | Canonical writing and article metadata |
| Obsidian `Publish/` | Generated bilingual drafts awaiting review |
| Hugo repository `tools/` | Versioned publisher implementation and tests |
| Hugo `content/posts/Publish/` | Approved content synchronized from Obsidian |
| GitHub Pages | Built public site |

The writer's workspace stays optimized for writing. The software repository stays optimized for engineering discipline.

---

## Draft Generation Is Not Publication

This is the most important boundary in the system:

> `Publish Note` generates drafts. It does not grant permission to publish them.

The command creates a paired projection inside the vault:

```text
Publish/<slug>/
├── index.md
├── index.zh.md
└── assets/
```

Both documents share a `translationKey`, which Hugo uses to connect the English and Chinese pages.

At this point the process stops. I review the target-language draft for naturalness, terminology, title quality, omissions, misunderstandings, and series order.

Only after I explicitly say “publish” may the separate `Sync Published Site` workflow run.

GitHub Publisher is configured accordingly:

```json
{
  "selectedPaths": ["Publish"],
  "publishTags": [],
  "syncInterval": 0
}
```

These values encode three boundaries:

- Only the generated `Publish/` projection may leave the vault.
- Tags cannot accidentally select source notes elsewhere in the vault.
- A timer cannot bypass human review.

This last control was added after delayed synchronization commits appeared even though no draft had been approved. The plugin still had a nonzero sync interval. Turning the interval off was not merely a convenience change; it made human authorization part of the architecture.

---

## One Article's Release Flow

The supported workflow begins in the Hugo repository with a preflight check:

```sh
tools/obsidian-publisher/bin/publish-note doctor
```

Then I start localization exactly once:

```sh
tools/obsidian-publisher/bin/publish-note publish
```

The launcher resolves the real QuickAdd command ID, verifies the active note and `publish: true`, executes the command, and waits for a structured status transition. It does not use an `obsidian://quickadd` URL, because focusing Obsidian is not proof that a command ran.

Progress is observable through:

```sh
tools/obsidian-publisher/bin/publish-note status
```

After the bilingual files appear, I inspect them in Obsidian. The workflow pauses until explicit human approval.

Once approved, `Sync Published Site` copies the projection into:

```text
content/posts/Publish/<slug>/
```

I inspect the remote commit's file list to confirm that it contains only the approved article. The repository verification entry point then runs the publisher tests, site tests, Python syntax checks, and a production Hugo build:

```sh
./init.sh
```

Pushing `main` triggers GitHub Actions and deploys GitHub Pages.

The result is deliberately not a one-click release. It is a low-friction flow with one meaningful pause.

---

## Long Articles Need Observable Recovery

The failure that shaped this design took about 47 minutes to diagnose. Most of that time was not useful model work. It was waiting without knowing whether anything was actually running.

The durable system now distinguishes three states:

```text
status=running + fresh lock
    -> wait; do not start another run

status=failed
    -> inspect the error, fix the cause, and resume from completed cache

lock older than 30 minutes
    -> confirm no request is active, then run publish-note recover
```

Every AI request has a five-minute logical timeout. Long articles are split at second-level headings. Completed editing and review chunks are cached, so a retry does not pay for work that already succeeded.

This changed the operator experience. Instead of guessing from elapsed time, I can ask the system what it knows. Instead of reloading plugins and clicking again, I can tell whether a run is live, failed, stale, or resumable.

Automation becomes trustworthy when its uncertainty is visible.

---

## What This Pipeline Is Really Protecting

The first publishing pipeline protected the boundary between my private knowledge system and the public web.

The bilingual pipeline adds three more boundaries:

1. **Source and derivative** — one canonical article, two public-language projections.
2. **Prose and structure** — models may rewrite language, but protected Markdown must remain stable.
3. **Generation and authorization** — automation may prepare a release, but a person decides whether it leaves the vault.

That last boundary is the one I care about most.

AI can understand, rewrite, edit, and compare. Tests can detect structural damage. Caches and locks can make long jobs recoverable. None of those mechanisms can decide that I have finished reading the article and am willing to put my name on it.

The final system is therefore not fully automatic, and that is intentional.

It automates the expensive repetition while preserving the one decision that should remain human: whether the article is ready to become public.
