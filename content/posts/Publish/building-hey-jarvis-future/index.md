---
title: "The Future of Hey Jarvis: When AI Needs an Entry Point"
date: "2026-08-13T14:13:57+08:00"
draft: false
translationKey: building-hey-jarvis-future
tags:
  - ai/voice-agent
  - ai-hardware
  - platform
  - public
  - note
categories:
  - tech
series: Building Hey Jarvis
seriesOrder: 4
topics:
  - hey-jarvis
  - voice-agent
  - ai-hardware
  - platform-power


---

In [the first article in this series](/posts/publish/building-hey-jarvis/), I explained that Hey Jarvis grew out of a small need. When my wife and I were talking before bed and a question came up, we wanted to ask it aloud and get an answer without reaching for a phone.

I went on to build the Pipeline, Realtime, and Mac App, working through a series of challenges involving [making voice interaction truly work](/posts/publish/building-hey-jarvis-voice-interaction/) and [turning a demo into a Mac product](/posts/publish/building-hey-jarvis-mac-product/).

Having come this far, I can now see one limitation more clearly than ever:

> AI can keep getting smarter, but without a natural, reliable, and trustworthy entry point, it remains just another app that someone has to open deliberately.

At first, it was easy for me to reduce the problem to a more emotionally charged claim: Siri was holding back the development of AI assistants.

I now think that was only half right.

## Siri Is Both an Assistant and a System Entry Point

From the user’s perspective, Siri’s most distinctive advantage may not be the intelligence of its answers. It is that Siri is already part of the system.

It has a wake word, lock-screen access, microphone permissions, a system UI, and an identity that extends across devices. Users do not have to find an app first or understand which background process is running. They simply speak, and the entry point is already there.

Even with a better model, a third-party AI app has little chance of occupying exactly the same position.

Apple has not completely shut out third-party capabilities. Through [App Intents](https://developer.apple.com/documentation/appintents), apps can expose their actions and content in a structured form to Siri, Apple Intelligence, Spotlight, and Shortcuts. The 2026 updates added further support for long-running background tasks, cancellable tasks, cross-device entities, and confirmation of sensitive actions. [Apple has also announced its next generation of Siri AI](https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/), emphasizing personal context, on-screen understanding, web knowledge, and actions across apps.

But there is an important distinction:

```text
Giving an app’s capabilities to the system assistant
≠
Letting the app become the system assistant
```

A third party may provide an action that Siri can invoke. But that does not give it a system-level wake word of its own, allow it to remain continuously available in every state, or let it replace the default voice entry point without friction.

One concrete example is that Apple currently does allow a third-party conversational app to be launched with the iPhone side button. However, the [official assistant activation capability](https://developer.apple.com/documentation/appintents/launching-your-voice-based-conversational-app-from-the-side-button-of-iphone) is available only in Japan, requires a dedicated Side Button Access entitlement, and is subject to regional and device restrictions.

This does not suggest that Apple is unaware of third-party voice assistants’ need for a hardware entry point. Quite the opposite: the entry point matters enough for the platform to define, authorize, and restrict it separately.

## These Restrictions Are Not All Bad

If any app could register a permanent wake word, keep the microphone active from the lock screen, read the display, and take actions across apps, AI assistants might become more convenient—but the system would quickly become difficult to trust.

Users need to know:

- when the microphone is active;
- which audio is processed only on the device and which is uploaded;
- which app receives the content;
- who can access their personal data;
- which actions may run automatically;
- whether payments, messages, or deletions require additional confirmation;
- how to shut down a misbehaving background assistant immediately.

Apple’s restrictions on permissions, background execution, hardware entry points, and app distribution establish entirely reasonable boundaries for security, privacy, battery life, and accountability.

These issues also helped me understand why the system imposes these restrictions. A leftover page might play audio twice. A background thread might reopen the microphone while the app is quitting. After waking from sleep, the interface might incorrectly claim that it is still listening. Diagnostic logs might inadvertently become a conversation history.

The issue therefore cannot be reduced to “openness means progress, while restrictions mean backwardness.”

The real tension is that the platform must protect users. Yet when the most natural system-level voice entry point belongs primarily to the platform’s own assistant, the space available for third-party AI innovation is also determined by the platform’s product roadmap.

## What Hey Jarvis Really Lacks Is Not Another Model

If a smarter, cheaper model—or one better suited to Chinese—appeared today, Hey Jarvis could theoretically switch to it.

But changing the model would not change the fact that Hey Jarvis still runs on a Mac.

A Mac gets closed, goes to sleep, travels to the office, or ends up far from the bed. It is a personal computer first, not a voice device permanently installed in a room. To keep Hey Jarvis available after the screen was locked, I had to deal with power assertions, preserving media tracks, WKWebView recovery, and system permissions. That engineering can improve the experience, but it cannot change what the device was designed to be.

This gradually led me to a broader conclusion:

> The truly scarce resource in voice AI is not the model that generates answers, but an entry point that is low-friction, persistently available, and can be trusted by the user.

Such an entry point requires at least four things:

1. It can be awakened naturally at any time.
2. It clearly indicates when it is listening and when it is uploading data.
3. It has sufficiently reliable input, output, and network connectivity.
4. Its permissions belong to the user rather than being permanently tied to a particular model.

The next step for Hey Jarvis should not simply be to add more models or a few more tools. More models and tools do not solve the entry-point problem.

## Near Term: Become a More Complete Mac Agent

Dedicated hardware is a more distant goal. In the meantime, the Mac version still has several practical avenues for growth.

The first step is proper distribution. The current internal DMG has neither Developer ID signing nor notarization, and it lacks an automatic update mechanism. If more people are going to try it, signing, notarization, a stable bundle identity, upgrades, and rollbacks must all become part of a formal release process.

The second step is to reduce startup friction. Launch at login, a clear indication of background status, and reliable recovery after a system update or crash would make Hey Jarvis feel more like a persistent assistant and less like an app that must be opened manually from time to time.

The third step is to use the system entry points Apple has already made available. Hey Jarvis can expose its actions through App Intents and Shortcuts, allowing the system to understand what it can do. This will not give it a new system-level wake word, but it can make Hey Jarvis less isolated from other Mac workflows.

The fourth step is to turn tools from demonstrations into personal workflows. Weather, time, exchange rates, and stock prices have helped establish the boundaries of tool calling. A genuinely useful assistant, however, should be able to connect—with explicit authorization—to calendars, notes, reminders, and the services I use every day.

The security model must mature alongside those capabilities. Queries can return answers directly. Operations that modify data should clearly show what they will affect. High-risk actions should be auditable, and reversible actions should support undo.

## The Longer-Term Future: A Hardware Entry Point for Personal AI

If I were to take Hey Jarvis beyond the Mac, I would not want to build yet another closed smart speaker.

I would rather think of it as a personal AI peripheral: something that gives a personal AI ears, a voice, and a physical trust boundary without dictating which model or service the user must adopt.

The device’s core capabilities are straightforward:

- a microphone array and echo cancellation suitable for room-scale use;
- on-device wake-word detection;
- a short audio buffer that is not uploaded before activation;
- status indicators hardware-bound to the microphone and networking circuitry;
- a physical mute switch that truly disconnects the microphone;
- a reliable speaker with support for full-duplex conversation;
- device identity, encrypted communication, secure boot, and signed updates;
- a control plane on a phone or Mac for configuring permissions, checking status, and revoking access.

It would not necessarily need to run the most powerful model locally.

The local device could handle activation, audio processing, privacy enforcement, and emergency controls. More complex reasoning could be delegated—depending on the user’s choice—to a Mac, a home server, or a cloud model. Models are replaceable computing resources; the hardware’s role is to provide a stable sensory entry point and trust boundary.

```text
Hardware in the room
→ Local activation and physical privacy controls
→ Personal Agent control plane
→ Replaceable models
→ Authorized tools and personal data
```

This architecture is not an entirely different product from Hey Jarvis as it exists today.

The current project already places local wake-word activation, realtime sessions, tools, language behavior, and privacy logs behind relatively independent boundaries. What will ultimately need to be replaced is the audio entry point, which currently depends on the Mac, WKWebView, and the desktop sleep lifecycle.

## Hardware Does Not Automatically Create Trust

Owning the hardware entry point also means accepting far more responsibility than a Mac App entails.

An always-on microphone in a bedroom cannot earn trust with a statement like “we care about privacy.” Users must be able to tell from its physical state whether the microphone is genuinely disconnected, whether audio is leaving the device, and which Agent is responding.

It must also account for the consent of everyone in the home. The device owner’s right to configure it does not mean that everyone else in the room has automatically agreed to have their voice recorded or uploaded. Children, guests, shared spaces, and sensitive conversations all require stricter boundaries than a personal computer does.

The more powerful the tools become, the greater the risk. Viewing a calendar and turning on a light should not require the same level of authorization as sending messages, purchasing products, or controlling door locks.

The hardware I envision, therefore, is not an all-powerful Agent that is permanently online. It should be a system with limited capabilities by default, permissions granted layer by layer, and a physical off switch that can be used at any time.

Security is not about putting the brakes on AI. It is what allows users to feel safe keeping an entry point open to AI over the long term.

## In the End, the Question Is Not How Smart Siri Is

If Siri AI eventually becomes capable enough to understand personal context and take action across apps, the system may directly absorb some of the value Hey Jarvis was originally meant to provide.

That would not make this project meaningless.

On the contrary, it has helped me break down a vague dissatisfaction into several more specific questions. Model capability, voice experience, system entry points, personal data, permission to act, and trust in hardware are not the same thing.

Siri may become a better AI assistant. Apple may also continue to open more capabilities to third parties. But as long as users cannot freely choose who occupies the most natural entry point, who manages their context, and who acts on their behalf, “personal AI” will still largely mean AI that the platform provides for us.

The future I would rather see is one in which:

- the entry point belongs to the user;
- models can be replaced;
- memories can be migrated;
- tool permissions can be inspected and revoked;
- high-risk actions require confirmation;
- every action leaves an understandable record;
- the hardware clearly indicates when it is listening.

The first version of Hey Jarvis was simply my attempt to find an entry point for AI within the Mac.

Perhaps it will not always live on a Mac. One day, it may have a pair of ears that truly belongs to the individual.

---

Building Hey Jarvis series:

1. [I Built Hey Jarvis: Starting with a Question Before Bed](/posts/publish/building-hey-jarvis/)
2. [The Challenges of Hey Jarvis I: Making Voice Interaction Truly Work](/posts/publish/building-hey-jarvis-voice-interaction/)
3. [The Challenges of Hey Jarvis II: From Demo to Mac Product](/posts/publish/building-hey-jarvis-mac-product/)
4. [The Future of Hey Jarvis: When AI Needs an Entry Point](/posts/publish/building-hey-jarvis-future/)
