---
layout: post
lang: en
translation_key: polymarket-bot-61-positive-months-stability
permalink: /en/articles/polymarket-bot-61-positive-months-stability/
title: "61 Positive Months — Why We Still Weren’t Satisfied With This Polymarket Bot Strategy"
description: "A Polymarket BTC 5-minute research candidate produced 61 positive months, yet weekly, daily, and out-of-sample results showed why no losing months does not automatically mean full-cycle stability."
date: 2026-09-21
author: Naka Research
tags:
  - Polymarket
  - Polymarket Bot
  - BTC 5m
  - Strategy Stability
  - Out of Sample
  - Drawdown
  - Quant Research
  - Backtesting
---

Sometimes a backtest looks good enough that the hardest part is no longer finding something promising.

It is convincing yourself not to stop digging just because the headline looks beautiful.

Recently, while researching Early Entry, we evaluated an independent low-frequency candidate.

One clarification matters from the beginning:

> **This is not our current production strategy package, and it is not a reduced version of the production strategy.**

It is a separate research line asking a narrower question:

> Can a small subset of opportunities become mature enough to act on earlier?

The first monthly summary looked unusually clean:

- Positive months: 61
- Flat months: 0
- Negative months: 0

Across the complete research period:

> **Every one of the 61 months was positive.**

If we stopped there, it would be very easy to say:

> “This strategy is extremely stable.”

But once we started breaking the same result into smaller time units, the picture changed.

---

## 1. No Losing Months Does Not Mean a Smooth Risk Path

The weekly breakdown for the same research candidate was:

| Weekly result | Count |
| --- | ---: |
| Positive weeks | 225 |
| Flat weeks | 2 |
| Negative weeks | 36 |

The positive rate among active weeks was approximately **86.21%**.

The longest consecutive losing-week streak was **3 weeks**, and the worst weekly standardized Score was **-63**.

Placed next to “61 positive months,” this creates an important contrast.

Monthly performance was extremely smooth.

Weekly performance was not.

A month can still finish positive after losing in one week and recovering in the weeks that follow.

The monthly statistic is not wrong.

It is simply compressing the path.

And the path is what a live trading system actually has to survive.

---

## 2. The Daily Breakdown Makes the Difference Even Clearer

Across the full period, the daily statistics were:

| Daily result | Count |
| --- | ---: |
| Positive days | 1,295 |
| Flat days | 62 |
| Negative days | 473 |

The positive rate among active days was approximately **73.25%**.

The longest consecutive losing-day streak was **6 days**, and the worst daily standardized Score was **-46**.

At this point, the key lesson becomes obvious:

> A strategy with no losing months can still experience many losing days and multiple losing weeks.

So “no losing months” describes the aggregated result over a longer horizon.

It does not describe how smooth the trading experience was inside that month.

Those are different questions.

---

## 3. Out-of-Sample Performance Matters More Than the Headline

When a strategy looks good in research, the important question is not:

> Can it explain the full historical dataset?

The important question is:

> **What survives outside the main development period?**

During the 2025–2026 out-of-sample period, this candidate still produced:

- Positive months: 21
- Negative months: 0

At the monthly level, that remains impressive.

But the weekly OOS breakdown was:

| OOS weekly result | Count |
| --- | ---: |
| Positive weeks | 68 |
| Flat weeks | 3 |
| Negative weeks | 19 |

The positive rate among active weeks fell to approximately **78.16%**.

And across 2025–2026, the positive rate among active days was approximately **63.32%**.

This is why we did not stop at:

> “21 positive OOS months.”

The monthly stability remained.

But the finer-grained safety margin had clearly become thinner.

That does not mean the candidate failed.

It means a single monthly statistic is not enough to define stability.

---

## 4. How Can Both Things Be True?

Imagine a month with four weekly standardized results:

- Week 1: -20
- Week 2: +35
- Week 3: -10
- Week 4: +40

The final monthly result is still +45.

If you only look at the month, it was profitable.

If you look at the weeks, half of them lost.

Both statements are true.

They simply answer different questions.

That is why we now prefer to decompose stability across several layers:

> year → month → week → day → trade-level drawdown and losing streaks

The further down we go, the closer we get to the actual risk path experienced in live operation.

---

## 5. Sixty-One Positive Months Still Matter

It would also be a mistake to swing too far in the other direction.

Sixty-one positive months are not meaningless.

And the fact that all 21 OOS months remained positive suggests this is not merely a short-sample accident.

Across the complete period, the candidate also showed:

- Maximum drawdown: -146
- Longest trade-level losing streak: 8
- Standardized Score: +16,266

Those results are strong enough to justify continued research.

But we would describe it as:

> **a low-frequency research candidate with strong monthly stability.**

Not:

> **a fully validated production strategy with uniform stability across every time scale.**

That distinction matters.

---

## 6. OOS Matters More Than the Full-History Average

Another important feature of this research was that earlier historical periods were materially stronger than later ones.

The edge remained positive in validation and OOS periods, but it became much thinner.

A long-run average can easily blend a strong early edge with a weaker recent edge and produce an attractive headline number.

But a production system cannot trade the past.

It only trades the future.

So rather than asking:

> “How good is the five-year average?”

we increasingly ask:

> **How much of the edge is still present in the most recent untouched periods?**

That is why out-of-sample validation matters so much.

---

## 7. This Changed Our Definition of “Stable”

Previously, stability might have meant looking at:

- win rate;
- annual performance;
- monthly performance;
- maximum drawdown.

Now we keep going:

- How many negative weeks are there?
- Has the daily profile deteriorated in recent periods?
- Is the edge concentrated in earlier history?
- Does it survive out of sample?
- Are losses concentrated in particular market regimes?
- How much margin remains after real execution price, fees, slippage, and fill differences?

Stability is no longer one number.

It is closer to:

> **acceptable behavior across different time scales, regimes, and execution conditions.**

---

## 8. So Why Were We Still Unsatisfied?

Not because the result was bad.

Quite the opposite.

An independent research candidate that produces 61 positive months and still keeps all OOS months positive is clearly worth studying further.

What we were unsatisfied with was this:

> **The headline still did not answer whether the strategy was truly robust enough.**

Weekly and daily results showed that:

- volatility had not disappeared;
- the recent edge was thinner than the early edge;
- monthly aggregation was hiding part of the real risk path.

So the next step is not to make “61” look even prettier.

The next questions are:

> **Why does this edge exist?**

> **Which market regimes weaken it?**

> **How much survives after real execution costs?**

> **Can it remain useful as an independent module over time?**

Those questions matter much more than whether every month happened to finish above zero.

---

## Conclusion

The most important lesson from this research was not:

> **61 positive months is impressive.**

It was:

> **A result that looks extremely stable at one time scale can reveal a very different risk structure when viewed at a finer resolution.**

Monthly statistics answer:

> Did the month finish positive?

A live trading system also has to answer:

> What happened in between?

So if someone asks:

> “Why are you still unsatisfied with a strategy that had 61 positive months?”

Our answer is simple:

> **Because the goal is not to make a backtest look stable.**

> **The goal is to understand whether the stability is real.**

---

## Related Research

- [Nearly 80% for Two Days—What Happened Over Five Years?](/en/articles/polymarket-bot-small-sample-five-year-validation/)
- [Why You Can’t Just Run a Polymarket Bot Strategy Earlier](/en/articles/why-polymarket-bot-cannot-simply-run-earlier/)
- [Should a Polymarket Bot Have Only One Entry Time?](/en/articles/polymarket-bot-early-entry-final-confirmation/)

---

*Disclaimer: This article discusses aggregate statistics and validation methodology for an independent Early Entry research candidate. It is not the current production strategy package. The Score shown here uses a standardized research scoring convention and does not represent actual account returns. It also excludes real execution price, order-book slippage, fees, fill rates, and other live-trading differences. No production signal logic, parameters, thresholds, timing nodes, or reproducible trading rules are disclosed.*
