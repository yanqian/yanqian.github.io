---
title: "远程智能体工作流（三）：把 Telegram 变成本地 Codex 的控制面"
date: "2026-07-20T23:20:13+08:00"
draft: false
translationKey: turning-telegram-into-a-local-codex-control-plane
tags:
  - ai/codex
  - remote-workflow
  - agent-workflow
  - telegram
  - public
  - note

series: Remote Agent Workflow
seriesOrder: 3
topics:
  - remote-agent-workflow
  - codex
  - ai-agent-workflow


---

这是「远程智能体工作流」系列的第三篇。

前两篇文章里，我先搭出了一条实用的远程终端链路：

```text
手机 -> Tailscale -> SSH -> Mac -> tmux -> Codex
```

有了这条链路，我就能可靠地从手机连接自己的 Mac。

但新的局限很快就暴露出来：手机并不好用来操作终端。

移动端 SSH 适合救急，但我不想靠它处理需要长时间运行的 AI 开发任务。我不想在狭窄的手机屏幕上敲 shell 命令、连接 tmux 会话、翻找长篇日志，再一点点拼凑出当前状态。

我真正想要的，是下面这样的链路：

```text
手机 -> 任务式接口 -> 本地智能体运行时 -> 仓库状态
```

于是，我做了一个小型 Telegram Bot，把它用作本地 Codex 的控制面。

关键不在于 Telegram 有多特别。

真正重要的是：手机成为控制界面，而 Mac 仍然负责执行工作。

## 为什么选 Telegram

Telegram 很适合用来做这个实验，因为它已经具备：

- 移动端通知
- 简短的命令消息
- 回复串
- 内联按钮
- 跨设备历史记录
- 成熟的 Bot API

更重要的是，Telegram 支持两种截然不同的部署模式。

![Telegram 的 webhook 与 polling 模式](assets/turning-telegram-into-a-local-codex-control-plane/01-webhook-vs-polling.svg)

第一种是 webhook 模式：

```text
Telegram Server -> 公网 HTTPS 端点 -> Bot 运行时
```

这是生产环境中常见的部署方式。

它需要：

- 一个公网 HTTPS 端点
- 一台服务器或一套云端运行环境
- 注册 webhook
- 持久化运行时存储
- 让这套运行环境能够访问目标仓库

如果 Bot 部署在 VPS、VM、Cloud Run 服务或其他公网运行环境中，这套方案完全可行。

但对我的场景来说，它并不是最省事的选择。

我要让 Bot 控制本地 Mac。仓库、凭据、开发工具和 Codex 运行时本来就在那里，没必要再搬到云端。

因此，第二种模式更合适：polling。

```text
本地 Mac 上的 Bot -> Telegram Server
```

采用 polling 后，本地 Bot 进程会主动向 Telegram 拉取更新。

这样，我就不需要：

- 公网 IP
- 入站端口转发
- HTTPS 端点
- ngrok
- Cloudflare Tunnel

Mac 不必接收任何来自公网的入站流量。

它只需要主动连接 Telegram。

这与我搭建 Tailscale SSH 时遵循的是同一套原则：

```text
执行留在本地。
不要把 Mac 直接暴露在公网。
让手机能够访问控制界面。
```

## 最小可行架构

最简单的本地 polling Bot，大致采用下面的结构：

![本地 Telegram 控制面架构](assets/turning-telegram-into-a-local-codex-control-plane/02-telegram-control-plane-architecture.svg)

```text
Telegram Mobile
  -> Telegram Server
  -> Mac 上的本地 polling 进程
  -> 选定的工作区
  -> Codex 进程
  -> 日志与仓库文件
```

在 Node.js 中，polling 的思路很简单：

```js
const bot = new TelegramBot(token, { polling: true });
```

我的实现并不依赖示例中的特定库，也不拘泥于它的具体写法，但运行逻辑相同：本地进程持续轮询 Telegram，将有效消息交给应用处理程序，再通过 Telegram API 返回响应。

消息怎么进来，并不是重点。

重点是，系统收到消息后会做什么。

## Bot 只是控制面

Bot 不应该充当编码智能体。

它不应该实现产品逻辑。

它不应该判断哪些功能已经完成。

它不应该直接改写仓库里的规划文件。

它也不应该把 Telegram 聊天记录当作项目记忆。

Bot 只是一层控制面。

它的职责必须严格限定在以下范围：

- 验证 Telegram 聊天身份
- 从白名单中选择仓库
- 校验选中的工作区
- 启动本地 Codex 任务
- 持久化任务元数据
- 将完整日志写入磁盘
- 向 Telegram 返回长度受限的响应
- 在条件允许时记录 Codex session ID
- 查询任务状态
- 终止任务
- 在可行时转发审批请求

这条边界很重要。

一旦 Bot 接管整个开发生命周期，它就会变成另一套智能体框架。

这不是我想要的。

我只想为现有的本地工作流增加一个移动端入口。

## 用仓库白名单代替任意路径

Bot 不应该接受 Telegram 发来的任意路径。

下面这样的操作太危险：

```text
/cd /some/random/path
```

或者：

```text
/run rm -rf ...
```

控制面只应该开放一组边界明确的操作。

在我的实现中，可用仓库由白名单配置：

```json
{
  "agent-remote-tg": "/Users/armstrong/Project/agent-remote-tg"
}
```

手机端可以列出已经配置的仓库：

```text
/repos
```

再通过别名选择一个仓库：

```text
/use agent-remote-tg
```

选定后，查看工作区的命令只能在该仓库内执行：

```text
/pwd
/ls
/git
```

这种设计有意舍弃了 shell 的灵活性。

而这正是设计的目的。

移动端控制面应该让安全操作足够简单，也让危险操作无从发生。

## 启动智能体任务

主要命令是：

```text
/agent <instruction>
```

例如：

```text
/agent 检查当前仓库状态，并总结接下来有哪些内容已经可以开始实现。
```

或者：

```text
/agent 按照 AGENTS.md 实现下一个小功能。总结之前先运行验证脚本。
```

Bot 会在选定的工作区中启动本地 Codex 进程。

这里有几个关键细节：

- 启动进程时不经过 shell
- 将 `stdout` 和 `stderr` 写入本地日志文件
- 将任务元数据保存在运行时状态中
- Telegram 端会立刻收到一个任务 ID
- 不把完整输出直接灌进聊天窗口

相比 SSH，这种方式更适合在手机上操作。

我不必一直盯着实时终端，只需查询：

```text
/status
```

或者：

```text
/logs task-0001
```

完整信息留在本地机器上，Telegram 只接收长度受限的摘要。

## 新会话、恢复会话与聊天模式

远程控制智能体时，如何延续会话是个棘手的问题。

有时，我需要新建一个 Codex 会话。

有时，我想恢复之前的会话。

还有些时候，我只想在 Telegram 里接着追问，不想每次都重复输入命令前缀。

Bot 支持以下几种用法：

```text
/agent new <instruction>
/agent resume <session_id> <instruction>
/agent resume --last <instruction>
/agent session
/agent exit
```

把一个 Codex 会话与当前 Telegram 聊天和选定的仓库绑定后，直接发送普通文本消息，就能延续该会话。

手机端因此好用得多。

我不必每次都输入：

```text
/agent resume <long-session-id> 从上次的结果继续……
```

会话建立后，只需发一条简短的跟进消息：

```text
继续处理剩余问题中最小的那一项，并运行相关测试。
```

即使已经进入聊天模式，以斜杠开头的消息仍会按命令处理。

因此，我随时可以查看或控制运行时：

```text
/agent session
/status
/logs task-0003
/stop task-0003
```

这个界面并不是为了重造一个交互式终端。

它是面向本地智能体运行时的任务接口。

## 运行时状态不等于项目状态

Bot 会保存自身的运行时状态。

其中包括：

- 当前选中的仓库
- 当前工作区路径
- 任务记录
- 任务状态
- 任务日志路径
- Codex 会话绑定关系
- 审批请求
- Telegram 轮询偏移量

控制面要正常运转，离不开这些信息。

但它们不能作为项目事实的最终依据。

项目状态仍应保存在仓库中：

- `AGENTS.md`
- `SPEC.md`
- `feature_list.json`
- `progress.md`
- `test_plan.md`
- `init.sh`
- `orchestrator.py`
- git history

这是整个设计中最核心的取舍。

Bot 可以记住 `task-0003` 已经启动，也可以记住日志存放的位置。

但 Bot 不应自行认定功能 `F043` 已经完成。

这个结论应该由仓库工作流、验证脚本、评估器和 git history 共同得出。

## 完整日志留在本地，回复长度受限

终端天然适合显示原始输出。

移动聊天界面不适合。

长日志在手机上很难阅读。全部塞进 Telegram，只会让整个工作流变得嘈杂而脆弱。

因此，Bot 会把完整的任务输出写入本地文件：

```text
logs/<task_id>.log
```

Telegram 中的回复则有明确的长度限制。

任务运行时，手机上只显示足以说明当前进度的信息。

任务结束后，再给出简洁的最终结果。

如果需要查看原始日志，完整内容仍保存在 Mac 本地。

这也再次说明，控制面不是用来取代终端的。

它是远程操控本地工作的界面。

## 转发审批请求

长时间运行的 Codex 任务有时会请求批准某项操作。

即使不在 Mac 旁边，我也需要看到请求并作出决定。

控制面可以从 Codex 的输出中识别审批请求，再将其转发到 Telegram，并提供结构化选项。

整个流程大致如下：

```text
Codex 发出审批请求
  -> Bot 捕获请求
  -> Telegram 显示带选项的消息
  -> 用户批准或拒绝
  -> Bot 记录决定
```

这种交互正适合手机。

我不想在手机上编辑 shell 命令。

但我可以快速读完一段范围明确的审批提示，然后点选批准或拒绝。

这里有一个重要限制：能否真正提交审批结果，取决于运行时协议。识别并展示请求相对容易；要把用户的选择可靠地写回非交互式子进程，就困难得多。

只要 Bot 如实说明这一点，这个限制对于 MVP 来说完全可以接受。

真正有价值的，是这套控制方式背后的分工：

```text
手机负责做决定。
Mac 负责执行。
仓库负责保存持久状态。
```

## 它替代了什么

这套方案不会彻底取代 SSH。

我仍要保留 SSH，把它作为更底层的应急通道。

如果系统出现严重故障，我可能还是得用 Termius 连接 Mac、进入 tmux、检查文件，或者重启 Bot。

但 SSH 应该是备用手段，而不是日常使用的主要界面。

日常操作应该精简为：

```text
/use repo
/agent instruction
/status
/logs task
/stop task
```

这才更接近我真正想在手机上使用的工作方式。

## 它刻意不解决什么

这个控制面的范围是有意收窄的。

它不提供：

- 任意 shell 访问
- 远程桌面
- 自由形式的文件系统浏览
- 云端部署自动化
- 完整的 Web 仪表板
- Codex 的替代品
- 仓库工作流的替代品

正因为明确排除了这些能力，整套系统才能简单、易懂。

Bot 完全可以做得很朴素。

它只需让最常见的远程智能体工作流更方便：

```text
选择仓库
启动任务
检查状态
查看结果
继续会话
停止任务
需要时批准或拒绝
```

## 更普遍的架构

Telegram Bot 只是这套模式的一种实现。

同样的思路也可以用 Slack、小型 Web UI、原生移动应用，甚至私有命令服务器来实现。

真正重要的是下面这套架构：

```text
移动客户端
  -> 控制面
  -> 工作区运行时
  -> Codex / orchestrator
  -> 仓库状态 + 日志
```

当我开始按照这个结构思考时，各层的职责就变得更清楚了。

- 移动客户端负责表达意图、作出决定。
- 控制面负责授权、任务路由和状态信息。
- 工作区运行时负责在本地执行任务。
- Codex 或 orchestrator 负责完成智能体工作。
- 仓库负责保存持久状态并提供验证依据。

这正是从远程终端到远程智能体工作流的转变。

第一篇文章解决了如何从外部访问 Mac。

第二篇解释了为什么仅靠 SSH 还不够。

到了这一层，手机才真正变成本地 Codex 工作的控制面。

接下来还有一个更重要的问题：

```text
如果智能体可以远程异步运行，项目的长期记忆应该放在哪里？
```

我的答案是：放在仓库里，而不是聊天记录里。
