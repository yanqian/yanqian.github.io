+++
date = '2026-05-06T10:12:47+08:00'
draft = false
title = 'Projects'
description = 'Selected products and tools around browser automation, local-first knowledge workflows, voice interfaces, and AI-assisted productivity.'
translationKey = 'projects'
+++

Selected products and tools I built to solve real workflow problems, from visa form assistance and remote agent control planes to personal knowledge rediscovery and hands-free voice interaction.

## Selected

### Hey Jarvis

**macOS app · Local-first voice assistant · BYOK · Apple Silicon**

Hey Jarvis is a local-first, bring-your-own-key voice assistant for macOS. It waits locally for “Hey Jarvis,” then joins a Chinese or English voice conversation through OpenAI after activation.

- Keeps pre-wake microphone audio local and hands over the microphone only after wake-word activation.
- Supports continuous follow-up questions, natural interruption, and an explicit spoken end to a conversation.
- Routes arithmetic and local time deterministically, with provider-backed weather, exchange-rate, and stock tools.
- Uses macOS Keychain for credentials and includes microphone-permission recovery, sleep/wake recovery, and privacy-bounded diagnostics.
- Offers a public `v0.1.0-internal` evaluation build for Apple Silicon Macs running macOS 14 or later. The build is unsigned and not notarized, requires the user's own OpenAI API key, and is not a general consumer release.

[GitHub](https://github.com/yanqian/hey-jarvis) · [English Demo](https://www.youtube.com/watch?v=Cpv3dhFmS3M) · [v0.1.0 Internal Build](https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal)

### VisaPilot

**Browser extension · AI assistant · Visa forms · Chrome Web Store · Edge Add-ons**

VisaPilot is a chat-first browser assistant for visa and arrival-card forms, with page understanding, guided filling, and progressive memory.

- Understands the current page and field intent for supported visa and travel declaration websites.
- Provides explainable suggestions before filling, with a human-in-the-loop flow and no automatic official-form submission.
- Stores profile, trip, memory, and settings data locally in the browser.
- Supports multi-profile and multi-trip context isolation for repeat travel workflows.
- Built with Manifest V3, TypeScript, React, Vite, and an optional Node.js BFF service.

[Website](https://visa-pilot.github.io/) · [Chrome Web Store](https://chromewebstore.google.com/detail/visapilot/bckkbhikcbpnmackbcakigkgjmlofhjd?authuser=0&hl=zh-CN) · [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/visapilot/jihoainpnmdeficfplnebeebpmjjcpag)

### Gentle Memories

**Obsidian plugin · Local-first · Personal knowledge · AI optional**

Gentle Memories is a local-first Obsidian plugin that gently resurfaces old journal notes inside the current vault.

- Scans Markdown notes with configured journal tags and surfaces one eligible memory at a time.
- Shows a compact Obsidian modal with the note title, date, excerpt, and quick actions.
- Works locally by default, without an account, backend service, or analytics pipeline.
- Keeps AI disabled by default; when enabled, it sends only the displayed excerpt, not the full note, path, vault name, tags, or display history.
- Supports startup reminders and on-demand recall through the command palette.

[GitHub](https://github.com/yanqian/gentle-memories-obsidian) · [Obsidian Plugin](https://community.obsidian.md/plugins/gentle-memories)

### Remote Agent TG

**Telegram Bot · Local Codex control plane · Repository workflow · Node.js**

`agent-remote-tg` is a local Telegram Bot control plane for running and supervising long-running coding agent workflows from a phone.

- Restricts access to authorized Telegram chats and configured local repository aliases.
- Starts or resumes bounded Codex agent tasks in a selected workspace, with runtime task metadata and full logs.
- Keeps durable project state in repository files and git history instead of Telegram chat history.
- Supports repository inspection commands, task status, log lookup, stop controls, and approval flows for agent permission prompts.
- Provides a Bot-local commit and push path that previews changes and requires approval before writing to Git.

[GitHub](https://github.com/yanqian/agent-remote-tg)

## Areas

- Browser extensions and workflow automation
- Local-first knowledge tools
- AI-assisted form understanding and personal productivity
- Remote agent control planes and repository-backed workflow harnesses
- Local-first voice interfaces and native macOS product engineering
- Publishing workflows with Obsidian, Hugo, and GitHub Pages
