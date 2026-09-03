---
layout: post
lang: zh
translation_key: why-polymarket-bot-strategies-fail
permalink: /articles/why-polymarket-bot-strategies-fail/
title: "为什么很多 Polymarket Bot 策略一到实盘就失效？三个公开失败案例里的共同点"
description: "从公开的 Polymarket Bot 研究日志、失败项目和回测工具中，拆解三类最常见的策略陷阱：错误的价格假设、把高概率当 edge、以及不断调参后的历史拟合。"
date: 2026-08-13
author: Naka Research
tags:
  - Polymarket Bot
  - 策略研究
  - Backtesting
  - BTC 5m
---

如果你搜索 **Polymarket Bot strategy**，会看到两种完全不同的内容。

一种是：

> “我找到了一个 90%+ 胜率策略。”

另一种是：

> “我做了几个月，最后把策略关了。”

我现在反而更愿意读第二种。

因为一个策略为什么死掉，通常比“一个策略为什么看起来能赚钱”更接近真正的研究问题。

过去几个月，公开社区里已经出现了不少有价值的失败记录。它们不一定和我们的 BTC 5分钟策略方向相同，但暴露的问题高度重复。

我总结下来，最值得警惕的是三个陷阱。

---

## 1. 第一类：把“高概率”误当成 edge

LayerX 公开过一套 Polymarket 自动交易研究日志。

他们的第一版 15 分钟 Crypto Up/Down 策略，思路很直观：

> 在接近结算时，买价格已经很高的一侧。

例如市场已经在 0.80 到 0.99 之间，直觉上它“看起来更可能赢”。

结果实盘测试中，该版本亏损 **37.81%**，最后被关闭。

他们给出的核心复盘是：

> 高价格只说明市场本身认为这个结果概率高，并不自动意味着市场低估了这个结果。

这是二元市场里一个很基础、但非常容易犯的错误。

---

## 价格不是“胜率提示器”

假设 YES = 0.95。

很多人会自然理解成：

> “95% 胜率，买它很稳。”

但真正的问题应该是：

> **真实胜率是否高于这个价格隐含的盈亏平衡要求？**

如果真实成功概率也是 95%，那么你没有发现 edge。

你只是用接近公平的价格买了一个高概率结果。

更糟的是，真实交易还要加上：

- spread；
- fee；
- slippage；
- adverse selection。

所以：

> **“这个结果很可能发生”**

和：

> **“这个价格值得买”**

是完全不同的问题。

这也是为什么我不喜欢单独讨论胜率。

---

## 2. 第二类：纸面价格不是你能成交的价格

LayerX 后来测试了一种 CEX momentum 思路。

纸面表现一开始看起来不错。

但转到真实执行时，他们发现一个关键问题：

> 研究/模拟使用的价格和真实下单需要面对的价格不是同一个价格。

他们公开的复盘中，信号侧使用了 Gamma API 的 bid 信息，而真实买入需要面对 CLOB ask。

结果是：

```text
paper opportunity
↓
live ask price
↓
edge 消失
```

有些订单根本无法按模拟价格成交。

这不是一个“策略预测错了”的问题。

而是：

> **策略研究从一开始就在回答一个无法真实执行的问题。**

---

## 为什么这种错误特别危险？

因为它会制造非常漂亮的“幻觉收益”。

例如回测假设：

```text
mid = 0.52
buy at 0.52
```

真实市场可能是：

```text
bid = 0.50
ask = 0.55
```

如果你真正是 taker：

> 你面对的是 0.55，不是 0.52。

一个只有几个百分点 edge 的策略，可能瞬间从正期望变成负期望。

Polymarket 当前真实交易还存在按市场启用的 taker fee。官方文档中，Crypto 类市场的 taker fee 参数和价格相关，而 maker 不收交易费并可能参与 rebate。

所以“信号对不对”之前，还要先问：

> **这个 edge 在真实可成交价格和费用之后还剩多少？**

---

## 3. 第三类：不断修参数，直到历史满意

另一个很有意思的公开项目叫 **polymarket-bot-graveyard**。

作者连续做了六个自动交易机器人，最后没有找到可靠 edge，反而把每一个失败版本按：

```text
Goal
Hypothesis
How I built it
What happened
Why it died
What survived
```

记录下来。

我很喜欢这种结构。

因为它暴露了量化研究里最常见的诱惑：

> 一个版本不好，就继续修。

这个过程本身没有错。

危险的是：

```text
V1 失败
↓
看 V1 的亏损
↓
V2 专门修这些亏损
↓
再看 V2
↓
V3 再修
↓
...
```

如果没有严格的研究边界，最终得到的可能不是一个“越来越理解市场”的策略。

而是：

> **越来越擅长解释这份历史数据的策略。**

---

## 4. “失败项目”为什么值得认真看？

因为成功案例通常只让你看到：

```text
最终策略
最终参数
最终结果
```

失败案例会暴露：

```text
最初假设
↓
为什么当时看起来合理
↓
哪里被现实推翻
↓
研究者如何解释失败
↓
下一版改了什么
```

这个过程更容易判断一个人的研究有没有自我欺骗。

例如 Reddit 上也有开发者公开过多策略测试，其中第一套短周期高概率入场策略出现大幅亏损，后续才逐步转向更严格的价格、套利和验证思路。

这些帖子本身不是科学论文。

但它们反复指向同一个事实：

> **短周期 Polymarket 市场并不会因为“看起来简单”就容易获得 edge。**

---

## 5. 公开回测工具也开始把重点放到“真实可交易性”

最近出现的 prediction-market backtesting 工具，越来越强调：

- timestamp 顺序；
- real order book；
- depth；
- spread；
- slippage；
- costs；
- unseen / forward periods；
- fill assumptions。

这不是偶然。

因为这一类市场里，很容易出现：

```text
方向预测有价值
```

但：

```text
真实价格没有足够 edge
```

或者：

```text
小仓位可行
```

但：

```text
放大仓位后盘口深度不够
```

这种问题。

---

## 6. 这些公开失败案例对我们的启发是什么？

我们的策略和上述公开案例不是同一个策略。

我们也不会因为别人某类 momentum 失败，就推导：

> 所有 directional strategy 都无效。

这种结论过度了。

真正值得吸收的是研究方法。

### 第一：不能用“高胜率”替代 edge

一个方向常赢，不等于按当前价格买它有正期望。

### 第二：研究价格必须和执行问题分开标记

我们的公开五年标准化回放主要衡量方向质量。

所以我们明确不把标准化得分写成真实 PnL。

### 第三：一个新规则不能只证明自己修复了最近亏损

它还要面对更长历史、不同年份、回撤、连亏和历史选择问题。

### 第四：允许研究结论是“不上线”

如果每一次研究最终都得到：

> “发现新 edge，策略升级。”

那反而很可疑。

---

## 7. 我们现在更在意的，是那些“小定义”

做 BTC 5分钟研究之后，我越来越觉得，长期结果不只取决于一个宏大的“策略逻辑”。

更容易决定结果的是这些细节：

> 当前特征有没有越过时间边界？

> 一个窗口到底包含哪些数据？

> 研究标签和 Polymarket 真实结算标签是否完全一致？

> 这个 candidate 是被什么状态否掉的？

> 生产代码有没有逐笔复现研究行为？

> 一个新过滤是不是只解释了近期已知亏损？

这些问题都不会被写成：

> “我们的秘密指标是什么？”

但它们才是研究过程中真正花时间的地方。

---

## 8. 不同研究者的结论可以相反，但方法仍然值得比较

公开社区里有开发者认为：

> 5分钟方向 edge 很难存在，执行才是关键。

也有人公开声称：

> 自己发现了 Binance 到 Polymarket 的短期价格领先关系。

还有项目转向：

- arbitrage；
- market making；
- fair-value；
- ML；
- directional signals。

这些结论彼此冲突。

这很正常。

真正有价值的不是简单选一个你喜欢的故事相信。

而是问：

```text
用了什么数据？
↓
真实价格还是模拟价格？
↓
有没有费用？
↓
有没有 look-ahead？
↓
样本多少？
↓
有没有 OOS / forward？
↓
失败版本有没有公开？
↓
结论能不能被生产实现复现？
```

这套问题，比“他赚了多少”更值得复制。

---

## 最后

我认为现在 Polymarket Bot 内容里最缺的，不是更多“赚钱策略教程”。

而是：

> **把一个策略为什么被相信、为什么被拒绝，说清楚。**

这也是我们这个博客后面会重点记录的东西。

我们不会公开可直接复现策略的公式、阈值和内部规则参数。

但会尽量公开：

- 研究问题；
- 验证逻辑；
- 被否定的假设；
- 公开聚合数据；
- 回测局限；
- 策略与实盘之间还存在的距离。

因为信任不是从一句“我们的策略很强”建立起来的。

它来自：

> **你能不能看见我们是怎么怀疑自己的。**

---

### 外部参考

- [LayerX — Building an Automated Polymarket Trading Bot: A Research Journey](https://layerx.xyz/blog/polymarketbots)
- [Polymarket Bot Graveyard](https://github.com/Hiberius/polymarket-bot-graveyard)
- [DepthFeed — Prediction Market Bot Backtesting](https://polymarketbacktesting.com/resources/prediction-market-trading-bot-backtesting)
- [Polymarket Fees](https://docs.polymarket.com/trading/fees)

项目公开方法：

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST.md)

> 外部案例中的结果属于对应作者公开声明，不代表我们对其策略真实性或未来表现进行背书。本文仅用于研究方法讨论。
