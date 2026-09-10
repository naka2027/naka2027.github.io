---
layout: post
lang: zh
translation_key: polymarket-btc5m-twap60-proxy-validation
permalink: /articles/polymarket-btc5m-twap60-proxy-validation/
title: "Polymarket BTC 5m 研究：用 Binance 1 秒数据构造 TWAP60，能否可靠用于历史研究？"
description: "使用真实 Chainlink BTC/USD TWAP 60s 数据，对 Binance 1 秒 Close 与 OHLC4 两种 TWAP60 proxy 进行校准，并用五年数据验证重建方法是否会改变研究结论。"
date: 2026-09-10
author: Naka Research
tags:
  - Polymarket
  - Polymarket Bot
  - BTC 5m
  - Chainlink
  - TWAP60
  - Binance
  - Quant Research
  - Data Validation
---

如果你在研究 **Polymarket BTC 5 分钟 Up/Down**，很快会遇到一个基础问题：

> **历史研究到底应该使用什么价格数据？**

Binance 的优势很明显。

它有长期、连续、粒度很高的 BTCUSDT 历史数据，包括 1 秒 K 线、成交量、成交笔数和更多交易所微观结构信息。

但 Polymarket BTC 5 分钟市场的最终结算参考并不是 Binance。

市场规则使用的是 **Chainlink BTC/USD TWAP Data Stream**。

这意味着，即使 Binance 与 Chainlink 描述的是同一个 BTC 市场，它们也不是完全相同的数据源。

于是问题变成了：

> 如果长时间跨度的真实 Chainlink TWAP60 历史数据并不容易获得，我们能不能利用 Binance 1 秒数据构造一个足够可靠的 TWAP60 proxy，用于历史研究？

最近我们终于有机会用一整天的真实 Chainlink TWAP60 数据，对这个问题做一次直接校准。

结果比预期更有意思。

---

## 1. 我们不是在尝试“复制 Chainlink”

这里首先要澄清目标。

我们并不知道 Chainlink TWAP60 的完整内部实现，包括其全部：

```text
上游数据来源
多市场聚合
内部采样频率
异常值处理
权重逻辑
精度与取整过程
```

因此，仅仅依靠 Binance BTCUSDT 数据，不可能严格重建出一条与 Chainlink 完全相同的价格序列。

我们的目标更实际：

> **Binance-derived TWAP60 是否能够足够准确地保留真实 Chainlink TWAP60 的 5 分钟方向、运动幅度和短周期结构？**

如果答案是“可以”，那么它就能够成为长期历史研究中的一个合理 proxy。

注意，这和“它能不能精确复制 Chainlink 每一个价格点”是两个完全不同的问题。

---

## 2. 两种 Binance-derived TWAP60

我们同时构造了两种版本。

### 版本 A：1 秒 Close

最直接的方法，是把每一根 Binance 1 秒 K 线的收盘价作为这一秒的代表价格：

```text
P(t) = Close(t)
```

然后计算 trailing 60-second average：

```text
TWAP60(t)
=
mean(
    P(t-59),
    ...
    P(t)
)
```

### 版本 B：1 秒 OHLC4

另一种方法，是先把每一秒的 OHLC 压缩成一个代表价格：

```text
P(t)
=
(
    Open(t)
  + High(t)
  + Low(t)
  + Close(t)
) / 4
```

再使用完全相同的 60 秒 rolling 逻辑：

```text
OHLC4
  ↓
60-second rolling average
  ↓
TWAP60 proxy
```

两种方法唯一的核心差异，是：

> **每一秒到底用 Close，还是用这一秒的 OHLC4 来代表价格。**

后面的时间窗口与 5 分钟边界逻辑保持一致。

---

## 3. 为什么 OHLC4 可能更合理

假设某一秒 Binance 的价格为：

```text
Open  = 100
High  = 104
Low   = 99
Close = 103
```

如果只使用 Close，那么这一整秒最终被表示为：

```text
103
```

而 OHLC4 是：

```text
(100 + 104 + 99 + 103) / 4
= 101.5
```

对于一个交易所自身的 K 线来说，Close 是非常自然的价格。

但如果研究目标是逼近一个经过时间平滑、并且来源并不局限于单一交易所的 reference price，那么一个秒内更加平均化的代表值，有可能更接近真实价格运动的整体形状。

这只是一个研究假设。

真正重要的不是解释，而是拿真实数据验证。

---

## 4. 用真实 Chainlink TWAP60 做校准

这次使用的是 **2026-09-04 UTC** 的真实 Chainlink BTC/USD TWAP60 数据样本。

当天数据的秒级覆盖率约为：

```text
95.204%
```

一个完整 UTC 日有 288 个 BTC 5 分钟区间。

为了避免“找最近一条数据”人为提高一致率，我们只接受：

> **开盘边界秒和收盘边界秒都存在真实 Chainlink 报告的 5 分钟区间。**

最终得到：

```text
288 个理论 5m 区间
258 个拥有两端精确边界
```

另外 30 个区间因为缺少至少一个精确边界，不做方向判定。

没有使用：

```text
nearest tick
forward fill
interpolation
```

这一步很重要。

因为对于 5 分钟 Up / Down 市场来说，一个非常接近边界的邻近价格，并不等于边界本身。

---

## 5. 5 分钟方向：非常接近

先看最重要的指标：**5 分钟方向**。

真实 Chainlink TWAP60 与两个 Binance proxy 的方向一致率分别为：

| Proxy | 精确边界样本 | 方向一致率 |
|---|---:|---:|
| 1s Close | 258 | **99.225%** |
| 1s OHLC4 | 258 | **99.612%** |

也就是说：

```text
Close proxy:
256 / 258 同方向

OHLC4 proxy:
257 / 258 同方向
```

更值得关注的是，方向分歧几乎全部集中在真实 TWAP 变化非常接近 0 的区间。

当真实 Chainlink TWAP60 的 5 分钟绝对变化达到约：

```text
0.5 bp 或以上
```

在这一天的样本中：

```text
Close  : 100% direction agreement
OHLC4  : 100% direction agreement
```

这不能证明未来任何一天都会是 100%。

但它说明一个非常重要的事实：

> **有意义的 5 分钟方向运动，并没有因为 Binance-derived reconstruction 而被明显扭曲。**

---

## 6. 不只是方向，运动幅度也非常接近

方向一致还不够。

一个 proxy 可能方向相同，但振幅完全失真。

因此我们继续比较 5 分钟 move。

结果：

| Proxy | Move Pearson | Move Spearman | Signed Move MAE |
|---|---:|---:|---:|
| 1s Close | **0.999510** | 0.998343 | 0.337 bp |
| 1s OHLC4 | **0.999586** | 0.998537 | 0.315 bp |

OHLC4 的误差略低。

对于高覆盖率的 5 分钟区间，我们还比较了 range：

```text
Close range Pearson  = 0.999730
OHLC4 range Pearson  = 0.999753
```

真实 Chainlink range 与 proxy range 的中位比例约为：

```text
0.987
```

换句话说，在这一日样本中：

> **两种重建方法不仅方向非常接近，连 5 分钟运动幅度和 range 的形状也几乎同步。**

---

## 7. 但“方向很像”不代表“价格完全一样”

这是整个校准里最容易被误解的地方。

如果只看 5 分钟方向，很容易得出：

> Proxy 已经和 Chainlink 一样了。

实际上并不是。

Binance 是一个单独的交易市场。

Chainlink 描述的是一个经过更广泛市场数据聚合后的 BTC/USD reference state。

因此：

```text
Binance price
-
Binance-derived TWAP
```

与：

```text
Binance price
-
Real Chainlink TWAP
```

并不是同一个量。

我们观察到，proxy 与真实 Chainlink 在**相对价格位置**上的一致程度，明显低于它们在 5 分钟方向上的一致程度。

这说明：

> **cross-venue basis 是真实存在的。**

特别是在两条价格非常接近的时候，小幅基差就可能改变“谁在上、谁在下”。

所以我们不会把 Binance-derived TWAP60 当成：

```text
Chainlink price emulator
```

更准确的定义是：

```text
historical market-structure proxy
```

---

## 8. 为什么还要做五年 robustness test

一天的真实 Chainlink 校准可以回答：

> 这套重建方法在真实数据上像不像？

但它不能回答另一个问题：

> 如果重建方法从 Close 改成 OHLC4，长期研究结论会不会发生巨大变化？

因此我们又做了第二层测试。

当前长期数据集包含：

```text
525,968 根 BTC 5m 数据
```

覆盖：

```text
2021-09-09
→
2026-09-10
```

我们没有重新优化任何参数。

而是把两套 TWAP reconstruction 放进同一个固定研究框架：

```text
Close version
vs
OHLC4 version
```

直接比较长期结果是否稳定。

---

## 9. 五年数据告诉我们：两种重建几乎是同一个结构

在 525,968 根 5 分钟数据中：

```text
TWAP 5m direction agreement
= 99.8276%
```

两套 spot–proxy 相对方向的一致率：

```text
99.6616%
```

Gap magnitude 的 Pearson correlation：

```text
0.999929
```

Signed gap correlation：

```text
0.999952
```

TWAP 5m move correlation：

```text
0.999987
```

两种 proxy 的 gap 中位绝对差异只有：

```text
0.0208 bp
```

这意味着：

> **历史研究并没有依赖“某一种非常精细的 TWAP 重建细节”才能成立。**

如果 Close 与 OHLC4 只发生一个很小的输入变化，整个长期市场结构就完全改变，那会是一个明显的危险信号。

实际结果恰恰相反。

两者高度一致。

---

## 10. OHLC4 为什么成为新的主研究 proxy

现在我们有两条相互独立的证据。

第一条来自真实 Chainlink：

```text
OHLC4 direction agreement > Close
OHLC4 move MAE < Close
OHLC4 range correlation 略高
```

第二条来自五年 robustness：

```text
Close 与 OHLC4 的长期结构几乎完全一致
```

所以我们最终做了一个很简单的调整：

> **后续历史研究将以 OHLC4-based TWAP60 作为主要 proxy。**

Close 版本不会被删除。

它会继续保留为：

```text
robustness benchmark
```

因为一个长期研究结果如果同时能在：

```text
1s Close reconstruction
和
1s OHLC4 reconstruction
```

上保持一致，通常比只在某一个版本上成立更令人放心。

---

## 11. 这并不意味着实盘应该忽略 Chainlink

这里还有一个很重要的架构区别。

历史研究需要：

```text
长期
连续
高频
可重复
```

的数据。

Binance 非常适合这个角色。

但 Polymarket 最终结算相关的真实 reference 仍然是 Chainlink。

所以更合理的研究与验证结构是：

```text
           Binance 1s market data
                    │
                    ▼
          OHLC4-derived TWAP60
                    │
                    ▼
       historical / live research state


        Real Chainlink TWAP60
                    │
                    ▼
      settlement / validation /
       ongoing proxy calibration
```

两条线不是互相替代。

它们承担的是不同角色。

---

## 12. 这次校准真正解决了什么

这次研究并没有证明：

```text
我们精确复制了 Chainlink
```

也没有证明：

```text
某个交易策略未来一定有效
```

真正得到验证的是一个更基础的问题：

> **Binance 1 秒数据构造的 TWAP60，是否足够可靠地保存真实 Chainlink TWAP60 的 5 分钟方向与运动结构？**

至少在目前获得的真实样本上，答案非常积极。

同时，五年 Close / OHLC4 robustness test 又表明：

> **长期研究结论对 TWAP reconstruction 的轻微变化并不敏感。**

对量化研究来说，这类结果往往比单独找到一个更漂亮的回测数字更重要。

因为在研究任何模型之前，我们首先需要知道：

> **研究数据本身是否值得信任。**

---

## 13. 仍然存在的限制

这次结果需要保留几个非常明确的边界。

### 第一，真实 Chainlink 校准目前只有一个完整 UTC 日

258 个精确边界样本足以做 reconstruction sanity check。

但远不足以证明：

```text
长期所有市场环境
都具有同样的一致率
```

所以后续仍然需要积累更多真实 Chainlink TWAP60。

### 第二，proxy 不能复制 Chainlink 的 cross-venue basis

Binance-derived TWAP 的输入仍然只有 Binance。

它无法知道：

```text
Coinbase
Kraken
其他交易市场
上游 provider
Chainlink 内部聚合
```

当时发生了什么。

因此绝对价格和小幅相对价差不能被当成官方 Chainlink 的精确历史替代。

### 第三，proxy validation 不等于 strategy validation

证明：

```text
proxy direction ≈ real direction
```

并不等于证明：

```text
任何基于 proxy 的交易规则都一定盈利
```

数据质量验证和策略有效性验证，是两个不同阶段的问题。

---

## 14. 下一步

接下来我们会继续做三件事。

首先，继续积累真实 Chainlink TWAP60 数据，让校准从：

```text
one-day validation
```

逐步扩展到：

```text
multi-day
multi-volatility
multi-regime
```

其次，以 OHLC4 proxy 作为新的主要历史研究基准，同时保留 Close 版本作为长期对照。

最后，对于任何后续研究结果，都继续做 reconstruction robustness：

> 如果一个现象只存在于某一种极其具体的数据构造方式里，那么它本身就值得怀疑。

---

## Conclusion

最初的问题是：

> **我们能不能用 Binance 1 秒数据“重建 Chainlink TWAP60”？**

现在看来，这个问题本身问得并不准确。

更好的问题应该是：

> **我们能不能构造一个足够可靠的 proxy，让它保存真实 TWAP60 最重要的方向和短周期运动结构？**

目前的答案是：

**可以，而且一致程度比预期高得多。**

但同样重要的是：

**Proxy 仍然不是 Chainlink。**

OHLC4-based TWAP60 接下来会成为我们的主要历史研究 proxy。

真实 Chainlink TWAP60 则继续承担它无法被替代的角色：

> **真实结算参考、实时验证来源，以及长期校准标准。**

这两条数据线放在一起，才是更可靠的研究基础。

---

## Related Research

- [为什么 Polymarket 的 Chainlink 结算，让 BTC 5 分钟机器人更难研究？](/articles/polymarket-chainlink-btc5m-research-difficulty/)
- [Polymarket 机器人研究：Binance 与 TWAP60 价差能预测下一根 BTC 5 分钟方向吗？](/articles/polymarket-bot-binance-twap60-divergence/)

---

### References

- [Polymarket Developer Documentation](https://docs.polymarket.com/)
- [Polymarket BTC Up/Down 5m Markets](https://polymarket.com/)
- [Chainlink Data Feeds](https://chain.link/data-feeds)
- [Binance Spot API Documentation](https://developers.binance.com/docs/binance-spot-api-docs/)
- [Polymarket Crypto Up/Down — Market Data Samples](https://github.com/Ligengxin96/polymarket-data-samples)
- [OutcomeTick — Historical Prediction Market Data](https://outcometick.com/)

---

*Disclaimer: This article documents a research process for data reconstruction and validation. It is not financial advice, does not promise trading profitability, and does not disclose or describe a complete production trading strategy.*
