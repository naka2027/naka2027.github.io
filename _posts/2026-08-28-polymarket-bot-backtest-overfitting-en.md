---
layout: post
lang: en
translation_key: polymarket-bot-backtest-overfitting
permalink: /en/articles/polymarket-bot-backtest-overfitting/
title: "No Look-Ahead Isn't Enough: The Other Side of Polymarket Bot Overfitting"
description: "A Polymarket bot can avoid future-data leakage and still overfit. This article separates causal replay from research overfitting and explains time splits, rule selection, parameter neighborhoods, and rejected hypotheses."
date: 2026-08-28
author: Naka Research
tags:
  - Polymarket Bot
  - Overfitting
  - Backtesting
  - Quant Research
---

I often see a reassuring line in trading-system writeups:

> “The backtest runs chronologically and never uses future data.”

That is important.

It is not enough.

**No look-ahead bias does not mean no overfitting.**

Those are two different research problems, and confusing them can make a clean backtest look more independent than it really is.

---

## 1. What does “no look-ahead” actually mean?

In our public replay methodology, historical data advance in chronological order.

The basic rules are:

- a decision may use only information available at that time;
- the unresolved outcome of the target market cannot enter the current decision;
- state that depends on completed results may update only when those results could already be known;
- STOPs and direction adjustments follow the production decision order.

This answers one precise question:

> **At historical time t, did the program read information from after t?**

If the answer is yes, the backtest is fundamentally compromised.

---

## 2. A strategy can overfit without reading a single future candle

Now imagine you have five years of data.

You test a first strategy.

It is mediocre.

You add a filter.

Better.

You add another condition.

Better again.

You inspect the worst months and design a fix.

The curve improves.

At no point does any individual historical trade use a future candle.

But **you**, the researcher, have seen the whole history.

You know which months were weak, which trades lost, which regimes were painful, and which parameter produced the best final chart.

The question has changed from:

> Did the program look into the future?

to:

> **Did the research process repeatedly feed historical answers back into the rules?**

That is a different form of overfitting.

---

## 3. Causal correctness and sample independence are separate

I keep these concepts distinct.

### Causal correctness

Asks whether:

```text
decision(t)
uses only
information(<= t)
```

This is a code and timing property.

### Sample independence

Asks whether a dataset has already influenced:

```text
hypothesis creation
rule selection
parameter selection
model comparison
```

This is a research-design property.

A backtest can satisfy the first and fail the second.

Our public report says so directly: historical market data were used during strategy research, so the full five-year interval is **not a completely untouched independent sample**.

I consider that disclosure part of the result.

---

## 4. Even a “final seven days” may not be fully out-of-sample

A common workflow is:

```text
earlier history → choose parameters
last 7 days → validate
```

That looks like a clean holdout.

But what if a recent market behavior is the reason you invented the feature family in the first place?

Then the final seven days may be excluded from threshold tuning while still having influenced the **idea**.

This is why I do not only ask:

> Were the parameters tuned on the holdout?

I also ask:

> When did we decide to investigate this phenomenon?

Perfect independence is difficult in iterative research.

The important part is not pretending the boundary is cleaner than it is.

---

## 5. I care about how ideas die

Successful rules are easy to publish.

Rejected rules tell you more about the research process.

In one recent internal investigation, a weak recent period motivated a new adaptive filtering idea.

It looked useful in the local sample.

Before accepting it, we checked it against broader criteria:

- longer history;
- different time periods;
- full-strategy drawdown;
- losing streaks;
- historical parameter selection;
- whether it was simply explaining losses we had already observed.

It did not pass the acceptance standard.

So it was not shipped.

A research process that never rejects its own ideas would worry me much more.

---

## 6. Parameter neighborhoods are more interesting than the “best parameter”

Suppose parameter X produces an excellent result.

But:

```text
X - a little → poor
X + a little → poor
```

That looks fragile.

It may simply be a spike in historical noise.

I would rather see:

```text
a reasonably wide neighborhood
→ similar directional result
```

We do not publish the actual strategy thresholds or parameter grids.

But the research principle is public:

> **A broad, stable region is more convincing than one magical point.**

---

## 7. Different time slices answer different questions

I do not want only:

```text
2021 → 2026
aggregate result
```

I also want:

- calendar years;
- months;
- weeks;
- recent rolling windows;
- chronological segments.

The purpose is not to find the prettiest table.

It is to ask:

> Does the edge exist only in one period?

A rule that looks like:

```text
2021 strong
2022 strong
2023 strong
2024 broken
2025 broken
```

is different from a rule that is mildly positive across most periods, even if the five-year aggregate is identical.

---

## 8. A higher total score can still be a worse strategy

Suppose a new rule increases the standardized total score.

That sounds like success.

But I still want to know:

- did maximum drawdown worsen?
- did the longest losing streak worsen?
- did the worst week worsen?
- did trade count collapse?
- did a handful of extreme samples create most of the improvement?
- was the effect absent for entire years?
- is the result highly sensitive to one threshold?

Quant research is not one-number optimization.

If you only optimize the final score, the strategy can become a compressed encoding of historical answers.

---

## 9. What an honest backtest conclusion sounds like

I am uncomfortable with:

> “Five years of backtesting proves the strategy is consistently profitable.”

I prefer:

> “The current rules show historical directional quality and path stability under chronological replay. Historical data were used during research, so the result is not a fully independent out-of-sample forecast and does not guarantee future behavior.”

It is less promotional.

It is also closer to what the evidence can support.

---

## 10. My checklist for a more credible Polymarket bot backtest

I ask:

```text
Was future information used?
↓
Was the same history used during research?
↓
Does the result persist across time slices?
↓
Is the parameter neighborhood stable?
↓
Are rejected hypotheses documented?
↓
What do drawdown and loss streaks look like?
↓
Can production code reproduce the research decisions?
↓
What execution friction is still missing?
```

None of this proves the future.

The goal is narrower and more useful:

> **reduce the number of ways we can fool ourselves.**

That is one of the main jobs of a backtest.

---

Public methodology:

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST_EN.md)

Related:

- [Polymarket Bot Backtesting: What Does a 63.75% Win Rate Actually Mean?](/en/articles/polymarket-bot-backtest-win-rate/)
- [A Good Backtest Is Not Enough: Why Production Code Must Reproduce It Trade by Trade](/en/articles/polymarket-bot-replay-production-validation/)

> This article is for technical research and educational purposes only. Historical data, backtests, and statistical validation do not guarantee future performance.
