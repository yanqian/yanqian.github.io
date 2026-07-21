---
title: "我做了一个小型 Harness，防止 AI 编程项目丢失状态"
date: "2026-07-21T09:21:48+08:00"
draft: false
translationKey: i-built-a-small-harness-to-stop-ai-coding-projects-from-forgetting-state
tags:
  - ai/codex
  - agent-workflow
  - harness-engineering
  - ai-coding
  - open-source
  - public
  - note
categories:
  - tech


topics:
  - ai-coding
  - codex
  - agentic-coding
  - context-engineering
  - developer-tools
selected: true

---

AI 编程智能体很强大。

但项目一旦拉长，往往会在一些非常具体的地方出问题：

- 会话突然中断
- 上下文越积越长
- 每周额度耗尽
- 第二天接手的智能体忘了前一天做过哪些决定
- 智能体改动了无关文件
- 工作明明还没完成，智能体却提前宣布结束

问题不在于 AI 不会写代码。

真正的问题是，AI 编程项目往往没有持久的项目状态。

所以，我做了一个小型开源模板：

[ai-agent-harness-template](https://github.com/yanqian/ai-agent-harness-template)

它的目标很简单：

```text
让 AI 编程项目随时都能恢复并继续推进。
```

## 这不是提示词合集

现在已经有很多实用的提示词合集。

但这个模板不是。

它是一套仓库级 Harness，专门用于需要长期推进的 AI 编程项目。

适用工具包括：

- Codex
- Claude Code
- Cursor Agent
- 其他类似的编程智能体

不过，它不依赖任何一家厂商。

控制边界就是仓库本身。

## 核心思路

应该把智能体当作无状态工作进程来用。

它们不该依赖聊天记录。

每次开始工作时，都应该根据仓库文件重新建立上下文。

这个模板把持久状态保存在以下文件中：

- `SPEC.md`：保存需求
- `feature_list.json`：保存可执行的功能状态
- `progress.md`：保存恢复工作所需的记录
- `AGENTS.md`：保存智能体规则
- `QUALITY.md`：保存评估标准
- `runs/`：保存证据和交接记录

这样一来，后来接手的智能体、人工维护者和 CI 都以同一份信息为准。

仓库现在还提供了一个可安装的 AI Agent Harness skill。

这个 skill 不是另一套数据库。

它只是同一套仓库状态协议的便捷入口。

真正持久的记忆依然留在仓库里。

## 为什么聊天记录不适合充当数据库

聊天记录可以提供有用的上下文。

但它不适合充当正式记录。

它不像代码那样受版本管理。

CI 也无法校验它。

另一个智能体很难仅凭聊天记录可靠地接手工作。

而且，一旦会话结束、上下文遭到压缩，或是额度耗尽，聊天记录实际上就脱离了工作流程。

任务很短时，这些问题或许无关紧要。

但对长期编程项目来说，影响很大。

这套 Harness 把项目记忆放进了仓库。

## 用一个小型状态机管理功能进度

这个模板的核心是 `feature_list.json`。

它不只是一张待办清单。

每项功能都会记录：

- `id`
- `title`
- `description`
- `acceptance`
- `passes`
- `status`
- `attempts`
- `last_error`
- `priority`

这样，项目状态就成了机器可读的数据。

智能体可以从中选择一项尚未完成的功能。

评估者可以逐项核验功能。

CI 可以检查状态是否合法。

人也能看清楚究竟发生了什么。

## 评估是一项独立而重要的职责

刚开始用 AI 编程时，我犯过一个错误：把测试通过当成工作完成的全部标准。

测试当然必不可少。

但只有测试，并不总是够。

所以，我在模板中加入了 `QUALITY.md`，要求评估者检查：

- 正确性
- 完整性
- 可维护性
- 测试覆盖率
- 可恢复性
- 安全性

评估者不应该实现新功能。

它的职责，是防止智能体过早宣布完成。

## 每次失败都应让 Harness 变得更可靠

模板还包含一套按故障域归类的反馈循环。

一项功能失败后，不应该只是原样重试。

首先要判断问题出在哪一类：

- 需求是否表述不清？
- 测试是否漏掉了某些问题？
- 提示词是否放任了不安全的行为？
- 编排器是否丢失了状态？
- 我们是否在没有证据的情况下，想当然地认定了外部 CLI 的行为？

归类之后，就能把这次失败转化为更好的提示词、更完善的测试、更严谨的模式定义、更清楚的文档，或是一项新功能。

这个思路来自我对 Harness 工程更广泛的理解：

[Harness 工程的重点是约束 AI，而不是赋予它更多能力](/posts/publish/harness-engineering-is-about-limiting-ai-not-empowering-it/)

落实到实际工作中，教训就是：

```text
不要只是让智能体再试一次。
要改进整个循环，让它难以再以同样的方式失败。
```

## 编排器刻意保持简单

仓库里有一个小型 `orchestrator.py`。

但编排器不是这个模板的重点。

它不会让智能体变得更聪明。

它只负责：

- 执行启动协议
- 选择一项尚未完成的功能
- 下发 Coding Agent 提示词
- 下发 Evaluator Agent 提示词
- 记录状态变化

实际调用智能体的工作交给可替换的适配脚本：

- `scripts/run-coding-agent.sh`
- `scripts/run-evaluator-agent.sh`

默认情况下，编排器可以在 dry-run 模式下运行，只预览提示词。

这是有意设计的。

模板应该保持厂商中立。

## Skill 只是一个便捷入口

发布模板的第一个版本后，我又加入了一个可分发的 skill：

`skills/ai-agent-harness/`

它让智能体可以更直接地使用这套 Harness。

这个 skill 可以帮助智能体：

- 在项目中安装或接入这套 Harness
- 检查项目是否已经具备一套可运行的 Harness
- 补齐缺失的 Harness 文件
- 把需求整理进 `SPEC.md` 和 `feature_list.json`
- 每次只处理一项功能
- 评估工作是否完成
- 只有得到用户明确批准后才提交代码

对于支持 skill 类指令的工具，这能降低 Harness 的使用门槛。

在 Codex 中，可以把它安装为 Codex skill。

在 Claude Code 中，可以把它放进个人或项目的 skill 目录。

在 Cursor 中，则可以通过项目规则接入同一套工作流程。

但最重要的边界没有改变：

```text
Skill -> 工作流程入口
仓库文件 -> 持久的项目状态
```

Skill 帮助智能体遵守协议。

但它不会取代 `AGENTS.md`、`SPEC.md`、`feature_list.json`、`progress.md`、`QUALITY.md`、`runs/` 或 git 历史记录。

## 一个微型示例和一台 Go 服务器

仓库里有两个示例：

- `examples/tiny-cli/`
- `examples/go-server/`

其中的 Go 示例是一个不依赖第三方库的 HTTP 服务器，提供：

- `GET /healthz`
- `GET /greet?name=Codex`

这些示例并不复杂，但复杂与否不是重点。

重点是，这套 Harness 能够校验真实的项目文件，而不只是 Markdown 文档。

## 如何试用

克隆仓库：

```bash
git clone https://github.com/yanqian/ai-agent-harness-template.git
cd ai-agent-harness-template
```

校验模板：

```bash
make ci
```

在新项目中使用：

```bash
make clean
make init
```

然后编辑以下文件：

- `SPEC.md`
- `feature_list.json`
- `progress.md`

让编程智能体遵循 `AGENTS.md`，每次只实现一项功能。

校验某项功能：

```bash
make validate FEATURE=F001
```

如果你的编程智能体支持 skill，也可以安装仓库自带的 skill，直接调用。

以 Codex 为例：

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo yanqian/ai-agent-harness-template \
  --path skills/ai-agent-harness
```

然后重启 Codex，向它下达以下指令：

```text
使用 $ai-agent-harness 初始化这个项目。
```

如果已经检出了这个仓库，也可以手动运行同一个初始化程序：

```bash
python3 skills/ai-agent-harness/scripts/init_harness.py --root /path/to/project --mode adopt
python3 skills/ai-agent-harness/scripts/init_harness.py --root /path/to/project --mode check
```

## 这个模板背后的真实项目

这个模板并不是从某个抽象的框架构想中诞生的。

它来自我用 AI 智能体开发真实项目的经历。在这些项目里，暂停一段时间再回来继续，本来就是日常工作的一部分。

其中一个项目是 [home-guard-tg](https://github.com/yanqian/home-guard-tg)。这是一个在 Mac 本地运行的 Telegram 机器人，用来查看家中摄像头的状态、照片、警报、运行情况和日志。

乍看之下，这类项目似乎很小。

但它涉及许多彼此关联的环节：

- 本地运行行为
- 进程状态
- 摄像头和文件访问
- Telegram 命令
- 警报
- 日志
- 运行故障后的恢复

AI 智能体修改这类项目时，判断是否正确，不能只看某个函数有没有返回预期值。

更重要的是：当我不在电脑前时，机器人能不能继续安全运行。

另一个项目是 [agent-remote-tg](https://github.com/yanqian/agent-remote-tg)。这是一套通过 Telegram 远程运行和监督编程智能体的工作流程。

在这个项目里，状态问题更加突出。

既然目标是远程操作智能体，整套工作流程就不能依赖当前聊天会话仍然存在。

项目本身必须记录：

- 智能体原本打算做什么
- 当前正在处理哪项功能
- 哪些检查已经通过
- 哪些环节出了问题
- 下一步应该做什么

在这两个项目中，我反复遇到同一种失败模式。

问题不在于智能体写不出代码。

问题在于，项目并不总能把工作记忆持久保存下来，也无法让人或智能体随时检查这些记忆。

所以，这套 Harness 要做的，就是把这些记忆提取出来，写进文件。

`feature_list.json` 记录要做的工作。

`progress.md` 记录恢复工作所需的状态。

`AGENTS.md` 告诉下一个智能体该怎么做。

`QUALITY.md` 规定怎样才算真正完成。

`runs/` 保存证据和交接说明。

这个模板，就是把这些经验整理成一套可复用的方案。

## 用模板开发模板本身

这套模板也用同一套状态模型管理自身的开发。

它的开发历史就记录在 `feature_list.json` 里。

仓库已经完成了以下功能：

- 搭建 Harness 的初始结构
- 添加编排器
- 添加评估规则
- 添加故障域处理机制
- 添加示例
- 添加 CI
- 添加开源发布准备文件
- 添加 `make clean`
- 添加可安装的 AI Agent Harness skill

未来的待办事项中，还包括支持有明确边界的并发智能体执行。

这项能力究竟有没有必要，现在还不能确定。

现阶段，顺序执行更安全。

## 我为什么要做这个模板

我不认为 AI 编程眼下的发展方向，只是让智能体变得越来越自主。

在我看来，更重要的问题是：

```text
怎样才能让 AI 生成的成果可以恢复、可以审查，还能安全地接着做下去？
```

对我来说，答案要从仓库状态开始。

不是聊天记忆。

不是一个巨大的提示词。

也不是某个神奇的编排器。

只需要一套小型 Harness，把工作流程明确呈现出来。

如果你正在用 Codex、Claude Code、Cursor Agent 或其他编程智能体处理长期任务，这个模板或许能帮上忙。

仓库：

[github.com/yanqian/ai-agent-harness-template](https://github.com/yanqian/ai-agent-harness-template)
