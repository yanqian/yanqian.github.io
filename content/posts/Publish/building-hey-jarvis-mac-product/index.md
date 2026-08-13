---
title: "The Hard Parts of Hey Jarvis II: From Demo to Mac Product"
date: "2026-08-13T14:08:41+08:00"
draft: false
translationKey: building-hey-jarvis-mac-product
tags:
  - ai/voice-agent
  - macos
  - product-engineering
  - public
  - note
categories:
  - tech
series: Building Hey Jarvis
seriesOrder: 3
topics:
  - hey-jarvis
  - macos
  - product-engineering


---

In [the previous article](/posts/publish/building-hey-jarvis-voice-interaction/), I wrote about how Hey Jarvis handles confirmation sounds, echo, interruptions, and microphone handoffs.

Once those capabilities were working in the terminal and browser, I briefly thought I had finished the hardest part of building the product.

Later, I realized I had proved only that a single voice interaction flow could work.

A Demo needs to succeed once in an environment I have prepared. A product must contend with first-time installation, denied permissions, window switching, a locked Mac, system sleep, subprocess crashes, and application shutdown. It must not only succeed; when it cannot, it must stop in a state that is safe, honest, and recoverable.

> A Demo proves that something can happen. A product must decide what to do when anything else happens.

## Productizing It Means More Than Putting a Window Around Python

The earliest version of Hey Jarvis ran from Python. Realtime mode also required opening a page in Chrome so the browser could handle the WebRTC microphone and voice playback.

That setup worked well during development because I could observe and debug each layer independently. But simply wrapping it in a window would not eliminate the assumptions that held true only on my computer:

- The correct versions of Python and its dependencies were already installed;
- The project directory and `.env` file were where the program expected them to be;
- The Chrome page had not been opened twice;
- The development environment could read the API Key;
- If a process misbehaved, I knew where to find the logs and how to restart it.

A product should not require users to understand any of these things.

Before building the actual Mac App, I created a completely isolated Tauri experiment. It answered just one question: on a real Apple Silicon Mac, could WKWebView obtain microphone permission, play Realtime audio, support natural interruptions, release its media resources, and return control of the microphone to Python?

Once the experiment succeeded, I stopped adding features to that code. Instead, I rebuilt the product around its own application shell.

That may seem like an extra step, but it helped me separate two very different questions:

```text
Experiment: Is this technical approach viable?
Product: Can it protect secrets, fail correctly, recover, and be reproduced on another computer?
```

## Three Runtime Environments, Three Sets of Responsibilities

The finished Hey Jarvis Mac App has three parts:

- Rust/Tauri handles application identity, windows, the menu bar, Keychain, system permissions, and subprocess management;
- WKWebView handles the Realtime microphone connection, WebRTC, voice playback, and interruptions;
- A Python background process, or sidecar, runs alongside the main app and handles local wake detection, session coordination, tools, and the voice logic that had already been validated.

The value of this structure is not that it uses three technologies at once. It is that every sensitive capability has a clearly defined owner.

The browser is best suited to WebRTC, but it should not receive a long-lived API Key. Python already has mature wake and conversation logic, but its runtime is not the right place to manage macOS application identity, permissions, or lifecycle. The native layer can access Keychain, system lifecycle events, and application directories, so it establishes the security boundary and supervises the other two layers.

Each time the native app starts, it creates exactly one Python sidecar and communicates with it through a versioned message protocol. Messages include sequence numbers and a random identity generated for that launch. Unknown fields, duplicate sequence numbers, oversized messages, and content that might contain credentials are rejected.

This may sound strict, but it addresses a practical problem. When three runtime environments make up one product, I cannot simply assume that they will cooperate in the correct order. Each side must know what it can trust and reject stale messages that do not belong to the current session.

## The Route an API Key Should Take

Hey Jarvis uses BYOK—Bring Your Own Key—so users provide their own OpenAI API Key.

During development, putting the Key in `.env` is convenient. A Mac App, however, cannot assume that its user has a project directory. Nor can it place a secret in a web form, URL, launch argument, or ordinary log.

The final design writes the Key to macOS Keychain through a native input field. Settings can see only whether a credential is “configured” or “not configured”; it never displays the Key itself.

When the Python sidecar starts, Rust reads the credential from Keychain and sends it once through inherited standard input in a size-limited, private startup message. It then overwrites the temporary buffer. Only after this private startup exchange do the two sides enter the ordinary runtime protocol, in which secret-bearing content is explicitly forbidden.

This route deliberately avoids several seemingly easier options:

```text
Not in command-line arguments
Not in a URL
Not exposed to JavaScript
Not written to an ordinary configuration file
Not included in diagnostic logs
Not visible in the process list
```

Security design often means not adding another encryption algorithm, but reducing the number of places a secret passes through.

## Why Opening Settings Crashed the Audio Process

Settings seems like an ordinary interface unrelated to voice interaction, yet it exposed one of the project’s most representative lifecycle problems.

In the early design, opening Settings stopped the running Python sidecar. The logic seemed reasonable: the user might change the API Key or recheck microphone permissions, and restarting the sidecar would ensure that the new configuration took effect.

But “stop the sidecar” is not an instantaneous operation.

When the native layer began shutting down Python, the background conversation controller could still be processing a microphone read. If that read failed during shutdown, the old recovery logic treated it as an ordinary audio error and tried to reopen the microphone. Two opposing flows then ran at the same time:

```text
Main flow: Close the audio device and exit Python
Background flow: Detect an audio error and try to recover the microphone
```

This created a reproducible Python/PortAudio shutdown race: the interpreter was exiting while a background thread could still attempt to recreate the audio device.

Fixing it required more than adding a conditional next to a single exception. Shutdown had to become a state shared across the entire runtime:

- Mark the system as shutting down before doing anything else;
- Have the controller check for cancellation between every bounded read;
- Prevent audio errors during shutdown from triggering wake recovery;
- Prevent late browser cleanup from reopening the microphone;
- Wait for the background control thread to finish before destroying the server, detector, and Python interpreter.

I also reconsidered the original product decision. Viewing About, diagnostics, or ordinary settings should not stop the voice assistant. Settings is now a separate singleton window. Opening or closing it neither replaces the main interface nor restarts the sidecar. Only actions that truly affect the runtime—such as changing credentials or rechecking the microphone—trigger a safe shutdown followed by an explicit Resume flow.

That bug taught me that **a correct shutdown path is itself a core product feature.**

## “Listening” Must Still Be True After Lock and Sleep

A voice assistant differs from an ordinary desktop application in another important way: its value lies in not requiring the user to open a window.

After the Mac locks, the display turns off, or the system goes to sleep, the last “Listening” state shown in the interface may no longer be accurate. The WKWebView microphone track, Python sidecar, and system power policy may all have changed.

I added an optional Smart Speaker Mode. It asks macOS to prevent idle system sleep only while Hey Jarvis genuinely controls the microphone for local wake detection. When the assistant enters the post-wake Busy conversation state, it retains the power assertion it has already acquired, but Busy cannot request that assertion on its own. Smart Speaker Mode does not prevent the display from turning off, nor does it prevent the user from explicitly putting the Mac to sleep or closing the laptop.

Lock-screen testing exposed another problem: after the Mac was locked, acquiring the microphone on demand in WKWebView once took about 13.4 seconds. For an assistant that had already been awakened, that delay made it effectively unusable.

The final solution was not to keep requesting broader permissions. In Smart Speaker Mode, the app retains a microphone track that the user has already authorized but that has not yet been opened for input, while preparing the existing playback channel in advance. Reusing those resources after wake reduced microphone acquisition in real-world tests from about 13.4 seconds to about 5 milliseconds.

Explicit system sleep remains a boundary that must be respected. Before sleep, the app releases its media resources and power assertion, then stops the old sidecar. After wake, it makes one time-limited attempt at local recovery. The interface returns to “Listening” only after the microphone has genuinely been reassigned to local wake detection. If recovery does not complete within 15 seconds, the app displays an explicit Resume action rather than pretending that everything is normal.

In one real-world test, the system returned from explicit sleep to genuine wake listening in about 5.9 seconds. More important than that number, however, is that the failure path is also defined: if recovery fails, the system stops honestly and waits for the user.

## Diagnose Problems Without Recording Conversations

When an application spans Rust, the web layer, and Python, displaying only “An error occurred” is almost useless. But logs from a voice product are also highly sensitive.

The easiest way to debug it would be to save what the user said, what the model answered, and what WebRTC exchanged. That is also the approach I was least willing to take.

Hey Jarvis records only limited lifecycle information in its local diagnostics, such as which component entered which state and when. API Keys, raw audio, transcripts, response content, tool arguments, network negotiation details, and third-party response data never enter the diagnostic files.

Logs are limited in both size and number, and exported support bundles undergo an additional scan for sensitive content. Even if the sidecar exits unexpectedly, automatic recovery is limited to a fixed number of attempts. Repeated failures trigger crash loop protection, leaving the system in a non-listening state rather than restarting forever. Recovery also never initiates a paid Realtime conversation automatically.

The tradeoff is deliberate: I give up some information that might make debugging faster so that the diagnostic files do not become a hidden conversation history.

## Running on My Computer Is Not the Same as Being Deliverable

The Python sidecar depends on a wake model, audio libraries, and a machine-learning runtime that contains native code. Copying the source code to someone else is not delivery. Neither is asking them to install the correct Python version, Homebrew packages, and models.

The release build therefore bundles Python 3.12, the TFLite wake runtime, the required models, the audio dependencies, and the application itself. Startup requires no project directory, system Python, Homebrew path, or online model download.

That creates a practical tradeoff: the installed application is about 104 MiB, larger than a fully native implementation. In return, it preserves the Python behavior that has already been validated and does not require users to manage a runtime environment themselves.

To establish exactly what those 104 MiB contain, the build generates dependency and license manifests, model hashes, hashes for every resource, and an inventory of native binaries. The final internal build contains 83 arm64 Mach-O entries. Unused ONNX, SciPy, scikit-learn, and other models are removed only after import analysis and comprehensive behavioral testing prove that they are unnecessary.

Packaging checks once revealed that a release binary contained a local project build path. It did not affect functionality, but it carried information about the development machine into the deliverable. After the fix, path scanning became part of release verification.

Reproducible builds are not about earning an attractive engineering label. They answer a practical question: Is the artifact I give someone else the same artifact I actually tested?

## Publicly Downloadable Is Not the Same as Ready for Public Distribution

The v0.1.0 internal DMG accepted under F092 is about 45.4 MB and supports only Apple Silicon Macs running macOS 14 or later. Internal testing covers installation, launch, manual updates, rollback, and uninstallation. But the build has no Developer ID signature and has not undergone Apple notarization.

I now make it publicly available as the [v0.1.0-internal GitHub Release](https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal), so informed testers can download and evaluate it. It remains explicitly labeled `INTERNAL-UNSIGNED`. Publicly downloadable does not mean it is a general consumer release, and it has not passed the standard Gatekeeper distribution process.

The Release includes the DMG, its matching `.sha256` file, and installation guides in English and Chinese. Downloaders should verify the SHA-256 checksum first. If macOS blocks the initial launch, they should use **System Settings → Privacy & Security → Open Anyway** only after deciding that they trust the artifact—not disable Gatekeeper or remove quarantine metadata.

That may look like a release note, but it is also part of the product boundary.

“I can make it available for download” and “I can safely distribute it to any ordinary user” remain two different conclusions. Honestly acknowledging that gap matters more than presenting an unsigned DMG as a finished product.

## Product Complexity Hides in the Failure Paths

After I turned Hey Jarvis into a Mac App, using the demo became simpler: install it, enter an API Key, grant microphone access, and say “Hey Jarvis.”

But for those few steps to work, the system must know:

- What to do when Keychain is unavailable;
- What to do when microphone permission is denied;
- What to do when web media resources have not been released;
- That merely opening Settings should not restart anything;
- How to ensure old threads have exited when a restart is genuinely necessary;
- When it can truthfully claim to be “Listening” again after the system wakes from sleep;
- When to stop automatic recovery after repeated sidecar crashes;
- How to reject a build that is missing a model, contains the wrong architecture, or leaks a local path.

Productization is not a matter of adding an icon, a window, and an installer to a Demo.

It means taking every assumption in the developer’s head—that things “should be fine under normal conditions”—and turning each one into an explicit state, a constrained permission, an observable failure, and a verifiable recovery path.

In the next article, I want to return to the question that started this project: if an AI assistant truly needs an entry point that is always available, should that entry point remain confined by the boundaries of the Mac, phones, and Siri? Or will it eventually need hardware of its own?

---

Building Hey Jarvis series:

1. [I Built Hey Jarvis: It Started with a Question Before Bed](/posts/publish/building-hey-jarvis/)
2. [The Hard Parts of Hey Jarvis I: Making Voice Interaction Truly Work](/posts/publish/building-hey-jarvis-voice-interaction/)
3. [The Hard Parts of Hey Jarvis II: From Demo to Mac Product](/posts/publish/building-hey-jarvis-mac-product/)
4. [The Future of Hey Jarvis: When AI Needs an Entry Point of Its Own](/posts/publish/building-hey-jarvis-future/)
