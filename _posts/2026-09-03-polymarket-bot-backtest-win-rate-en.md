---
layout: post
lang: en
translation_key: polymarket-bot-backtest-win-rate
permalink: /en/articles/polymarket-bot-backtest-win-rate/
title: "Polymarket Bot Backtesting: What Does a 63.75% Win Rate Actually Mean?"
description: "A deeper look at Polymarket bot backtesting through 18,633 historical signals: win rate, payoff structure, STOPs, drawdown, losing streaks, overfitting, and the gap between replay and live trading."
date: 2026-09-03
author: Naka Research
tags:
  - Polymarket Bot
  - Backtesting
  - BTC 5m
  - Quant Research
---

If a **Polymarket bot** backtest shows you only one number, I would rather it not be the win rate.

Not because win rate is useless, but because it is unusually easy to misunderstand when separated from payoff structure, execution assumptions, drawdown, and sample selection.

Our current public BTC 5-minute replay snapshot covers September 1, 2021 through September 1, 2026. It contains **18,633 historical signals**, **18,285 executed-order events**, **11,656 wins**, **6,629 losses**, and an **executed win rate of 63.75%**.

63.75% sounds simple.

The important question is not whether 63.75% is high. It is:

> **What payoff structure, risk path, sample history, and execution assumptions produced that number?**

That is where a backtest starts becoming useful.

---

## 1. A 63.75% win rate is not a 63.75% return

Our public replay uses a standardized scoring model:

- correct direction: `+4`
- incorrect direction: `-5`
- STOP / no execution: `0`

Under that structure, the theoretical break-even win rate is approximately:

```text
5 / (4 + 5) ≈ 55.56%
```

So a historical 63.75% executed win rate is meaningfully above the break-even rate **inside this standardized model**.

It still does not mean a 63.75% account return, predictable dollar profit, identical live fills, or the same future win rate.

That is why the public report calls the cumulative figure a **standardized score**, not realized PnL.

For a Polymarket trading bot, direction is only one component. Realized returns also depend on entry price, fees, slippage, liquidity, partial fills, latency, and whether a trade can actually be executed.

Polymarket currently applies taker fees to certain market categories, including fee-enabled crypto markets. Those costs are applied at match time and belong to the live execution environment.

---

## 2. Win rate means little without the cost of being wrong

Imagine two strategies with a 64% win rate.

Strategy A:

```text
Win +1
Loss -1
```

Strategy B:

```text
Win +1
Loss -3
```

They have the same win rate and completely different economics.

Binary markets make this especially important because the token price changes the payoff.

Buying an outcome at a high price gives you less upside when correct while still leaving meaningful downside when wrong.

So the question I care about is:

> **After entry price and trading friction, does the win rate still translate into positive expectancy?**

Our historical report does not claim to perfectly reconstruct every live Polymarket fill, fee, partial fill, order-book condition, or millisecond of latency.

The 63.75% figure should therefore be read as:

> **historical directional quality under chronological replay of the current strategy logic.**

Not as a live-account profit statement.

---

## 3. I also look at STOP

There is another number in the same public snapshot that receives much less attention:

**348 STOP events**, roughly 1.87% of all historical signals.

A STOP is not a software error.

It means a candidate direction existed, but the complete decision chain chose not to participate.

A system that can only output:

```text
UP
DOWN
```

is solving a different problem from a system that can output:

```text
UP
DOWN
NO TRADE
```

The first asks which direction it must choose.

The second also asks whether the opportunity is worth taking.

Related:

[Why a Polymarket Trading Bot Must Learn Not to Trade](/en/articles/why-polymarket-bot-needs-no-trade/)

---

## 4. The ugly path matters more than the average

Two statistics I care about alongside win rate are maximum drawdown and the longest losing streak.

In the current public replay snapshot:

```text
Maximum standardized drawdown: -72
Longest losing streak: 8
```

Those numbers are less marketable than 63.75%.

They are also closer to what a user actually experiences.

A positive long-run strategy can still produce a painful sequence of losses. If you only know the average win rate, normal statistical variance can look like a broken strategy.

The reverse is also true: a short winning streak does not prove the strategy suddenly improved.

---

## 5. Why I split results by time

A five-year aggregate can hide a lot:

- early years may be strong while recent years decay;
- one year may contribute most of the result;
- the strategy may only work in one regime;
- recent behavior may have changed.

That is why I prefer calendar-year and rolling-window views in addition to the aggregate.

In our public report, the four complete calendar years from 2022 through 2025 show executed win rates between **61.78% and 65.64%**.

That is more informative than one five-year number.

It still does not prove future persistence because historical data were used during strategy research.

---

## 6. “No look-ahead” still does not mean independent data

A backtest can be perfectly chronological and still suffer from:

- parameter-selection bias;
- rule-selection bias;
- repeated experimentation;
- survivor bias;
- overfitting to known historical behavior.

Our public report says this directly: the full five-year interval is **not a completely untouched independent sample**.

I would rather disclose that limitation than hide it behind a cleaner performance chart.

Related:

[No Look-Ahead Isn't Enough: The Other Side of Polymarket Bot Overfitting](/en/articles/polymarket-bot-backtest-overfitting/)

---

## 7. What the replay does not fully model

The standardized replay does not fully reconstruct:

- the actual entry price of every Polymarket order;
- real order-book depth;
- executable size;
- slippage;
- all fees;
- network and API latency;
- partial fills;
- rejections and timeouts;
- downtime;
- differences between strategy data feeds and the official resolution source.

Polymarket orders also have different time-in-force semantics, including GTC, GTD, FOK, and FAK.

A backtest line that says:

```text
signal → trade → win
```

compresses a real execution process into a simplified event.

Useful? Yes.

Complete? No.

---

## 8. So does 63.75% matter?

Yes, if we are precise about what it represents.

For me, it says:

> Under the current strategy rules and standardized scoring assumptions, chronological historical replay produced directional quality above the model's break-even threshold across a large multi-year sample.

It does not say the next five years will look the same, and it does not say live PnL equals the standardized score.

A trustworthy Polymarket bot should not only show its best number.

It should also explain how the number was produced, what was filtered, what the worst path looked like, what live friction remains unmodeled, whether research reused historical data, and which claims the backtest cannot support.

That context is the difference between a metric and an argument.

---

## Public data snapshot

```text
Period                  2021-09-01 → 2026-09-01
Historical signals      18,633
Executed orders         18,285
STOP                    348
Wins / Losses           11,656 / 6,629
Executed win rate       63.75%
Standardized net score  +13,479
Max drawdown            -72
Longest loss streak     8
```

Full methodology:

[Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST_EN.md)

Project:

[Polymarket BTC 5m Bot](https://github.com/naka2027/polymarket-bot)

### References

- [Polymarket Fees](https://docs.polymarket.com/trading/fees)
- [Polymarket Order Lifecycle](https://docs.polymarket.com/concepts/order-lifecycle)

> This article is for technical research, educational, and informational purposes only. It is not financial or investment advice. Historical and backtested results do not guarantee future performance.
