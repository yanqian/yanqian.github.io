---
title: "The Challenges of Hey Jarvis, Part I: Making Voice Interaction Actually Work"
date: "2026-08-13T13:59:31+08:00"
draft: false
translationKey: building-hey-jarvis-voice-interaction
tags:
  - ai/voice-agent
  - audio-engineering
  - realtime
  - public
  - note
categories:
  - tech
series: Building Hey Jarvis
seriesOrder: 2
topics:
  - hey-jarvis
  - voice-agent
  - realtime-audio


---

In [the previous article](/posts/publish/building-hey-jarvis/), I wrote about how quickly the first Hey Jarvis Pipeline—a serial voice-processing flow—met my original requirements.

I would say, “Hey Jarvis.” It would record my question, send it to the AI, and read the answer aloud.

On a flowchart, the voice assistant looked finished.

But once I started using it, I discovered that the hardest parts of voice interaction often had little to do with what the system recognized or how it responded. The more fundamental questions were harder to answer: When does it start listening? When does it stop? Can it distinguish my voice from its own? And when the conversation ends, who gets the microphone back?

Until those problems are solved, even the smartest model will quickly test the user’s patience.

## The Pipeline’s First Problem: It Can Hear Itself

To let me know it has been activated, Hey Jarvis first plays a short acknowledgment.

Originally, it said, “I’m here.” The Realtime version later used, “Mm-hmm, I’m here. Go ahead.” This sounds like a minor detail, but it led to one of the project’s earliest and most persistent problems.

When the Mac plays the acknowledgment through its speakers, the nearby microphone picks it up as well. If the program waits for playback to end before reading from the microphone, the echo may still be sitting in the audio buffer. To the program, that audio is not inherently distinguishable from something the user has just said.

The result can look like this:

```text
I say, “Hey Jarvis”
→ Jarvis replies, “I’m here”
→ The microphone picks up “I’m here” again
→ Jarvis thinks the user has started speaking
→ It records the wrong question
```

The most straightforward solution is to ignore the microphone completely while the acknowledgment is playing.

But that creates the opposite problem. As soon as I hear “I’m here,” I may naturally start talking—even before the final word has finished playing. If all audio from that period is discarded, the beginning of my question disappears with it.

If I say, “Tomorrow, will it rain in Singapore?”, the system might receive only, “Will it rain in Singapore?” That may still be understandable in this case, but with a different question, losing the first few words could change the meaning entirely.

The eventual solution was not simply to choose between “listening” and “not listening,” but to divide the audio surrounding the acknowledgment into several regions:

- Keep reading from the microphone while the acknowledgment plays so that old audio does not accumulate in the buffer;
- Do not treat segments that are clearly speaker echo, clipping, or overflow as evidence that the user has started speaking;
- Temporarily retain a small, safe segment near the end of playback as a possible beginning of the question;
- Add that candidate audio to the actual recording only if genuine signs of speech continue after the acknowledgment ends;
- If no one continues speaking, quietly return to the wake state without sending a request to the AI.

This logic must also estimate the ambient noise floor and detect sustained speech across a recent group of audio segments, rather than starting a recording in response to a single sudden loud sound. When recording begins, it includes roughly half a second of preceding audio to avoid losing the first word.

What began as a two-state problem—“listening” or “not listening”—became a combined judgment involving echo, background noise, sustained speech, and a pre-recording buffer.

## “I’m Here” Should Be a Promise

In the Pipeline, the acknowledgment mainly indicates that the wake word has been recognized.

In Realtime voice mode, it needs to mean something more specific.

After activation, Hey Jarvis must release the microphone from the local wake-word system, establish a network connection, configure the Realtime conversation, and prepare to play remote audio. Only then can it open the microphone for input. If the acknowledgment plays too early, I may hear “I’m here” and start talking before the Realtime session is ready. What I say will simply vanish.

I therefore gave the acknowledgment a product-level meaning:

> When “Mm-hmm, I’m here. Go ahead” finishes playing, Hey Jarvis should actually be ready to listen to me.

Fulfilling that promise requires two conditions:

```text
Realtime conversation configuration is complete
                         +
Acknowledgment playback is complete
                         ↓
Enable microphone input
```

Those two processes can run concurrently, but user input must remain disabled until both are complete.

I tried several approaches to the acknowledgment.

The original local clip was short and played quickly, but its voice and tone did not quite match the Realtime responses that followed. I later had the Realtime model generate the acknowledgment directly. That sounded more natural, but it added generation time and network latency to every activation.

The final approach was a compromise: I used Realtime to generate and select a natural-sounding fixed acknowledgment, and bundled it with the application as a local asset. After each activation, the browser plays the cached clip while establishing the Realtime conversation in the background. This maintains the continuity of a single voice without regenerating the acknowledgment every time.

In one test on a real Mac, the acknowledgment began playing about 411 milliseconds after activation, and the system enabled input at around 3.4 seconds. That interval included the full acknowledgment, which lasted about 2.4 seconds. The goal, then, was not merely to minimize a latency number. **What the user hears must remain consistent with what the system can actually do.**

## Allowing Interruptions Also Lets Echo into the System

Another essential part of continuous conversation is the ability to interrupt.

If Hey Jarvis is giving a long answer, I should be able to say, “Wait a second,” and have it stop and listen instead of forcing me to wait for the entire response to finish.

That means the microphone cannot simply be turned off while an answer is playing. The system must play the response through the speakers while continuing to monitor the microphone for signs that I have started speaking. This is what makes full-duplex voice so difficult: the more closely it resembles natural conversation, the more input and output must coexist.

With headphones, input and output are relatively easy to isolate. But my original use case involved speaking directly to a Mac in a room, with sound traveling from the built-in speakers back into the built-in microphone.

If echo handling is too weak, Jarvis mistakes its own answer for an interruption from me and cuts itself off. If the filtering is too aggressive, it may erase my real interruption as well.

I eventually combined several layers of handling:

- Ask the browser to use the device’s supported echo cancellation;
- Apply far-field noise suppression to the laptop’s built-in microphone;
- Retain server-side voice activity detection and interruption support;
- Track when remote audio actually starts and stops playing, rather than looking only at when the model finishes generating an answer;
- Test both uninterrupted responses and deliberate interruptions using the Mac’s actual built-in speakers and microphone.

There is no set of parameters here that unit tests alone can prove correct.

Automated tests can verify event ordering, state transitions, and cleanup logic. They cannot tell me whether the sound in the room feels natural, nor can they prove that real speaker echo will not trigger a false interruption. The project therefore continued to treat these as two separate kinds of evidence: offline tests prove that the program follows the protocol, while tests on real hardware prove that what people actually hear and say behaves as intended.

## The Microphone Can Have Only One Owner at a Time

Hey Jarvis actually contains two separate audio worlds.

Before activation, Python reads the microphone locally, listening only for “Hey Jarvis.” After activation, WKWebView takes over the Realtime conversation via WebRTC. When the session ends, the browser must release the microphone before Python can resume local wake-word detection.

The most important constraint in this entire process is:

> At any given moment, the microphone can have only one clearly defined owner.

```text
Local wake-word detection owns the microphone
→ Shut down local input
→ WebRTC acquires the microphone
→ Continuous conversation
→ Shut down WebRTC media
→ Local wake-word detection reacquires the microphone
```

If the handoff happens in the wrong order, the mild outcome is that one side receives no audio. The worse outcome is that both processes believe they are working.

I once encountered a particularly obvious example: an old Chrome Realtime page was still open when a new one launched. The acknowledgment and answer each played twice. The model was not the problem. The system had two media owners operating simultaneously.

After that, “only one owner” stopped being an implementation convention and became a core architectural rule. Every startup, shutdown, timeout, and error-recovery path must return to the same questions: Who owns the microphone now? Has the previous owner truly released it?

## Ending a Conversation Must Be a Complete Path

Starting to listen matters. Stopping matters just as much.

When I say “goodbye,” Hey Jarvis does more than stop generating an answer. It must first block new input, play a short farewell, close the remote audio, microphone track, data channel, and Realtime connection, and only then return the microphone to the local wake-word system.

If any step fails, the system must enter a safe cleanup process within a bounded period. It cannot remain stuck forever in a “stopping” state, nor can it reopen the microphone locally while the old session is still active.

In one real-world test, local wake-word detection resumed about 83 milliseconds after the farewell finished playing. That number is not a permanent performance guarantee, nor does it represent every version of the shutdown flow. It verified something more important: once a conversation ended, the system could genuinely return to waiting for the next “Hey Jarvis.”

To validate that loop, I tested more than a single successful conversation. I broke it down into recurring scenarios: activation and handoff, two consecutive conversational turns, interruption during an answer, recovery after shutdown, and activation of an entirely new session.

A voice assistant cannot stop after answering once. It must be able to return to the beginning, over and over.

## The Hardest Part Is Not Understanding, but Earning Trust

Looking back, all these problems point to the same issue: voice interfaces lack the certainty that screens and keyboards provide.

I can immediately see whether an input field contains text. An interface can show me whether a button has been pressed. With a voice assistant, I can judge its current state only by a phrase, a sound, or a pause.

That is why “Mm-hmm, I’m here. Go ahead” is more than an audio clip.

It is a small but concrete promise: I have been activated. I did not mistake my own voice for yours. I am ready to hear what you say next.

And “goodbye” is more than a courtesy. It means the Realtime connection has ended, the microphone has been released, the local privacy boundary is back in place, and the next activation can begin.

The model determines whether a voice assistant can give an intelligent answer.

These invisible timings and boundaries determine whether people trust that it is truly listening.

In the next article, I will cover a different set of challenges: what happens when this voice system leaves the terminal and browser behind and becomes a real Mac app—including permissions, security, sleep, Settings, process termination, and packaging.

---

The Building Hey Jarvis series:

1. [I Built Hey Jarvis: It Started with a Question Before Bed](/posts/publish/building-hey-jarvis/)
2. [The Challenges of Hey Jarvis, Part I: Making Voice Interaction Actually Work](/posts/publish/building-hey-jarvis-voice-interaction/)
3. [The Challenges of Hey Jarvis, Part II: From Demo to Mac Product](/posts/publish/building-hey-jarvis-mac-product/)
4. [The Future of Hey Jarvis: When AI Needs an Interface of Its Own](/posts/publish/building-hey-jarvis-future/)
