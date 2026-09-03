---
layout: post
lang: en
translation_key: polymarket-btc-5m-resolution-source
permalink: /en/articles/polymarket-btc-5m-resolution-source/
title: "Polymarket BTC 5m Is Not a Binance Candle: Why Resolution Sources Matter"
description: "Many BTC 5-minute strategies use Binance data for research, but Polymarket resolves markets under its own rules. This article explains Chainlink, TWAP, label definition, and backtest mismatch."
date: 2026-08-19
author: Naka Research
tags:
  - Polymarket BTC 5m
  - Chainlink
  - Backtesting
  - Resolution
---

There is an easy detail to miss when researching **Polymarket BTC 5-minute markets**:

> Where does your strategy data come from?

and:

> What data does Polymarket use to decide Up or Down?

are not the same question.

Our strategy research primarily uses Binance BTCUSDT five-minute market data.

But the final Polymarket outcome is determined by the **resolution rules on the specific market**.

Recent BTC 5-minute market examples specify Chainlink BTC/USD data, and current examples have used a Chainlink BTC/USD **TWAP** stream as the resolution source.

That means:

> **Binance can be a strategy input without being the final judge.**

---

## Why this is easy to ignore

Most of the time, major BTC data sources agree on direction.

If Bitcoin clearly moves higher during a five-minute window, Binance, Chainlink, and other major venues are unlikely to report completely opposite economic moves.

So in ordinary samples, source mismatch looks irrelevant.

The sensitive cases are:

> **markets that finish near the boundary.**

When the start and end values are extremely close, small differences in venue microstructure, aggregation methodology, timestamp boundaries, and TWAP versus point-in-time pricing can flip the final binary label.

---

## Strategy source and resolution source have different jobs

I separate them conceptually.

### Strategy data source

Answers:

> What market state do I observe right now?

It may include Binance, the Polymarket order book, and other real-time market data.

### Resolution source

Answers:

> What officially counts as Up or Down?

That is defined by the market's Polymarket resolution rules.

Polymarket's documentation explicitly states that each market has predefined rules covering its resolution source, end date, and edge cases.

A backtest that simply labels the next five-minute Binance candle as the Polymarket outcome should therefore describe that as a **label approximation**, not a perfect reconstruction.

---

## TWAP changes the meaning of “the final price”

TWAP means Time-Weighted Average Price.

At a high level, it means the result is not determined by one isolated last trade. Price behavior over a defined interval contributes to the value.

Once a short-duration market uses TWAP, some intuitive shortcuts stop working.

For example, an extreme price jump in the final seconds:

```text
spot close flips direction
```

does not necessarily change the TWAP outcome in exactly the same way.

The reverse can also occur.

So:

> “Did this Binance candle close above its open?”

is not automatically a complete simulation of a Polymarket BTC 5m resolution.

---

## Does that make Binance data unusable?

No.

A strategy data source and a settlement source do not have to be identical.

A strategy can reasonably believe:

> Binance price and trade structure contain useful short-horizon information.

while also acknowledging:

> the official Polymarket label is defined by the market's own resolution source.

The issue is not whether Binance may be used.

The issue is whether the **difference between research labels and official settlement labels is treated as a source of risk**.

---

## Why our public backtest discloses this

Our public report explicitly lists differences between Binance market data and the designated Polymarket resolution source among the live factors not fully modeled by the standardized replay.

The five-year replay is designed primarily to study:

> the current strategy logic's directional behavior and risk path under one consistent historical data process.

It is not a full historical reconstruction of every Polymarket order book and every official market settlement.

Those are different research questions.

---

## Why boundary samples are disproportionately affected

Imagine two sources report:

```text
Source A: +0.30%
Source B: +0.28%
```

Same direction.

No issue.

Now imagine:

```text
Source A: +0.003%
Source B: -0.002%
```

The continuous pricing difference is tiny.

The binary label flips from:

```text
UP
```

to:

```text
DOWN
```

That is one of the peculiarities of binary markets.

Small measurement differences can create a full classification disagreement.

---

## Label definition belongs inside strategy research

Backtesting discussions spend a lot of time on features, parameters, models, win rate, and drawdown.

Sometimes a more basic question matters first:

> **What exactly is the label?**

For a Polymarket BTC 5m market, the label is not:

> “Did one exchange's five-minute candle go up?”

It is:

> “Under the resolution rules of this Polymarket market, what was the official outcome?”

Those questions are similar.

They are not identical.

---

## A reasonable research discipline

At minimum, I want three things.

### 1. Disclose the research data source

Readers should know what market data the strategy replay uses.

### 2. Disclose resolution mismatch

Do not imply that a historical label is a perfect Polymarket settlement reconstruction if it is not.

### 3. Treat the live market rules as authoritative

The actual outcome must follow the resolution rules of the market being traded, not the strategy's preferred data feed.

---

## Another reason “backtest win rate = live win rate” is too simple

Even with identical strategy logic, live trading adds multiple layers:

```text
research data
↓
signal
↓
Polymarket order book
↓
fill
↓
fees / slippage
↓
official resolution rule
↓
final live result
```

Research-to-PnL is not a straight line.

Resolution source is only one small detail.

But that is exactly the kind of detail I increasingly care about:

> **Long-run results are often shaped less by one grand strategy idea than by many small definitions being correct at the same time.**

---

Public methodology:

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST_EN.md)

Official references:

- [Polymarket Resolution](https://docs.polymarket.com/concepts/resolution)
- [Polymarket BTC 5m market example using Chainlink BTC/USD TWAP](https://polymarket.com/zh/event/btc-updown-5m-1786739700)

Related:

[Polymarket Bot Backtesting: What Does a 63.75% Win Rate Actually Mean?](/en/articles/polymarket-bot-backtest-win-rate/)

> Resolution rules can change. Always read the current rule page for the specific Polymarket market before trading. This article is for technical research and educational purposes only.
