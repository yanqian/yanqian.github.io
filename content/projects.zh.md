+++
date = '2026-05-06T10:12:47+08:00'
draft = false
title = '项目'
description = '我围绕浏览器自动化、本地优先知识工作流和 AI 辅助效率工具做的一些产品与工具。'
translationKey = 'projects'
+++

这里收录了我为解决实际工作流问题做的一些产品和工具，从签证表单辅助、远程智能体控制面，到重新发现个人知识。

## 精选项目

### VisaPilot

**浏览器扩展 · AI 助手 · 签证表单 · Chrome Web Store · Edge Add-ons**

VisaPilot 是一个以对话为入口的浏览器助手，用来处理签证和入境卡表单，具有页面理解、引导式填写和渐进式记忆能力。

- 在支持的签证与旅行申报网站上，理解当前页面和字段意图。
- 填写前先给出可解释的建议，流程由人确认，不会自动提交官方表单。
- 将个人资料、行程、记忆与设置数据保存在浏览器本地。
- 支持多个个人资料和多段行程之间的上下文隔离，适合多次出行时重复使用。
- 使用 Manifest V3、TypeScript、React 和 Vite 构建，并可选配 Node.js BFF 服务。

[网站](https://visa-pilot.github.io/) · [Chrome Web Store](https://chromewebstore.google.com/detail/visapilot/bckkbhikcbpnmackbcakigkgjmlofhjd?authuser=0&hl=zh-CN) · [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/visapilot/jihoainpnmdeficfplnebeebpmjjcpag)

### Gentle Memories

**Obsidian 插件 · 本地优先 · 个人知识 · AI 可选**

Gentle Memories 是一个本地优先的 Obsidian 插件，会让当前 Obsidian 仓库里过去的日记笔记温和地重新出现。

- 扫描带有已配置日记标签的 Markdown 笔记，每次呈现一条符合条件的回忆。
- 用简洁的 Obsidian 弹窗显示笔记标题、日期、摘录和快捷操作。
- 默认完全在本地运行，不需要账户、后端服务或分析管道。
- AI 默认关闭；启用后只会发送当前显示的摘录，不会发送完整笔记、文件路径、仓库名称、标签或展示历史。
- 支持启动提醒，也可以通过命令面板随时回顾旧笔记。

[GitHub](https://github.com/yanqian/gentle-memories-obsidian) · [Obsidian 插件](https://community.obsidian.md/plugins/gentle-memories)

### Remote Agent TG

**Telegram Bot · 本地 Codex 控制面 · 仓库工作流 · Node.js**

`agent-remote-tg` 是一个运行在本地的 Telegram Bot 控制面，可以通过手机启动和监督耗时较长的编码智能体工作流。

- 只允许已授权的 Telegram 聊天访问，并限制在配置好的本地仓库别名范围内。
- 在选定的工作区中启动或恢复限定范围的 Codex 智能体任务，同时保留运行时任务元数据和完整日志。
- 将持久项目状态保存在仓库文件和 Git 历史中，而不是 Telegram 聊天记录里。
- 支持检查仓库、查看任务状态和日志、停止任务，以及处理智能体权限请求的批准流程。
- 提供由 Bot 在本地执行的提交与推送路径；写入 Git 之前会预览变更并要求批准。

[GitHub](https://github.com/yanqian/agent-remote-tg)

### Home Guard TG

**受信主机 Telegram Bot · 家庭监控 · Mac · ffmpeg**

`home-guard-tg` 是一个运行在受信主机上的小型 Telegram Bot，可以通过 Mac 查看家中情况。它有意把命令范围控制得很窄，只在受信的家用 Mac 上运行，也只接受已授权聊天发来的命令。

- `/camera_clip` - 拍摄一段简短视频，快速查看家中情况。
- `/photo` - 拍一张照片，适合只需要简短更新的情况。
- `/sound_alarm` - 在受信的 Mac 上播放本地警报声。

[GitHub](https://github.com/yanqian/home-guard-tg)

## 关注方向

- 浏览器扩展与工作流自动化
- 本地优先的知识工具
- AI 辅助的表单理解与个人效率工具
- 远程智能体控制面与以仓库为基础的工作流验证框架
- 用受信主机 Telegram Bot 实现本地设备自动化
- 使用 Obsidian、Hugo 和 GitHub Pages 的发布工作流
