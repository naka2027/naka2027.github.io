---
layout: post
lang: zh
translation_key: building-polymarket-btc5m-bot
permalink: /articles/building-polymarket-btc5m-bot/
title: "Polymarket BTC 5分钟机器人是怎么工作的？从信号到自动执行"
description: "从市场发现、数据连续性、信号、市场状态、STOP、动态仓位到订单执行，拆解一个 Polymarket BTC 5分钟自动交易机器人的完整决策链。"
date: 2026-09-02
author: Naka Research
tags:
  - Polymarket 机器人
  - BTC 5m
  - 自动交易
  - 风控
---

很多人第一次看到 **Polymarket BTC 5分钟机器人**，会把它理解成一个很短的程序：

```text
看 BTC 涨跌
↓
判断 Up / Down
↓
下单
```

真正长期运行的系统远比这复杂。

我们在做 BTC 5分钟自动交易时，越来越明确的一件事是：

> **预测方向只是整个系统的一部分。一个信号能不能变成真实订单，中间还有很多层。**

这篇文章不公开可用于复现策略的公式、阈值、历史窗口或内部方向映射，而是把整个系统的公开逻辑完整拆出来。

---

## 1. 第一步不是预测，而是找到“当前市场”

BTC 5分钟市场不断滚动。

一个自动化系统首先需要回答：

```text
现在对应的是哪一个 BTC 5m market？
它什么时候开始？
什么时候结束？
Up / Down 对应哪些 token？
市场状态是否仍然可交易？
```

这看起来不像“策略”，但它是所有后续决策的前提。

如果 market window 找错了，后面的信号再准确也没有意义。

所以我们把 **market discovery** 看成交易系统的一部分，而不是外围工具。

---

## 2. 数据不是“有就能用”

自动系统接收到行情后，并不会立刻进入信号计算。

至少还要判断：

- 数据是否足够新；
- 中间有没有缺失；
- 当前状态需要的历史是否准备完成；
- 已结束的 candle 是否真的已经结束；
- 时间戳有没有错位。

在五分钟市场里，一条迟到的数据和一条错误的数据有时没有本质区别。

因此我们的公开决策链更接近：

```text
Market discovery
↓
Data freshness
↓
Continuity / state readiness
↓
Signal research
```

而不是：

```text
Price → Signal
```

---

## 3. 一个信号通常不是一个指标

我们不会把某一个公开指标直接等同于最终方向。

公开层面可以把信号研究理解成几类问题同时存在：

- 趋势是否仍有延续性；
- 动量是否已经衰竭；
- 局部结构是否出现反转迹象；
- 当前波动环境是否适合使用这个判断；
- 最近是否出现了过于密集的相似触发。

这些信息形成的是 **candidate**，不是订单。

这点非常重要。

因为很多简单 Bot 的结构其实是：

```text
indicator > threshold
↓
BUY
```

而我们更关心：

> **这个方向判断在当前市场上下文中仍然成立吗？**

---

## 4. 为什么需要独立状态，而不是只看最后一根 K 线

五分钟市场很短，但策略本身不应该失忆。

如果每个新市场开始时都把系统清零，那么它看不到：

- 最近已经发生过什么；
- 某类触发是否刚出现过；
- 当前市场环境是否持续；
- 某些状态是不是仍然有效。

因此真正的自动化系统需要维护自己的状态。

这些状态并不等于“亏了就反向”。

我们明确不把账户最近亏损简单转换成：

> 上一单输了，所以这一单反着买。

那是 loss chasing，不是状态建模。

---

## 5. Signal ≠ Trade

这是整个系统里我认为最值得反复强调的一条。

假设信号层给出：

```text
Candidate = UP
```

最终系统仍然可能得到三种不同结果：

```text
KEEP   → 保留方向
ADJUST → 调整候选判断
STOP   → 不参与
```

所以：

> **有方向判断，不代表必须交易。**

在我们的公开历史快照里，18,633 个历史信号中有 348 个最终进入 STOP，而不是形成订单。

这个比例并不大，但 STOP 的意义也不是“越多越安全”。

过滤太强同样可能把本来正确的交易挡掉。

真正的问题是：

> 哪些情况下放弃交易能提高整个系统的风险调整后质量，而不是事后解释某几次亏损？

---

## 6. 仓位是另一个独立问题

方向决定：

> 要不要参与、参与哪一边。

仓位决定：

> 参与多少。

这两个问题不应该混在一起。

我们的自动化系统支持根据账户状态、近期表现和风险边界调整仓位，但这种调整不会改写方向信号，也不是 martingale。

更接近：

```text
Signal says: participate
↓
Risk says: how much exposure is acceptable now?
```

如果资本增长并且状态稳定，仓位可以逐步调整；如果进入回撤或连续亏损阶段，风险层可以主动收缩。

核心目标不是把亏损“追回来”，而是控制错误路径下的暴露。

---

## 7. 下单之前，策略还可能被账户和执行层否决

即使方向和仓位都已经确定，真实订单仍然需要通过更多检查。

例如：

```text
账户是否可用？
余额是否足够？
allowance 是否正常？
这个 market 是否已经交易过？
订单是否还来得及成交？
盘口是否发生异常？
API / 网络状态是否健康？
```

因此一个完整的公开架构可以写成：

```text
Market discovery
      ↓
Data freshness & continuity
      ↓
Signal candidates
      ↓
Market context / state
      ↓
KEEP / ADJUST / STOP
      ↓
Position sizing
      ↓
Account risk checks
      ↓
Execution checks
      ↓
Order placement
      ↓
Order tracking / confirmation
      ↓
Persistence
      ↓
Next 5-minute market
```

真正的自动交易是在这一整条链上自动运行。

---

## 8. 为什么订单生命周期也属于策略现实

回测里很容易写：

```text
BUY UP at 0.52
```

真实世界里却需要面对：

- order type；
- available liquidity；
- partial fill；
- rejection；
- timeout；
- latency；
- spread；
- fee；
- order maintenance。

Polymarket 的 CLOB 支持不同的订单生命周期和成交方式。

这意味着同一个方向判断，在不同执行环境里可能产生完全不同的真实结果。

因此我们把 **strategy validation** 和 **execution validation** 分开。

历史方向研究回答：

> 这个判断在历史时序里表现如何？

实盘执行回答：

> 在真实盘口、费用和延迟下，这个判断能不能变成预期中的交易？

二者不能互相替代。

---

## 9. 为什么回测代码和生产代码还要逐笔对照

另一个容易被忽略的问题是：

> 研究代码表现很好，但上线以后生产代码实际上执行的是不是同一套行为？

总胜率相同并不能证明答案是“是”。

例如两个实现可能：

```text
一笔本来应该交易的被漏掉
+
另一笔本来应该 STOP 的被错误加入
```

最后总订单数甚至可能一样。

因此我们更看重 per-event replay：

- 时间是否一致；
- target 是否一致；
- 基础方向是否一致；
- 后置动作是否一致；
- 最终方向是否一致；
- STOP 是否一致。

公开报告里记录过一次增量验证：此前已经接受的 4,098 个信号，在生产代码刷新后关键决策字段逐笔保持一致。

这种验证没有漂亮的营销效果，但对长期运行非常重要。

---

## 10. 五年回测为什么仍然不能叫“未来证明”

当前公开报告使用严格的时序回放：

> 每一个历史事件的决策，只能使用当时已经存在的信息。

这可以避免最明显的 look-ahead。

但它仍然不等于完全独立的五年 OOS。

因为历史数据参与过策略研究与规则选择。

所以正确的表述是：

> **当前规则在五年历史中的因果回放结果。**

而不是：

> **五年完全未见样本证明未来会继续盈利。**

这两个表述看起来只差一点，研究含义完全不同。

---

## 11. 当前公开历史快照

截至北京时间 2026-09-01 11:35，公开报告记录：

```text
Historical signals        18,633
Executed orders           18,285
STOP                         348
Wins / Losses       11,656 / 6,629
Executed win rate          63.75%
Standardized net score    +13,479
Maximum drawdown              -72
Longest losing streak           8
```

这里的 score 和 drawdown 都属于统一标准化计分，不是美元 PnL，也不是收益率。

完整公开报告：

[查看 GitHub 项目与 Backtest](https://github.com/naka2027/polymarket-bot)

---

## 12. 我们公开什么，不公开什么

这个博客会尽量公开：

- 研究问题；
- 方法；
- 聚合结果；
- 验证过程；
- 失败假设；
- 风险边界；
- 实盘与回测的差距。

但不会公开足以直接复现策略的：

- 精确公式；
- 历史窗口；
- 阈值；
- 权重；
- 方向映射；
- 内部分支优先级；
- 敏感逐笔特征。

简单说：

> **公开研究过程，不公开策略配方。**

这也是本站后续所有 Polymarket Bot 文章的基本边界。

---

## 最后

一个真正自动运行的 Polymarket BTC 5分钟机器人，不应该被理解成：

> “预测 BTC 下一根 K 线然后下单。”

它更像是一整套不断回答问题的系统：

```text
数据可靠吗？
↓
现在有方向候选吗？
↓
当前环境支持它吗？
↓
要不要 STOP？
↓
应该承担多少风险？
↓
账户和执行条件允许吗？
↓
订单最终发生了什么？
↓
生产行为和研究行为仍然一致吗？
```

预测只是其中一层。

**让每一层都不自欺，才是更难的部分。**

相关阅读：

- [Polymarket Bot 回测：63.75% 胜率到底说明了什么？](/articles/polymarket-bot-backtest-win-rate/)
- [为什么一个 Polymarket 机器人必须学会“不交易”？](/articles/why-polymarket-bot-needs-no-trade/)
- [回测结果对了还不够：为什么生产代码必须逐笔复现](/articles/polymarket-bot-replay-production-validation/)

> 本文仅用于技术研究与教育，不构成投资或财务建议。自动化交易存在真实亏损风险。
