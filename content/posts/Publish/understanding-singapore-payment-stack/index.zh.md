---
title: "看懂新加坡支付体系：从银行 App 到 SGQR、PayNow、FAST、非接触式支付与 NETS"
date: "2026-07-21T10:50:05+08:00"
draft: false
translationKey: understanding-singapore-payment-stack
tags:
  - payments
  - fintech
  - system-design
  - singapore
  - public
  - note
categories:
  - tech


topics:
  - payments
  - system-design
  - singapore-fintech
selected: true

---

如果你住在新加坡，下面这些支付方式大概每天都会用到：

- 通过 PayNow 给朋友转账。
- 在小贩中心扫描二维码付款。
- 在超市用银行卡或手机轻触付款。
- 在本地商户使用 NETS。

对用户来说，这些操作看起来大同小异，底层解决的却是不同的问题。

---

## 先看全貌

![新加坡支付体系](assets/singapore-payment-stack.svg)

这张图有意省略了不少细节，并按照大多数人的实际支付体验来安排顺序：先是 App、银行卡或二维码，再往下进入 SGQR、PayNow 等熟悉的支付入口，最后才是商户网络、银行卡网络和资金转移通道。

---

## 用户层：银行 App、银行卡与二维码

大多数人付款时，不会先琢磨资金究竟要走哪条支付通道。

我们最先接触的是用户界面：

- DBS、OCBC、UOB 等银行的 App。
- DBS PayLah! 这类近似电子钱包的 App。
- 支付 App 内置的二维码扫描器。
- 实体银行卡。
- Apple Pay、Google Pay 等手机钱包。

正是最上面的这一层，让支付用起来很简单。

比如，你在小贩摊位前用银行 App 或 PayLah! 扫码，不必亲自判断该走哪个注册系统、支付方案或结算系统。App 会读取二维码，识别商户支持的支付选项，请你确认，再把交易送入相应的底层路径。

可以先记住这样一个分层思路：

```text
用户体验层
  -> 支付方案或代理寻址层
  -> 资金转移或结算层
```

接下来要讲的，就是下面各层分别负责什么。

---

## SGQR：统一的二维码层

SGQR 是 **Singapore Quick Response Code** 的缩写。

它本身不是支付通道。

它是一套二维码标准。

SGQR 出现以前，商户往往要摆出多个二维码：

```text
PayNow QR | NETS QR | GrabPay QR | 其他二维码
```

SGQR 把这些二维码整合成采用统一标签和载荷格式的单个标准二维码。

一个 SGQR 二维码可以包含：

- 商户名称
- 支持的支付方案
- PayNow 代理标识
- NETS merchant ID
- 可选的付款金额
- 交易参考编号

这里有个细微却重要的区别：SGQR 并不决定资金如何结算。它更像一个容器，也是识别支付选项的入口。用户扫描 SGQR 后，实际走哪条支付路径，取决于所用的 App 和选择的支付方案。

---

## PayNow：身份识别层

PayNow 是新加坡人最熟悉的支付体验之一。

它解决的是一个很实际的问题：

> 不知道对方的银行账号，怎样才能把钱转给对方？

你不必输入银行账户资料，只需使用以下标识：

- 手机号码
- NRIC / FIN
- 企业使用的 UEN
- 部分非银行金融机构钱包使用的 Virtual Payment Address，即 VPA

```text
手机号码 / NRIC / FIN / UEN / VPA
  -> PayNow Registry
  -> 银行账户或参与服务的电子钱包账户
  -> FAST
```

关键是，PayNow 本身并不负责转移资金。它是一套代理寻址系统，帮助付款人找到正确的收款银行账户或参与服务的钱包。

PayNow 经常用于个人转账，但并不只供亲友之间收付款。企业、政府机构、协会和社团也可以把 UEN 与 PayNow Corporate 绑定，通过它收款。

这里还涉及一个安全问题。自 2026 年 6 月 6 日起，新加坡面向零售客户的 PayNow 昵称功能已经停用。付款人现在看到的，不再是收款人自行设置的昵称，而是其账户登记姓名中的部分字母。此举旨在减少冒充诈骗，同时保留一定程度的隐私。

---

## FAST：资金流转的主干道

FAST 是 **Fast And Secure Transfers** 的缩写。

它是新加坡的实时银行间转账网络。

它回答的是一个核心问题：

> 钱怎样才能近乎即时地从一个银行账户转到另一个银行账户？

例如：

```text
DBS 账户 -> OCBC 账户
```

在新加坡境内通过 PayNow 转移新币时，底层走的资金通道就是 FAST。

对用户来说，FAST 往往藏在幕后。你在 App 里看到的是 PayNow，实际负责在参与机构之间转移新币的则是 FAST。

---

## 非接触式卡支付：payWave、PayPass 与手机钱包

payWave 是 Visa 的非接触式银行卡支付技术。

日常交谈中，人们常用“payWave”泛指用银行卡或手机轻触付款。不过严格来说，Mastercard、American Express 和手机钱包各有自己的非接触式支付实现方式。

从系统设计的角度看，更合适的理解方式是把它视为一条 **非接触式卡支付路径**：

```text
非接触式银行卡或手机
  -> POS 终端
  -> 收单机构
  -> 银行卡网络
  -> 发卡机构授权
  -> 商户后续结算
```

使用 Apple Pay 或 Google Pay 轻触手机时，操作体验与直接轻触银行卡很相似。底层通常仍是一笔经过令牌化处理的银行卡交易，而不是 PayNow 转账。

因此，payWave 与 PayNow 并不是同一类支付方式。

```text
PayNow / FAST = 实时账户到账户转账
非接触式支付  = 先经银行卡网络授权，之后结算
```

---

## NETS：本地商户网络

在超市、本地商户、借记卡终端、NETS QR 和 NETS Contactless 等场景中，很多人仍会用到 NETS。只是与扫码或轻触银行卡相比，用户未必会明显意识到它是一套独立系统。

NETS 与 PayNow 不同。

PayNow 主要通过代理标识完成账户到账户付款；NETS 则更侧重本地商户受理。

NETS 支持：

- NETS 银行卡支付
- POS 终端
- NETS QR
- NETS Contactless
- 商户收单

NETS 既是新加坡本地支付品牌，也是一套商户受理网络，旗下分别有 POS、二维码、线上支付、储值支付和车辆相关支付产品。

可以这样区分两者：

```text
PayNow = 使用代理标识进行账户到账户付款
NETS   = 本地商户受理与支付网络
```

---

## 各层分别负责什么

| 层级 | 主要作用 |
|---|---|
| 银行 App / 钱包 / 银行卡 | 提供用户界面、身份验证、付款确认与交易发起功能 |
| SGQR | 统一二维码的呈现方式和载荷标准 |
| PayNow | 代理寻址与收款方查询 |
| FAST | 提供实时银行间新币转账通道 |
| Visa / Mastercard / Amex | 提供全球银行卡授权与结算网络 |
| NETS | 提供新加坡本地商户受理与支付网络 |
| 银行 / 非银行金融机构 | 提供客户账户、App、风险检查、限额与用户体验 |

之所以要分清这些职责，是因为一种支付产品往往会同时用到多个层级。比如，银行 App 可以扫描 SGQR，通过 PayNow 确认商户对应的收款账户，再借助 FAST 转移资金。

---

## 快速对照

| 支付方式 | 主要用途 | 底层模式 | 结算方式 |
|---|---|---|---|
| 银行 App / 钱包 / 银行卡 | 面向用户的支付入口 | App 界面、身份验证、限额与确认 | 取决于所选支付路径 |
| SGQR | 二维码支付入口 | 标准化二维码格式 | 取决于所选支付方案 |
| PayNow | 个人转账、小贩摊位、小商户与企业付款 | 使用代理寻址的账户到账户付款 | 实时或接近实时 |
| FAST | 银行间账户转账 | 实时支付通道 | 实时 |
| 非接触式卡支付 | 零售、商场、交通关联卡、手机钱包 | 银行卡网络授权 | 后续结算 |
| NETS | 本地商户付款 | 本地借记与商户受理网络 | 商户结算 |

不过需要注意：用户确认成功、商户收到通知、结算完成和对账完成，彼此相关，却不一定发生在同一时刻。消费者可能立刻看到付款成功，但商户仍要在之后通过报表、批量处理或对账完成后续流程。

---

## 日常付款实例

在小贩摊位付款时：

```text
用银行 App 或 PayLah! 扫描 SGQR
  -> App 读取 SGQR 载荷
  -> 所选方案可能是 PayNow、NETS QR、GrabPay 等
  -> 付款进入所选方案对应的通道
```

如果选择的是 PayNow：

```text
PayNow 解析商户的代理标识
  -> FAST 转移资金
  -> 商户收到付款通知
```

在超市付款时：

```text
轻触银行卡或手机
  -> POS 终端
  -> Visa / Mastercard / Amex 或 NETS 网络
  -> 发卡机构批准交易
  -> 商户后续结算
```

---

## 走出新加坡之后

同样的分层思路也适用于跨境支付。

PayNow 已与一些海外快速支付系统互联，包括泰国的 PromptPay、印度的 UPI 和马来西亚的 DuitNow。

用户体验依然可以很简单：使用熟悉的标识向对方汇款。但跨境路径会多出一些环节：

- 外汇兑换
- 参与服务的银行或非银行金融机构
- 跨境网关安排
- 各支付方案自身的限额与合规检查

因此，境内支付的分层思路仍然适用，但不能把跨境 PayNow 简单理解成“国际版 FAST”。

---

## 最后的理解框架

新加坡支付体系值得注意的一点，是各层职责划分得很清楚：

- 银行 App、钱包、银行卡和二维码扫描器负责用户体验。
- SGQR 统一二维码入口。
- PayNow 负责识别收款方身份。
- FAST 负责在账户之间转移资金。
- 非接触式卡支付通过银行卡网络完成授权，之后再结算。
- NETS 负责本地商户受理。

这就是为什么日常付款让人感觉很简单，尽管底层系统具有多个层次且十分复杂。

---

## 延伸阅读

- [FAST—新加坡银行公会](https://www.abs.org.sg/e-payments/fast)
- [PayNow—新加坡银行公会](https://www.abs.org.sg/e-payments/pay-now)
- [SGQR 资料说明—IMDA](https://www.imda.gov.sg/-/media/imda/files/about/media-releases/2018/annex-a--singapore-quick-response-code-sgqr.pdf)
- [Visa 新加坡非接触式支付](https://www.visa.com.sg/pay-with-visa/contactless-payments/contactless-payments.html)
