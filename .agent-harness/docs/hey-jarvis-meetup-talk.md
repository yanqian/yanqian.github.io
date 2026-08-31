# Hey Jarvis Meetup Talk Content Brief

This repository-owned brief is the editorial source for the standalone English talk at `/talks/hey-jarvis/`. It deliberately does not live in the Obsidian vault and must not be projected through the article publisher.

## Talk frame

- Event theme: real AI workflows beyond a polished demo.
- Duration: about ten minutes.
- Title: **Beyond “It Works”: How Hey Jarvis Became a Real Workflow**.
- Throughline: a voice demo became useful only after real-device failures were turned into observable, recoverable, evaluator-gated development loops.
- Primary visual: use the supplied real Hey Jarvis app screenshot, copied into the standalone page's repository-owned `assets/` directory as `hey-jarvis-app-ui.png`.

## Scene 1 — The real problem

Eyebrow: `01 / The problem`

Heading: `A voice demo became useful only after it failed in the real world.`

Body: I wanted a genuinely hands-free Mac assistant: say “Hey Jarvis,” ask a question, follow up, interrupt a long answer, say goodbye, and trust that it has returned to local wake listening—even when the Mac is locked.

Supporting point: The first demo worked quickly. The daily workflow emerged only after microphones, speakers, lock screen behavior, and long-running lifecycle failures became part of the design.

## Scene 2 — One complete loop

Eyebrow: `02 / The useful unit`

Heading: `One wake becomes a complete conversation.`

Lead: The useful unit is not one answer. It is one closed loop.

Three stages:

1. **Wake** — “Hey Jarvis” is detected locally, then a cached acknowledgement tells me it heard me.
2. **Talk** — One Realtime session supports questions, follow-ups, local bounded tools, and natural interruption.
3. **Return** — “Goodbye” closes remote media, releases the microphone, and restores local wake listening.

Boundary line: `Before wake: local only · After wake: OpenAI Realtime · After goodbye: local again`

Link: `Watch the recorded English demo` → `https://www.youtube.com/watch?v=Cpv3dhFmS3M`

## Scene 3 — Architecture as ownership

Eyebrow: `03 / The architecture`

Heading: `The architecture is really a microphone handoff.`

Flow:

1. Local Python/TFLite wake detector owns the microphone while waiting.
2. After wake, Python releases the microphone and WKWebView reuses its warm media permission.
3. WebRTC and OpenAI Realtime own the live conversation, tools, and interruption.
4. Goodbye tears down remote media before local wake listening resumes.

Two design rules:

- Nothing leaves the Mac before wake, protecting privacy and avoiding idle Realtime cost.
- Python and WKWebView never own live microphone capture at the same time.

## Scene 4 — Three failures that changed the design

Eyebrow: `04 / What failed`

Heading: `The bugs were not edge cases. They defined the product.`

Failure cards:

1. **The acknowledgement heard itself.** Draining speaker audio removed the user's first words, so playback frames are consumed without triggering capture, a bounded pre-roll is kept, and sustained speech gates the restored question opening.
2. **"I'm here" could arrive before Jarvis was ready.** Acknowledgement playback and Realtime initialization can race, so "I'm here" is emitted only after a two-condition readiness barrier confirms both the acknowledgement and the live session are actually ready. The greeting became a verifiable promise instead of hopeful polish.
3. **Lock screen was not sleep.** Wake listening now holds only the bounded idle-sleep assertion it needs, keeps a disabled warm microphone track, stops safely for manual sleep or lid close, and attempts one bounded recovery after resume.

Summary labels: `Audio boundary · Readiness barrier · Operating-system behavior`

## Scene 5 — The AI workflow actually used

Eyebrow: `05 / The workflow`

Heading: `AI accelerated the loop; evidence decided whether a change survived.`

Workflow:

`Real-device failure → SPEC boundary → one verifiable feature → Coding Agent → automated tests and fake smoke → cold-start Evaluator → human audio/device judgment → durable repository evidence`

AI is useful for reading historical code, constructing synthetic-audio regressions, expanding state-machine tests, adding diagnostics, checking protocols and timeouts, and resuming from repository state.

Humans still judge whether an acknowledgement sounds natural, whether interruption works in a real room, whether lock-screen behavior is genuinely usable, when failure should close conservatively, and whether added complexity earns its place.

Key line: `AI speeds up hypothesis → implementation → test. Real microphones, speakers, and human hearing remain the final oracle.`

## Scene 6 — Reusable takeaway

Eyebrow: `06 / The takeaway`

Heading: `Do not scale the demo. First make failure observable.`

Takeaway: Save each real failure as a regression and durable piece of evidence. AI's highest value is not the first generation; it is helping the team repeatedly correct a bounded system without losing context.

Closing question: `In your AI workflow, which outcomes can be evaluated automatically—and which still require human judgment?`

## Public links and product boundaries

- Source: `https://github.com/yanqian/hey-jarvis`
- English demo: `https://www.youtube.com/watch?v=Cpv3dhFmS3M`
- Internal evaluation build: `https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal`
- Related English series:
  - `/posts/publish/building-hey-jarvis/`
  - `/posts/publish/building-hey-jarvis-voice-interaction/`
  - `/posts/publish/building-hey-jarvis-mac-product/`
  - `/posts/publish/building-hey-jarvis-future/`

Do not imply a consumer-ready product. The public evaluation build is for Apple Silicon Macs on macOS 14 or later, is unsigned and not notarized, requires the user's own OpenAI API key, and is not a general consumer release.
