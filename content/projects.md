+++
date = '2026-05-06T10:12:47+08:00'
draft = false
title = 'Projects'
description = 'Selected products and tools around browser automation, local-first knowledge workflows, and AI-assisted productivity.'
+++

Selected products and tools I built to solve real workflow problems, from visa form assistance to personal knowledge rediscovery.

## Featured

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

**Obsidian plugin · Local-first · Personal knowledge · AI optional · Under review**

Gentle Memories is a local-first Obsidian plugin that gently resurfaces old journal notes inside the current vault.

- Scans Markdown notes with configured journal tags and surfaces one eligible memory at a time.
- Shows a compact Obsidian modal with the note title, date, excerpt, and quick actions.
- Works locally by default, without an account, backend service, or analytics pipeline.
- Keeps AI disabled by default; when enabled, it sends only the displayed excerpt, not the full note, path, vault name, tags, or display history.
- Supports startup reminders and on-demand recall through the command palette.

[GitHub](https://github.com/yanqian/gentle-memories-obsidian)

## Areas

- Browser extensions and workflow automation
- Local-first knowledge tools
- AI-assisted form understanding and personal productivity
- Publishing workflows with Obsidian, Hugo, and GitHub Pages
