---
layout: post
lang: en
translation_key: polymarket-bot-monthly-stability
permalink: /en/articles/polymarket-bot-monthly-stability/
title: "61 Positive Monthly Scores — Why I Still Won't Call It “61 Profitable Months”"
description: "How should monthly stability be interpreted in a Polymarket bot backtest? This article separates standardized monthly score, live profit, sample distribution, and research overfitting."
date: 2026-08-16
author: Naka Research
tags:
  - Polymarket Bot
  - Backtesting
  - Stability
  - BTC 5m
---

There is one number in our public BTC 5-minute historical replay that would be extremely easy to turn into marketing copy:

> **Across 61 calendar months or partial months, the standardized monthly score was positive in all 61.**

A more promotional version would be:

> “61 profitable months in a row.”

I will not write that.

Those statements are not equivalent.

---

## 1. What does a positive monthly standardized score mean?

The public replay uses a fixed scoring model:

```text
correct direction  +4
incorrect direction -5
STOP                 0
```

The monthly statistic simply aggregates executed historical signals inside each Beijing-time calendar month under the same scoring rule.

So:

> a positive monthly standardized score

means:

> **the cumulative historical path for that month was positive under the common directional-quality scoring model.**

It does not mean:

- realized account PnL;
- realized monthly return;
- an audited live trading statement;
- net profit after every fee and fill effect.

That distinction matters.

---

## 2. Why monthly distribution tells me more than a five-year total

Imagine two strategies with the same final five-year score.

Strategy A:

```text
Year 1  +1000
Year 2  +1000
Year 3  +1000
Year 4  -500
Year 5  -500
```

Strategy B:

```text
Year 1  +400
Year 2  +400
Year 3  +400
Year 4  +400
Year 5  +400
```

The totals may be similar.

The paths are not.

If the research question is stability, I care much more about how the result is distributed through time than about the final cumulative number.

That is the value of monthly slicing.

---

## 3. Sixty-one positive months is strong evidence, but easy to overstate

At minimum, the result suggests that the current historical performance is not being carried by one spectacular month.

That is useful.

It still has important limitations.

### First, the edge months are not all complete months

The public interval starts on September 1, 2021 and ends on September 1, 2026.

The boundary months are partial.

### Second, monthly trade counts differ

Short-horizon signals do not arrive at a fixed frequency across market environments.

One month can contain far more opportunities than another.

A positive score in both months does not imply equal statistical confidence.

### Third, the history participated in research

This is the largest caveat.

The strategy evolved while researchers had access to historical market behavior.

So 61 positive historical buckets are not:

> 61 independent forward tests.

They remain a replay of current rules on history that informed research.

---

## 4. Stability and independence are different properties

I increasingly separate these two ideas.

### Stability

Asks:

> When the current rules are replayed across different historical periods, is the result concentrated in only a few periods?

### Independence

Asks:

> Were those periods untouched during hypothesis, rule, and parameter research?

A strategy can show useful historical stability without having a fully independent five-year out-of-sample record.

Our public report is evidence mainly of the first.

It does not claim the second.

---

## 5. I do not stop at counting positive months

Suppose a strategy shows:

```text
60 months +1
1 month  +10000
```

Technically, every month is positive.

That is not the path I would call robust.

So monthly research should continue into:

- order count per month;
- monthly win rate;
- monthly standardized score;
- intra-month drawdown;
- losing streaks;
- the weakest month;
- whether a few events dominate the result.

“Number of positive months” is only the first description of the distribution.

---

## 6. Short-horizon strategies need time slicing more than they appear to

BTC 5-minute markets generate a large number of repeated windows.

A large event count can create a false sense of certainty:

> We have many samples, therefore the result must generalize.

But 18,000+ signals can still be concentrated inside similar market environments.

Time slicing at least forces us to inspect whether results break across:

- calendar years;
- volatility regimes;
- trending and noisy periods;
- recent versus older history.

It is not a perfect answer.

It is more informative than one aggregate win rate.

---

## 7. “Consistently profitable” requires a much higher evidence bar

I distinguish between these statements.

### Supported by the public replay

> The current strategy produced positive standardized scores in all 61 calendar-month or partial-month buckets in the published five-year replay.

### A reasonable interpretation

> The historical result was not obviously concentrated in only a few months.

### A claim I would not make

> The bot was profitable for 61 consecutive months.

“Profitable” sounds like realized account performance.

“Consistent” sounds like the future will reproduce the same behavior.

The public data do not support those stronger claims.

---

## 8. Trust comes from explaining the attractive number, not hiding it

I do not think the answer is to hide the 61-month result.

It should be published.

But it should be published with its context:

```text
61 calendar or partial months
all positive standardized scores
```

alongside:

```text
not live-account PnL
boundary months are partial
monthly sample sizes vary
historical data informed research
future results can differ
```

Removing the caveats would make the number more marketable.

It would make the information less useful.

For a Polymarket bot, I would rather build trust the slower way.

---

## Public snapshot

At the Beijing-time cutoff of September 1, 2026 11:35:

```text
Historical signals       18,633
Executed orders          18,285
Executed win rate        63.75%
Positive monthly scores  61
Zero monthly scores       0
Negative monthly scores   0
```

Monthly score refers to the standardized replay model, not realized live PnL.

Full report:

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST_EN.md)

Related:

- [Polymarket Bot Backtesting: What Does a 63.75% Win Rate Actually Mean?](/en/articles/polymarket-bot-backtest-win-rate/)
- [No Look-Ahead Isn't Enough: The Other Side of Polymarket Bot Overfitting](/en/articles/polymarket-bot-backtest-overfitting/)

> This article is for technical research and educational purposes only. Historical stability does not guarantee future stability.
