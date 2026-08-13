---
title: "I Built Hey Jarvis: It Started with a Bedtime Question"
date: "2026-08-13T13:55:06+08:00"
draft: false
translationKey: building-hey-jarvis
tags:
  - ai/voice-agent
  - product-engineering
  - macos
  - public
  - note
categories:
  - tech
series: Building Hey Jarvis
seriesOrder: 1
topics:
  - hey-jarvis
  - voice-agent
  - ai-product


---

My wife and I often talk before going to sleep.

Sometimes we talk about what happened that day. Other times, one small detail leads us into history, technology, health, or some fact that has suddenly crossed our minds. Inevitably, we arrive at a question neither of us can answer, but both of us want answered right away.

The natural thing should be to simply ask.

Instead, one of us usually reaches for a phone, unlocks it, opens an app, taps a text box, and reformulates the question. By the time the answer appears, our original conversation has already been interrupted.

A voice assistant ought to be perfect for this. But Siri often cannot answer what I actually want to know, while more capable AI tends to live inside a window that I have to open deliberately.

What I wanted was simple:

> I wanted to be able to lie in bed, say “Hey Jarvis,” and have it join our conversation and answer the question we had just asked.

So I started building Hey Jarvis.

Feature demo: [**English: Building a Local-First macOS Voice Assistant**](https://www.youtube.com/watch?v=Cpv3dhFmS3M)

Project and download:

- [Source code: yanqian/hey-jarvis](https://github.com/yanqian/hey-jarvis)
- [v0.1.0 INTERNAL-UNSIGNED evaluation build](https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal)

## The First Version Worked Surprisingly Quickly

The first version of Hey Jarvis was a straightforward Pipeline—a sequential voice-processing flow:

```text
Wait locally for “Hey Jarvis”
→ Play an acknowledgment sound
→ Record the question
→ Convert speech to text
→ Ask the model to generate an answer
→ Convert the answer to speech and play it
→ Return to wake-word mode
```

By a purely functional definition, this already met the original requirement.

I no longer had to pick up my phone. I could say the wake word, ask a question, and hear the answer aloud. To avoid continuously uploading everything within earshot, wake-word detection ran locally. Only the question recorded after activation entered the rest of the AI Pipeline.

I also added several deterministic tools. Time and calculations could be handled locally, while weather, exchange rates, and stock prices came from explicit data providers. For information that changes over time, I did not want the model to rely on memory and guess at an answer that merely sounded plausible.

If the goal had been nothing more than a feature demo, the project could probably have ended there.

But once I began using it, I realized something: **being able to ask an AI questions by voice is not the same as having a voice assistant.**

## The Pipeline Could Answer Questions, but It Couldn’t Converse

The first version felt more like a voice-activated command-line program.

I would ask a question, and it would record, think, and play the answer. Then the entire interaction would end. To ask a follow-up, I had to say “Hey Jarvis” again. If the answer ran too long, I could not interject as I would in a human conversation. I simply had to wait for it to finish.

When talking with another person, we rarely notice ourselves doing things like these:

- Hearing a response and knowing the other person is ready to listen;
- Interjecting while the other person is speaking and expecting them to stop;
- Asking “What about tomorrow?” without restating the context;
- Saying “goodbye” and having both sides understand that the conversation is over.

Behaviors that feel almost instinctive in human communication have to become explicit states, events, and boundaries in software.

For example, when Hey Jarvis plays “I’m here,” the microphone may pick up those same words. If this is handled badly, the assistant can mistake its own voice for the user beginning to speak. But if that segment is simply discarded, the first word from a user who starts speaking early may disappear along with it.

Likewise, an interface that says “Listening” does not necessarily mean the system is actually ready to hear me. The network connection, realtime conversation configuration, acknowledgment sound, and microphone input must all become available in the correct order. Otherwise, I may think the system is listening even though nothing I say is reaching it.

These problems made me realize that the model was actually one of the easier parts of the system. What truly shaped the experience was the largely invisible machinery around it.

## From a Single Question to a Real Conversation

So I built a second backend: a realtime voice session, or Realtime.

Local wake-word detection remained the entry point. Once the system heard “Hey Jarvis,” the local wake-word process handed the microphone over to the realtime session. From there, we could ask follow-up questions continuously or interrupt an answer while it was being spoken. When we said “goodbye,” the session closed and returned the microphone to the local wake-word process.

```text
Local wake-word detection
→ Hand over the microphone
→ Establish a realtime voice session
→ Confirm that input is available
→ Continue the conversation / ask follow-ups / interrupt
→ End the session
→ Release browser audio
→ Restore local wake-word detection
```

The most important change was not replacing one API with another.

The basic unit of the Pipeline was a single question. The basic unit of a realtime voice session was a conversation.

For the first time, Hey Jarvis began to resemble what I had originally imagined. Instead of forcing me to package every question as a new command, it could briefly join a conversation already in progress.

## Even After It Could Converse, It Was Still a Development Project

Realtime voice solved the interaction model, but it did not make Hey Jarvis practical for everyday use.

At that point, it still had to be launched from a terminal and relied on a browser to host WebRTC. API Keys, microphone permissions, process termination, and failure recovery all had to be understood by the developer. I could live with that, but if I wanted trusted friends to try it, I could not expect each of them to first learn about Python environments and launch commands.

So I began turning Hey Jarvis into a real Mac App.

In the final architecture, the native app manages windows, permissions, credentials, and processes. The web layer handles realtime voice, while a Python background process retains the proven local wake-word and conversation logic. The point was not to pile on technologies. It was to give each sensitive capability a clearly defined owner.

The API Key is stored in macOS Keychain, and any audio captured before activation remains local. When the app quits, the system goes to sleep, or a session fails, media and background processes must shut down within a defined period. Even if recovery fails, the interface should honestly say “Not listening” rather than show a falsely reassuring green status.

Only after doing this did the project begin to feel less like a program that happened to run and more like a product.

## What Hey Jarvis Is Today

Today, Hey Jarvis is a local-first, BYOK voice assistant for macOS. Wake-word detection is performed locally first, and users provide their own API Keys and retain control over them.

It can wait locally for “Hey Jarvis,” then, once activated, begin a continuous voice conversation in Chinese or English. It supports natural follow-up questions and interruptions. It can also provide the time, weather, exchange rates, and stock prices, as well as perform calculations safely. The app includes Keychain credential management, microphone-permission recovery, redacted diagnostics, sleep and wake recovery, and an internal test build for Apple Silicon Macs.

It also has very clear limits.

The DMG is now publicly available through a GitHub Release for informed testers to download and evaluate. It still has neither a Developer ID signature nor notarization, so it is not a general consumer release. Users must supply their own API Keys, and there is no account system or automatic updating. It is not a SaaS product ready for commercialization, nor does implementing these features somehow give it an inherent moat.

For me, however, the value of this project was never limited to building yet another voice assistant.

It began with a small, genuine need. Along the way, I experienced the full progression from an idea to a Pipeline, then watched actual use expose new problems, saw it evolve into a realtime conversation system, and finally confronted the realities of native applications, security, packaging, and reliability.

## I Originally Thought AI Would Be the Hard Part

When I started, I assumed the hardest challenges would be making the AI smarter, writing better prompts, and integrating more tools.

In practice, the questions I encountered most often were these:

- Who owns the microphone at this exact moment?
- When can the user begin speaking?
- How do I filter out the assistant’s own voice without losing the user’s first word?
- How do I allow interruptions without letting speaker echo trigger false ones?
- After the computer is locked, goes to sleep, or opens Settings, is the system actually still listening?
- If a background thread is shutting down, who can still reopen the audio device?
- How do I deliver Python, models, and native dependencies to another Mac that has no development environment?
- When something goes wrong, how do I preserve enough diagnostic information without recording what the user said?

The model determines what Hey Jarvis can answer.

These questions determine whether I dare to actually turn it on every night.

I started with one small problem: I wanted to ask a question casually during a bedtime conversation without picking up my phone. The Pipeline quickly proved that this was possible. But as I kept building, I realized just how much distance remained between “a program that can answer questions” and “an assistant that can stay with you for the long term.”

In the next article, I’ll begin with the most immediate part of that gap: what it takes to make voice interaction truly work.

---

The Building Hey Jarvis series:

1. [I Built Hey Jarvis: It Started with a Bedtime Question](/posts/publish/building-hey-jarvis/)
2. [The Challenges of Hey Jarvis I: Making Voice Interaction Truly Work](/posts/publish/building-hey-jarvis-voice-interaction/)
3. [The Challenges of Hey Jarvis II: From Demo to Mac Product](/posts/publish/building-hey-jarvis-mac-product/)
4. [The Future of Hey Jarvis: When AI Needs an Entry Point of Its Own](/posts/publish/building-hey-jarvis-future/)
