---
title: "远程代理工作流（一）：用手机连接 Mac 运行 Codex"
date: "2026-07-20T22:15:53+08:00"
draft: false
translationKey: remote-mac-terminal-for-codex
tags:
  - ai/codex
  - ssh
  - macos
  - remote-workflow
  - public
  - note

series: Remote Agent Workflow
seriesOrder: 1
topics:
  - remote-agent-workflow
  - codex
  - ai-agent-workflow


---

本文是“远程代理工作流”系列的第一篇。

这篇指南将介绍如何用手机操作 Mac 终端，并让 Codex、自动化脚本、本地开发代理等长时间任务持续运行。

我们要搭建的不是远程桌面，而是一套可靠的远程终端工作流：

```text
手机 -> SSH -> Mac -> tmux -> Codex / 代理任务
```

配置完成后，Mac 就会成为一个轻量的远程执行节点。无论身在何处，你都可以用手机接入。

## 各个工具分别做什么

### SSH

SSH 是一种安全的远程登录协议，可以让你从手机进入 Mac 的终端。

在这套工作流中，SSH 负责：

- 安全访问 Mac 的命令行。
- 使用密码或 SSH 密钥验证身份。
- 从手机远程执行命令。

不过，SSH 一旦断开，并不能保证任务继续运行。这正是我们还需要 tmux 的原因。

### Tailscale

Tailscale 会在你的设备之间建立私有网络。即使 Mac 和手机接入不同的网络，两台设备也能通过稳定的私有 IP 地址互相访问。

在这套工作流中，Tailscale 负责：

- 让你通过 4G、5G、酒店 Wi-Fi、公司 Wi-Fi 或家庭 Wi-Fi 远程访问 Mac。
- 为 Mac 提供稳定的 `100.x.x.x` 地址。
- 加密设备之间的网络通信。
- 避免将 SSH 直接暴露在公网上。

本文默认使用官方 Tailscale macOS 客户端。在这种配置下，后台服务、登录状态和菜单栏状态都由该应用管理。

日常使用时，应让 Tailscale 客户端始终在后台运行。命令行主要用于查看状态：

```bash
tailscale status
tailscale ip
```

如果 Mac 尚未接入 Tailscale，请从菜单栏打开 Tailscale 应用并连接。在这套工作流中，macOS 客户端是管理 Tailscale 的主要入口。

### Termius

Termius 是手机端的 SSH 客户端，可以保存 SSH 主机、密钥和连接设置。

在这套工作流中，Termius 提供：

- 适合在手机上操作的终端界面。
- 可保存的 SSH 主机配置。
- SSH 密钥管理。
- 手机网络切换后快速重新连接。

你也可以使用其他 SSH 应用，不过 Termius 在手机上操作比较方便。

### tmux

tmux 是终端会话管理器。你可以在其中启动 shell 会话，随时脱离，之后再重新接入。

在这套工作流中，tmux 负责：

- 让长时间运行的终端会话不受手机断线影响。
- 让你随时返回已有的 Codex 或代理会话。
- 在 Mac 上管理多个远程终端窗口。

如果不使用 tmux，关闭 Termius 或网络中断时，当前 shell 中的任务也可能随之终止。

### caffeinate

`caffeinate` 是 macOS 自带的命令，可以在运行期间阻止 Mac 进入睡眠。

在这套工作流中，caffeinate 负责：

- 防止 Mac 因闲置而进入睡眠。
- 提高长时间任务的运行可靠性。
- 在屏幕锁定或显示器关闭后，让 Codex 或其他代理继续工作。

以下几种情况需要特别留意：

| Mac 上的操作 | 对远程任务的影响 |
|---|---|
| 锁定屏幕 | 通常安全 |
| 关闭显示器 | 通常安全 |
| 因闲置进入睡眠 | 除非 caffeinate 正在运行，否则不安全 |
| 合上 MacBook 上盖 | 通常不安全，除非 Mac 已接通电源并配置为合盖模式 |

## 推荐架构

实际使用时，可以把整套配置分为两层：

![远程 Codex 架构](/posts/publish/remote-mac-terminal-for-codex/assets/remote-mac-terminal-for-codex/01-remote-architecture.svg)

```text
主机就绪层：
  Tailscale 客户端正在运行
  caffeinate 正在运行
  Mac 网络可达，并且处于唤醒状态

手机工作层：
  通过 Termius 建立 SSH 连接
  新建或接入 tmux 代理会话
  完成后脱离会话
```

这里要分清三件事：

- 手机通过 SSH 连接之前，Mac 必须已经唤醒，而且网络可达。
- 不应依赖手机端的操作来维持 Mac 唤醒。
- 手机断开后，由 tmux 保证代理会话继续运行。

建议使用以下四个命令：

```text
mac-awake-on     -> 开始远程工作前在 Mac 上运行；检查 Tailscale 并启动 caffeinate
agent-new        -> 在手机的 SSH 会话中运行；新建一个 tmux 代理会话
phone-disconnect -> 在 tmux 中运行；断开手机连接，但不停止代理
mac-awake-off    -> 远程工作结束后运行；停止 caffeinate，让 Mac 恢复正常睡眠
```

## 第 1 步：在 Mac 上启用 SSH

### 方案 A：使用“系统设置”

依次打开：

```text
系统设置 -> 通用 -> 共享 -> 远程登录
```

开启“远程登录”。

### 方案 B：使用命令行

```bash
sudo systemsetup -setremotelogin on
```

检查是否已经启用：

```bash
sudo systemsetup -getremotelogin
```

预期会看到以下输出：

```text
Remote Login: On
```

如果 macOS 阻止命令执行，请前往以下位置，为终端应用授予所需权限：

```text
系统设置 -> 隐私与安全性 -> 完全磁盘访问权限
```

## 第 2 步：安装并登录 Tailscale 客户端

Mac 和手机都需要安装 Tailscale。

在 Mac 上安装官方 Tailscale macOS 客户端，然后完成以下操作：

1. 安装 Tailscale。
2. 打开 Tailscale 应用。
3. 登录手机所使用的同一个 Tailscale 账户。
4. 让应用常驻菜单栏。
5. 如果希望 Mac 重启后仍能远程访问，请启用登录时启动。

在 Mac 上检查连接状态：

```bash
tailscale status
```

如果 Mac 尚未连接，请通过菜单栏中的 Tailscale 应用建立连接。

查看 Mac 的 Tailscale IP：

```bash
tailscale ip
```

你应该会看到类似下面的地址：

```text
100.x.x.x
```

之后，手机会通过这个地址建立 SSH 连接。

## 第 3 步：在手机上配置 Termius

在 Termius 中新建一台主机，填写以下信息：

```text
地址：100.x.x.x
用户名：你的 macOS 用户名
端口：22
```

可以运行下面的命令查看 macOS 用户名：

```bash
whoami
```

此时，你可能已经可以使用密码登录。不过，如果准备经常使用这套工作流，最好改用 SSH 密钥登录。

## 第 4 步：配置 SSH key 登录

在 Mac 上生成一对专供 Termius 使用的 SSH key：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_termius
```

把公钥写入 Mac 的授权密钥文件：

```bash
cat ~/.ssh/id_ed25519_termius.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

输出私钥：

```bash
cat ~/.ssh/id_ed25519_termius
```

把私钥导入 Termius：

```text
Termius → Keychain → Import Key
```

然后编辑 Termius 中的主机配置，选择这把密钥作为身份验证方式。

接下来测试连接。登录成功后，你会看到类似下面的 shell 提示符：

```text
yourname@MacBook ~ %
```

## 第 5 步：安装 tmux

如果还没有安装 tmux：

```bash
brew install tmux
```

手动新建一个会话：

```bash
tmux new -s agent
```

脱离会话，但不停止其中的任务：

```text
按 Ctrl + B，再按 D
```

稍后重新接入：

```bash
tmux attach -t agent
```

## 第 6 步：添加远程工作流脚本

![远程工作流命令的生命周期](/posts/publish/remote-mac-terminal-for-codex/assets/remote-mac-terminal-for-codex/02-command-lifecycle.svg)

所有脚本都保存在 Mac 上，只是使用时机不同：

- 把 Mac 留作远程主机之前，先在 Mac 本机运行 `mac-awake-on`。
- 手机通过 SSH 连接后，运行 `agent-new`。
- 准备结束手机上的操作时，在 tmux 内运行 `phone-disconnect`。
- 不再需要 Mac 保持唤醒时，运行 `mac-awake-off`。

创建个人脚本目录：

```bash
mkdir -p ~/.local/bin
```

创建 `~/.local/bin/mac-awake-on`：

```bash
#!/bin/zsh

set -e

PID_FILE="/tmp/remote-caffeinate.pid"

echo "Preparing this Mac for remote access..."

if pgrep -x "Tailscale" >/dev/null 2>&1; then
  echo "Tailscale macOS client is running."
else
  echo "Opening Tailscale macOS client..."
  open -a Tailscale || true
  sleep 2
fi

if command -v tailscale >/dev/null 2>&1; then
  TAILSCALE_READY="false"

  for _ in 1 2 3 4 5; do
    if tailscale status >/dev/null 2>&1; then
      TAILSCALE_READY="true"
      break
    fi
    sleep 2
  done

  if [ "$TAILSCALE_READY" = "true" ]; then
    echo "Tailscale is online."
    echo "Tailscale IP:"
    tailscale ip
  else
    echo "Tailscale is not connected."
    echo "Open the Tailscale macOS app from the menu bar and connect this Mac."
    exit 1
  fi
else
  echo "Warning: tailscale command not found."
  echo "Install the official Tailscale macOS client and keep it running."
  exit 1
fi

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "caffeinate is already running."
else
  echo "Starting caffeinate..."
  caffeinate -ims &
  echo $! > "$PID_FILE"
fi

echo "Mac remote readiness is on."
echo "You can now SSH into this Mac from your phone."
```

创建 `~/.local/bin/agent-new`：

```bash
#!/bin/zsh

set -e

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is not installed. Install it with: brew install tmux"
  exit 1
fi

SESSION_NAME="${1:-agent-$(date +%Y%m%d-%H%M%S)}"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Session already exists: $SESSION_NAME"
  echo "Attaching..."
  tmux attach -t "$SESSION_NAME"
  exit 0
fi

echo "Creating tmux session: $SESSION_NAME"
tmux new-session -s "$SESSION_NAME"
```

创建 `~/.local/bin/phone-disconnect`：

```bash
#!/bin/zsh

set -e

if [ -n "$TMUX" ]; then
  tmux detach-client
else
  echo "You are not inside a tmux session."
  echo "Use 'exit' to close the SSH shell."
fi
```

创建 `~/.local/bin/mac-awake-off`：

```bash
#!/bin/zsh

set -e

PID_FILE="/tmp/remote-caffeinate.pid"

echo "Turning off Mac remote readiness..."

if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"

  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo "caffeinate stopped."
  else
    echo "No active caffeinate process found."
  fi

  rm -f "$PID_FILE"
else
  echo "No remote caffeinate PID file found."
fi

echo "Mac can sleep normally again."
echo "Tailscale is left running so the Mac remains reachable when awake."
```

为这些脚本添加执行权限：

```bash
chmod +x ~/.local/bin/mac-awake-on ~/.local/bin/agent-new ~/.local/bin/phone-disconnect ~/.local/bin/mac-awake-off
```

确认 shell 的 `PATH` 中已经包含 `~/.local/bin`。如果没有，请把下面这行加入 `~/.zshrc`：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

重新加载 shell 配置：

```bash
source ~/.zshrc
```

## 第 7 步：日常使用流程

### 离开 Mac 之前

先在 Mac 本机做好远程运行准备：

```bash
mac-awake-on
```

这个命令会确保：

- Tailscale 客户端已经运行。
- Mac 在你的 Tailscale 网络中可见。
- `caffeinate` 已经运行，防止 Mac 因长时间闲置而进入睡眠。

### 从手机操作

打开 Termius，通过 Mac 的 Tailscale IP 连接 Mac。

新建一个用于运行代理任务的 tmux 会话：

```bash
agent-new
```

也可以自行指定会话名称：

```bash
agent-new codex
```

进入 tmux 后，运行 Codex 或其他代理任务：

```bash
codex
```

也可以运行：

```bash
node orchestrator.js
```

脱离 tmux，但不停止任务：

```bash
phone-disconnect
```

也可以使用 tmux 自带的快捷键：

```text
按 Ctrl + B，再按 D
```

脱离 tmux 后，退出 SSH shell：

```bash
exit
```

### 稍后重新连接

再次用 Termius 建立 SSH 连接，然后接入已有的 tmux 会话：

```bash
tmux ls
tmux attach -t codex
```

也可以新建一个会话：

```bash
agent-new
```

### 远程工作结束后

所有工作完成，准备让 Mac 恢复正常睡眠时，运行：

```bash
mac-awake-off
```

这个命令会停止 `caffeinate`，但不会关闭 Tailscale。让 Tailscale 继续运行，这样 Mac 下次唤醒后便可再次访问。

## 推荐的默认配置

除非确实需要调整，否则建议使用以下配置：

| 组件 | 推荐设置 |
|---|---|
| Tailscale | 保持在后台运行 |
| SSH | 启用远程登录 |
| SSH 身份验证 | 使用专用 SSH key |
| tmux 会话 | 保留一个 `agent` 会话 |
| caffeinate | 用 `mac-awake-on` 启动，用 `mac-awake-off` 停止 |

## 安全注意事项

为 Termius 单独准备一把 SSH key，不要复用日常使用的个人主密钥。

只允许通过可信网络访问 SSH。与把 `22` 端口直接暴露在公网上相比，使用 Tailscale 更合适。

如果某部手机或某把密钥已经停用，请从下面的文件中删除对应的公钥：

```bash
~/.ssh/authorized_keys
```

用以下命令查看当前登录的用户：

```bash
who
```

用以下命令查看 SSH 相关日志：

```bash
log show --predicate 'process == "sshd"' --last 1h
```

## 故障排查

### Termius 无法连接

先检查是否已启用“远程登录”：

```bash
sudo systemsetup -getremotelogin
```

再检查 Mac 上的 Tailscale 状态：

```bash
tailscale status
```

查看 IP 地址：

```bash
tailscale ip
```

确认 Termius 中填写的是：

```text
主机：100.x.x.x
端口：22
用户名：你的 macOS 用户名
```

### Wi-Fi 下可以使用 SSH，4G 或 5G 下却不行

请使用 Tailscale IP，不要填写本地的 `192.168.x.x` 地址。

本地 IP 只能在同一个 LAN 内访问，Tailscale IP 则可以跨网络使用。

### 断开连接后任务停止

请在 tmux 中运行任务。先在手机的 SSH 会话中执行：

```bash
agent-new codex
```

然后分离 tmux 会话：

```bash
phone-disconnect
```

也可以使用 tmux 快捷键：

```text
按 Ctrl + B，再按 D
```

分离 tmux 会话之前，不要直接关闭 shell。

### Mac 睡眠后任务停止

如果之后要用手机远程访问，请先在 Mac 上运行：

```bash
mac-awake-on
```

这个命令会在后台启动 `caffeinate -ims`，并检查 Tailscale 是否可用。

### 合上笔记本上盖后任务停止

对于 MacBook，即使完成了上述配置，合上上盖仍可能导致任务中断。只有接通电源，并通过外接显示器或适当的电源设置进入合盖模式，任务才可能继续运行。

为了让代理任务稳定运行，建议让 Mac 始终接通电源。除非你已经实际验证过当前配置，否则不要合上上盖。

## 最后记住这个模型

远程访问 Mac，其实要分别解决三个问题：

```text
网络连通：Tailscale
远程登录：SSH + Termius
持续运行：tmux + caffeinate
```

把这三个问题分开处理，整个流程就很简单：

```bash
# On the Mac
mac-awake-on

# From the phone after SSH
agent-new codex

# From inside tmux when leaving the phone session
phone-disconnect

# When remote work is fully finished
mac-awake-off
```

至此，你就有了一套可以通过手机操控的轻量级远程执行系统。

## 从手机成功连接后的效果

全部配置完成后，手机成功连接时应该是下面这样：

![通过手机 SSH 会话运行 Codex](/posts/publish/remote-mac-terminal-for-codex/assets/remote-mac-terminal-for-codex/remote-codex-phone-connected-preview.png)

在这个例子中，手机通过 Termius 连接 Mac，当前 shell 已进入 tmux 会话，Codex 则在远程项目目录中运行。
