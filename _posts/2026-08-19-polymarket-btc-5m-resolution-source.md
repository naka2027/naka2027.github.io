---
layout: post
lang: zh
translation_key: polymarket-btc-5m-resolution-source
permalink: /articles/polymarket-btc-5m-resolution-source/
title: "Polymarket BTC 5分钟不是 Binance K线：结算源为什么会影响 Bot 回测"
description: "Polymarket BTC 5分钟策略常用 Binance 行情做研究，但市场最终按自己的结算规则判定 Up / Down。本文解释 Chainlink、TWAP、标签定义和回测误差之间的关系。"
date: 2026-08-19
author: Naka Research
tags:
  - Polymarket BTC 5分钟
  - Chainlink
  - Backtesting
  - BTC 5m
---

研究 **Polymarket BTC 5分钟** 时，有一个非常容易被忽略的问题：

> 你的信号数据来自哪里？

和：

> Polymarket 最终用什么数据判定 Up / Down？

不是同一个问题。

我们的策略研究主要使用 Binance BTCUSDT 5分钟行情。

但 Polymarket 市场最终如何结算，要看对应市场页面写明的 **resolution rules**。

最近的 BTC 5分钟市场规则示例已经明确使用 Chainlink 的 BTC/USD 数据流，并在部分当前市场中使用 Chainlink BTC/USD **TWAP** 作为结算依据。

这意味着：

> **Binance K线可以是策略输入，但它不是最终裁判。**

---

## 为什么这件事平时很难被注意到

大多数时候，不同主流 BTC 数据源方向是一致的。

如果一个 5分钟窗口里 BTC 明显上涨，Binance、Chainlink 和其他主流市场通常不会给出完全相反的方向。

所以在大量普通样本里，数据源差异看起来不重要。

真正敏感的是：

> **接近边界的市场。**

例如窗口开始价和结束价非常接近。

此时：

- 不同交易场所的成交结构；
- 数据聚合方式；
- 时间戳边界；
- TWAP vs 单点价格；

都可能让最终标签发生差异。

---

## 策略数据源和结算源扮演不同角色

我会把它们分成两层。

### Strategy data source

回答：

> 我现在看到的市场状态是什么？

可能使用 Binance、Polymarket order book 或其他实时市场数据。

### Resolution source

回答：

> 这一场最终到底算 Up 还是 Down？

这个答案由具体 Polymarket 市场规则决定。

Polymarket 官方文档也明确说明，每个市场都有预先定义的 resolution source、结束时间和边界规则。

所以一个回测如果只用 Binance 的下一根 K 线涨跌直接当作 Polymarket 真正结果，需要明确这是一个**标签近似**。

---

## TWAP 让“最后一个价格”不再是完整答案

TWAP 是 Time-Weighted Average Price。

高层理解就是：

> 不是只看某个瞬间的一笔价格，而是在指定时间范围内形成一个时间加权价格。

对于 5分钟市场，结算规则一旦采用 TWAP，很多直觉会发生变化。

例如一个极端的最后几秒价格跳动：

```text
spot close 突然翻方向
```

不一定会以同样方式改变 TWAP 结果。

反过来也一样。

所以研究者不能只看：

> Binance 这一根 K 线最后 close > open 吗？

然后认为自己已经完整模拟了 Polymarket 结算。

---

## 这会不会让 Binance 数据“不能用”？

不是。

策略数据和结算数据不必完全相同。

一个策略完全可以认为：

> Binance 的成交活跃度和价格结构对短周期方向有信息价值。

同时承认：

> 最终 Polymarket 标签由它自己的官方结算源定义。

问题不在于“能不能用 Binance”。

而在于：

> **你有没有把研究标签和真实结算标签之间的差异当成一个风险来源。**

---

## 为什么公开回测里专门写了这个限制

我们的公开回测在“代码回放未覆盖的实盘因素”里明确列出：

> Binance 行情与 Polymarket 指定结算源之间的差异。

这是因为标准化五年回放主要研究的是：

> 当前策略逻辑在统一历史行情上的方向质量和风险路径。

它不是每一笔历史 Polymarket 市场的完整盘口与最终官方结算复刻。

两种研究回答的问题不同。

---

## 这类误差为什么会集中在边界样本

假设两个数据源：

```text
Source A: +0.30%
Source B: +0.28%
```

方向相同。

没有问题。

但如果是：

```text
Source A: +0.003%
Source B: -0.002%
```

那么非常小的数据差异就会把二元标签从：

```text
UP
```

变成：

```text
DOWN
```

这就是二元市场特别敏感的地方。

连续价格误差可能非常小。

二元分类结果却可能直接从 1 变 0。

---

## 所以我会把“标签定义”当成策略研究的一部分

回测里经常花很多时间讨论：

- 特征；
- 参数；
- 模型；
- 胜率；
- 回撤。

但有时候更基础的问题反而决定了结果：

> **你到底在预测什么标签？**

对于 Polymarket BTC 5m 来说，这个标签不是：

> “某个交易所 K 线涨还是跌？”

而是：

> “按照这一个 Polymarket 市场页面定义的结算规则，最终结果是什么？”

这是两个很接近、但不完全相同的问题。

---

## 当前最合理的处理方式

我认为至少要做到三件事：

### 1. 明确写出数据源

公开报告写清楚主要研究行情来自哪里。

### 2. 明确写出结算差异

不要暗示历史标签和真实 Polymarket 结算完全等价。

### 3. 实盘以市场规则为准

每一个市场最终如何判定，必须服从对应市场的 resolution rules，而不是策略自己的数据源。

---

## 这也是为什么我不喜欢“回测胜率 = 实盘胜率”

哪怕策略逻辑完全没有变化，真实世界仍然会增加很多层：

```text
research data
↓
signal
↓
Polymarket book
↓
fill
↓
fees / slippage
↓
official resolution rule
↓
final live result
```

从研究到最终收益，不是一条直线。

结算源只是其中一个很小的细节。

但这正是我越来越关注的地方：

> **长期结果往往不是被一个宏大的策略概念决定，而是被很多小定义共同决定。**

---

项目公开回测：

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST.md)

官方参考：

- [Polymarket Resolution](https://docs.polymarket.com/concepts/resolution)
- [Polymarket BTC 5m market example using Chainlink BTC/USD TWAP](https://polymarket.com/zh/event/btc-updown-5m-1786739700)

相关阅读：

[Polymarket Bot 回测：63.75% 胜率到底说明了什么？](/articles/polymarket-bot-backtest-win-rate/)

> 市场结算规则可能继续变化。实际交易时应始终阅读对应 Polymarket 市场页面的最新规则。本文仅用于技术研究与教育。
