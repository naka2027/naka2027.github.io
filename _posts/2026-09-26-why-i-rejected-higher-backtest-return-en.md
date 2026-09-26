---
layout: post
lang: en
translation_key: why-i-rejected-higher-backtest-return
permalink: /en/articles/why-i-rejected-higher-backtest-return/
title: "Why I Rejected a Strategy Change That Made the Backtest More Profitable"
description: "Higher historical return does not necessarily mean structural improvement. This article explains why several stronger-looking exit and filtering candidates were rejected."
date: 2026-09-26
author: Naka Research
tags:
  - BTC
  - Backtesting
  - Overfitting
  - Quant Research
  - Automated Trading
  - Strategy Stability
---

# Why I Rejected a Strategy Change That Made the Backtest More Profitable

The most dangerous result in quantitative research is not an obvious failure.

It is:

> **a result that looks extremely successful.**

In a recent BTC futures research cycle, I tested new exit and local-filtering ideas.

Some candidates produced significantly higher historical returns than the current frozen version.

If I looked only at terminal equity, they were very attractive.

I still rejected them.

The reason is simple:

> **Historical Improvement ≠ Structural Improvement**

---

## 1. Higher return is only the first question

A candidate that makes more money over the full historical sample tells me only:

> it produced a better result on this history.

It does not prove:

> it discovered a more stable market relationship.

Those are very different claims.

A candidate can improve total performance by:

- fitting early market regimes especially well;
- capturing a few large historical moves;
- changing a small number of highly path-dependent trades;
- trading later stability for earlier gains.

So research cannot stop at:

> higher terminal equity.

---

## 2. I split the history into multiple periods

When a candidate looks strong, I care more about:

> where did the improvement come from?

So I evaluate it across multiple historical phases.

A more convincing improvement should ideally:

- work beyond the early sample;
- avoid material degradation in the middle period;
- preserve improvement in the recent period;
- avoid hiding risk in another regime;
- avoid damaging monthly, weekly, and daily stability.

If the gain comes mostly from one period, a more cautious interpretation is:

> it fits that period well.

Not:

> it improved the strategy itself.

---

## 3. What happened to the strongest-looking candidates?

Some exit-layer candidates looked exceptionally strong on the full history.

They produced:

- materially higher returns;
- especially large improvements at higher leverage;
- equity curves that were hard to ignore.

But when I split the data:

> most of the improvement was concentrated in earlier years.

In later phases:

- the advantage weakened;
- some periods degraded;
- recent history did not reproduce the earlier edge consistently.

Once I required:

> real improvement across multiple phases with no material degradation,

the candidate set shrank rapidly, sometimes to zero.

---

## 4. Why full-sample optimization is dangerous

If parameters are searched on the full historical sample and then judged on the same full sample, the result will naturally tend to look better over time.

That does not require deliberate overfitting.

Even careful researchers are exposed to:

> **Researcher Overfitting**

Over time, you learn:

- which years are difficult;
- which trades hurt the most;
- which thresholds tend to work;
- which candidate families already failed.

That knowledge influences the next experiment.

So "better full-history performance" must be interpreted cautiously.

---

## 5. Local STOP rules have the same problem

Another common research idea is:

> identify historically harmful trades and create a STOP condition to skip them.

That can be reasonable.

But the danger is:

> seeing the bad outcome first, then searching for a condition that describes it.

If a STOP rule:

- removes only a few historical losses;
- damages monthly or weekly stability;
- hurts higher-leverage versions;
- works only in a very narrow parameter range;

then it may be historical repair rather than stable structure.

---

## 6. Even lower drawdown may not justify an upgrade

Some candidates do reduce maximum drawdown.

But the cost may be:

- much lower terminal return;
- weaker weekly consistency;
- deterioration in certain years;
- new weaknesses in higher-leverage variants.

So:

> **risk improvement must be evaluated together with its cost.**

A lower drawdown is not automatically better if the price is excessive.

No single metric should decide the upgrade.

---

## 7. I now care more about cross-period non-degradation

Instead of asking:

> how much did the full-history result improve?

I increasingly ask:

> **does the change avoid meaningful degradation across different historical periods?**

That does not mean every phase must improve dramatically.

But I want to avoid a pattern like:

- very strong early improvement;
- clear later deterioration.

A robust change may deliver only a small total improvement.

But if it has:

- consistent direction across periods;
- no material risk deterioration;
- stable neighboring parameters;
- causal validity;
- continued relevance in recent data;

it may be more trustworthy.

---

## 8. "No upgrade" is a valid research result

Research often creates pressure to produce a new version.

That is dangerous.

If the evidence is not strong enough, the correct result can simply be:

> **keep the current version frozen.**

That is not research failure.

It means the process can reject:

- higher historical return;
- prettier drawdown;
- more complex models;
- more exciting backtest numbers.

That ability is important for long-lived systems.

---

## 9. New OOS data is more valuable than endless tuning

Once a strategy version has been studied repeatedly on the same historical sample, the marginal value of further tuning falls.

The next valuable dataset is often not:

> 100 more parameter combinations.

It is:

> new real out-of-sample data.

New data has not been contaminated by prior research decisions.

It can help answer:

- does the current structure remain valid?
- which rejected candidates deserve another look?
- did a new regime reveal a genuine coverage gap?

---

## Final thought

This research reinforced a principle:

> **Quantitative research is not a process of continuously increasing historical return.**

It is closer to:

> proposing improvements and trying as hard as possible to disprove them.

A candidate that survives:

- multi-period analysis;
- parameter-neighborhood checks;
- drawdown analysis;
- monthly/weekly/daily stability;
- causal audits;
- recent-data validation;

has a stronger claim to being:

**Structural Improvement**

Otherwise, it may only be:

**Historical Improvement**

Those should never be treated as the same thing.

---

> This article documents research only and is not investment, trading, or financial advice. Historical backtests do not guarantee future performance.
