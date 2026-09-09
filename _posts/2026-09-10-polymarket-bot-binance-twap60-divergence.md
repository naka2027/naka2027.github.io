---
layout: post
lang: zh
translation_key: polymarket-bot-binance-twap60-divergence
permalink: /articles/polymarket-bot-binance-twap60-divergence/
title: "Polymarket 机器人研究：Binance 与 TWAP60 价差能预测下一根 BTC 5 分钟方向吗？"
description: "从 Binance BTCUSDT 1 秒数据重建 TWAP60，研究 Polymarket BTC 5 分钟机器人中的价差、方向分歧与下一根 TWAP 方向，并记录五年验证方法。"
date: 2026-09-10
author: Naka Research
tags:
  - Polymarket
  - Polymarket Bot
  - BTC 5m
  - Chainlink
  - TWAP60
  - Binance
  - Trading Bot
  - Quant Research
---

如果你在研究 **Polymarket 机器人**，尤其是 **Polymarket BTC 5 分钟 Up/Down 机器人**，有一个问题很容易被低估：

> Binance 上的 BTC 价格，和 Polymarket 最终用于结算的 TWAP 参考状态，并不总是完全同步。

这并不意味着其中一个数据源“错了”。

更准确地说，它们描述的是同一个 BTC 市场的不同层面：

```text
Binance BTCUSDT
→ 实际交易市场的即时价格状态

Chainlink BTC/USD TWAP 60s
→ 经过时间平滑后的结算参考状态

Polymarket BTC 5m
→ 最终按照结算参考判断 Up / Down
```

对于普通中长周期交易，这种小差异可能不重要。

但对于一个只有 5 分钟、最终结果只有 **Up 或 Down** 的预测市场来说，几个 basis points 的差异就可能变得值得研究。

这篇文章记录的是一个正在进行中的研究问题：

> **Binance 与 TWAP60 之间的价差，是否包含关于下一根 Polymarket BTC 5 分钟结算方向的信息？**

这项研究还没有完成。

目前更重要的是研究方法和初步结构，而不是宣布某个“神奇阈值”。

---

## 1. 为什么 Polymarket BTC 5 分钟机器人不能只看 Binance K 线

传统 BTC 量化研究非常方便。

Binance 可以直接提供：

- 1 秒 K 线；
- 1 分钟 K 线；
- 5 分钟 K 线；
- 成交量；
- 成交笔数；
- 订单簿和逐笔成交。

如果一个 BTC 5 分钟市场也直接按照 Binance 的开盘价和收盘价结算，那么研究问题会非常简单：

```text
Binance Close > Binance Open
→ UP

Binance Close < Binance Open
→ DOWN
```

但 Polymarket 的 BTC 5 分钟市场不是单纯按照 Binance BTCUSDT K 线结算。

Polymarket 当前提供 Chainlink 计算的 30 秒和 60 秒 TWAP 数据流，并可通过 RTDS 实时获取。其中 60 秒 TWAP 是我们研究 BTC 5 分钟结算状态时最重要的参考之一。

这意味着一个 **Polymarket trading bot** 实际上面对两个非常接近、但不完全相同的价格状态：

```text
Spot price
vs
TWAP settlement reference
```

关于 Chainlink、Binance 与 Polymarket 三层数据结构，可以先阅读之前的研究笔记：

[为什么 Polymarket 的 Chainlink 结算，让 BTC 5 分钟机器人更难研究？](/articles/polymarket-chainlink-btc5m-research-difficulty/)

---

## 2. 一个简单但很有意思的观察

假设某个 5 分钟边界：

```text
Binance close = 100,100
TWAP60 close  = 100,000
```

两者相差 100 美元。

直接使用美元并不是最好的表达方式，因为 BTC 的绝对价格一直变化。

所以我们更倾向使用 basis points：

```text
Gap_{bp}
=
\frac{|BinanceClose-TWAPClose|}
{ReferencePrice}
\times 10000
```

其中：

```text
1 bp  = 0.01%
5 bp  = 0.05%
10 bp = 0.10%
```

这样无论 BTC 是 40,000 美元、80,000 美元还是 120,000 美元，价差都能在同一个相对尺度上比较。

最开始的问题是：

> **当前 5 分钟结束时，两种价格状态相差越大，下一根 5 分钟方向出现分歧的概率是否也越高？**

也就是研究：

```text
Gap_t
\rightarrow
P(DirectionMismatch_{t+1})
```

---

## 3. 初步结果：价差更像概率变量，而不是硬阈值

第一批测试使用的是一小段连续历史样本，大约包含 **3,253 组“当前 5 分钟 → 下一根 5 分钟”配对数据**。

这里使用的不是官方 Chainlink 历史 TWAP，而是用 Binance 1 秒数据重建的 **TWAP60 proxy**。因此这些结果只能视为研究性近似。

初步结果出现了一个很稳定的形状：

> **当前 spot–TWAP gap 越大，下一根 Binance 与 TWAP60 proxy 方向不一致的概率整体越高。**

低价差区域的不一致率仍然存在，并不会降到零。

随着价差扩大，不一致概率逐渐进入更高区间；在样本中较大的 divergence 状态下，下一根方向分歧概率已经达到基础水平的约 2–3 倍。

这说明我们看到的更像：

```text
P(Mismatch \mid Gap)
```

而不是：

```text
Gap > 某个固定值
→ 下一根必然不一致
```

这是一个很重要的区别。

如果把一个连续概率关系强行压缩成“超过某个值就会错”，很容易制造一个看起来漂亮、实际上并不稳定的参数。

对于 Polymarket 机器人研究来说，**风险强度**可能比单一阈值更有意义。

---

## 4. 更有意思的是：Gap 还有方向

绝对值只能告诉我们两个价格相差多远。

但 gap 本身还有方向。

定义：

```text
SignedGap
=
BinanceClose-TWAP60Close
```

如果：

```text
SignedGap > 0
```

代表：

> Binance 当前价格高于 TWAP60。

如果：

```text
SignedGap < 0
```

代表：

> Binance 当前价格低于 TWAP60。

于是出现了第二个研究问题：

> **当 TWAP60 低于当前 spot 时，下一根 TWAP60 是否更容易上涨？**

反过来：

> **当 TWAP60 高于当前 spot 时，下一根 TWAP60 是否更容易下跌？**

在目前的初步样本里，这个方向关系确实存在。

整体只使用 gap 方向时，预测能力并不强；但当 divergence 进入更明显的区域后，下一根 TWAP60 proxy 朝着 gap 所指方向运行的比例明显提高。

在较大的 gap 子样本中，这个方向比例已经从接近随机的水平上升到 **70% 以上**。

这个现象比单纯研究“两个方向会不会不同”更值得继续验证。

因为对于 Polymarket BTC 5 分钟市场，最终更重要的问题不是：

> Binance 下一根是什么方向？

而是：

> **结算参考 TWAP 的下一根是什么方向？**

---

## 5. 为什么 Spot 高于 TWAP，下一根 TWAP 可能更容易上涨？

可以用一个极简例子理解。

假设某个 5 分钟边界：

```text
TWAP60 = 100,000
Spot   = 100,100
```

当前真实交易市场已经来到 100,100，但最近 60 秒的时间平均状态仍然只有 100,000。

如果接下来 BTC 没有明显回落，只是在 100,100 附近运行，那么新的 TWAP 会逐渐吸收这些更高的价格。

也就是说：

```text
旧的 TWAP 状态
      ↓
100,000

当前 spot 状态
      ↓
100,100
```

中间存在一段尚未完全反映到时间平均价格里的移动。

反方向同理。

当然，这并不意味着 TWAP 必然“追上” spot。

真实价格完全可能立即反转。

所以 gap 本身不是确定性信号。

但它可能描述了一个非常有用的状态：

> **当前市场价格与结算参考之间存在多大的时间错位。**

---

## 6. 单独看 bp 还不够

同样是一个较大的 spot–TWAP gap，它可能由完全不同的价格路径造成。

状态 A：

```text
过去 60 秒持续、平滑上涨
```

状态 B：

```text
前 50 秒几乎横盘
最后 10 秒突然快速拉升
```

最终两种状态都可能产生类似的 TWAP gap。

但它们显然不是同一种市场结构。

因此下一阶段的 Polymarket bot research 不应该只看一个 `gap_bp`。

现在正在同时测试几类高层特征：

- 最近 60 秒价格振幅；
- 60 秒首尾净移动；
- 价格路径效率；
- 短时间加速度；
- 当前 gap 相对于最近正常波动的大小；
- gap 相对于 60 秒价格区间的大小；
- 当前 spot、TWAP 与短周期趋势的方向关系。

研究目标不是无限增加指标。

真正想知道的是：

> **Gap 是怎么形成的？**

因为一个“慢慢形成的 10 bp”和一个“最后几秒突然形成的 10 bp”，很可能具有完全不同的后续含义。

---

## 7. 真正想找的不是高覆盖率，而是高确定性状态

这项研究现在越来越接近一个不同于普通预测模型的问题。

我们并不一定需要预测所有下一根 BTC 5 分钟方向。

更有价值的问题可能是：

> **有没有一些非常少见的市场状态，一旦出现，下一根 TWAP 方向就具有很高的统计确定性？**

例如，一个条件组合可能只覆盖全部市场的很小一部分。

但如果：

```text
触发次数很少
+
长期 Precision 很高
+
不同年份都保持稳定
```

它依然可能非常有研究价值。

因此后续评估不会只看：

```text
Accuracy
```

还会重点看：

```text
Precision
Sample Size
Confidence Interval
Year-by-Year Stability
Volatility-Regime Stability
```

一个在单月达到 90% 的规则没有太大意义。

一个在五年不同市场结构中都能保持较高 precision 的低频状态，才值得认真对待。

---

## 8. 如何用 Binance 1 秒数据重建 TWAP60

这里存在一个现实问题：

**官方 Chainlink TWAP60 的多年高频历史数据并不像 Binance Kline 那样容易批量获取。**

因此目前采用的是研究性 proxy。

Binance Spot REST API 官方支持 `1s` Kline：

```text
GET /api/v3/klines
symbol=BTCUSDT
interval=1s
```

对每一个秒级时间点，先计算最近 60 秒的滚动平均：

```text
TWAP60(t)
\approx
\frac{1}{60}
\sum_{i=0}^{59}Price_{t-i}
```

然后严格按照 UTC 5 分钟边界重新组成：

```text
TWAP60 Open
TWAP60 High
TWAP60 Low
TWAP60 Close
```

同时保留原始 Binance 5 分钟 OHLC，用来比较：

```text
Binance 5m
vs
Reconstructed TWAP60 5m
```

---

## 9. 历史数据缺口必须严格处理

BTC 秒级历史数据并不保证每一秒永远完整。

而对于这项研究，不能简单做：

```text
缺一秒
→ 用上一秒价格补上
```

因为我们研究的差异本身可能只有几个 bp。

错误填充一段价格，可能直接改变：

- TWAP60 close；
- 5 分钟方向；
- gap；
- 最终统计标签。

所以当前数据流程采取更保守的处理：

> **只要构建一个 5 分钟 TWAP 所需要的秒级窗口存在缺口，就直接跳过这一根。**

不插值。

不 forward fill。

也不会因为历史缺口把后面的 5 分钟时间轴错位。

对于高频量化研究，数据完整性通常比“尽量保留更多样本”更重要。

---

## 10. 这不是 Chainlink TWAP60 的完美复制

这一点必须明确。

目前重建出来的是：

> **Binance-based TWAP60 proxy**

而不是官方 Chainlink BTC/USD TWAP60 历史数据。

Chainlink 的 TWAP 来源于其自己的数据聚合和计算流程。

Polymarket 官方文档也明确提醒：Chainlink 并没有公开这个定制 TWAP feed 的完整 sampling boundaries、weighting、rounding 和 missing-input 规则，因此不能把自行计算的 rolling average 当成官方值的精确复制。

所以目前研究真正回答的是：

> **即时 spot 状态与 60 秒时间平均状态之间，是否存在稳定的短周期统计结构？**

如果这个关系在五年 Binance 秒级数据中都不稳定，那么它很可能不值得继续投入。

如果它在不同年份和不同市场结构中仍然存在，那么下一步才是：

> 使用真实 Chainlink TWAP60 数据对 proxy 进行校准和验证。

---

## 11. 为什么要跑五年

一小段数据很容易产生漂亮的数字。

BTC 5 分钟市场尤其如此。

趋势行情、震荡行情、高波动和低波动环境下，同一个短周期关系可能完全不同。

所以当前正在把研究范围扩展到大约五年的 BTC 秒级历史数据。

数据管线会逐日：

```text
拉取 Binance BTCUSDT 1s
        ↓
检查秒级缺口
        ↓
重建 TWAP60
        ↓
生成 5m TWAP OHLC
        ↓
计算 spot–TWAP divergence
        ↓
计算短周期结构特征
        ↓
关联下一根 TWAP 方向
        ↓
持续写入统一研究数据集
```

这意味着需要处理上亿条秒级价格记录。

但最终真正关心的仍然是一个很简单的问题：

> **这种关系能不能穿越不同年份仍然存在？**

---

## 12. 对 Polymarket 机器人研究意味着什么

很多关于 **Polymarket trading bot** 的讨论最后都会回到几个熟悉的问题：

- 用什么指标？
- 胜率多少？
- 下一根 BTC 会涨还是跌？
- 回测收益怎么样？

但 BTC 5 分钟这种极短周期预测市场还有另一层问题：

> **交易市场看到的 BTC，与结算系统看到的 BTC，现在是否处于同一个状态？**

这可能是更基础的问题。

Binance 和 Chainlink 并不是互相替代的数据源。

Binance 描述真实交易流和即时市场状态。

TWAP 描述一个经过时间平滑的结算参考状态。

Polymarket 则把这种参考最终压缩成：

```text
UP
or
DOWN
```

当最终标签只有两个方向时，小小的价格状态差异就可能产生比普通交易中更大的研究意义。

---

## 结论：把 divergence 当成市场状态，而不是数据误差

当前还不能说已经找到了一个稳定的 Polymarket BTC 5 分钟预测规则。

也没有理由因为一小段样本出现较高概率，就直接把它写进生产策略。

目前更合理的结论只有三个：

1. **Spot 与 TWAP60 的价差不是纯粹无意义的噪声。**
2. **Gap 越大，下一根方向关系确实出现了值得继续研究的概率变化。**
3. **Signed gap，也就是 TWAP 位于 spot 上方还是下方，可能包含比绝对价差更有价值的信息。**

接下来真正重要的是五年验证。

如果这些关系只能存在于几天或者几周，它们最终会被丢弃。

如果它们可以跨越不同年份、不同波动环境和不同 BTC 市场结构继续存在，那么：

> **Binance–TWAP divergence 可能会成为研究 Polymarket BTC 5 分钟机器人时一个独立的市场状态变量。**

这也是这次研究最值得继续追踪的地方。

---

### Related Research

- [为什么 Polymarket 的 Chainlink 结算，让 BTC 5 分钟机器人更难研究？](/articles/polymarket-chainlink-btc5m-research-difficulty/)

### References

- [Polymarket Documentation — Chainlink TWAP Prices](https://docs.polymarket.com/market-data/chainlink-twap)
- [Binance Spot API — Kline/Candlestick Data](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

> 本文仅用于技术研究、教育和信息记录，不构成投资、交易或财务建议。文中的 TWAP60 历史数据为基于 Binance 秒级数据构建的研究性近似，不等同于官方 Chainlink 历史结算数据；初步统计也不代表未来市场表现。
