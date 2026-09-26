---
layout: post
lang: en
translation_key: why-i-abandoned-smooth-risk-control
permalink: /en/articles/why-i-abandoned-smooth-risk-control/
title: "Why I Abandoned a Risk-Control Method That Made the Equity Curve Smoother"
description: "A smooth leverage-reduction method reduced drawdowns in BTC futures research, but it was ultimately rejected because it did not distinguish trade quality."
date: 2026-09-26
author: Naka Research
tags:
  - BTC
  - Risk Management
  - Leverage
  - Quant Trading
  - Futures
  - Backtesting
---

# Why I Abandoned a Risk-Control Method That Made the Equity Curve Smoother

There is one kind of backtest result that is very easy to like:

> A smoother equity curve and a visibly lower drawdown.

It sounds almost impossible to reject.

But in a recent BTC futures research cycle, I did reject a smooth de-risking method that significantly reduced high-leverage drawdowns.

Not because it failed.

In fact:

> **It worked.**

The problem was:

> **It solved the problem in a way I did not ultimately want.**

---

## 1. The original idea was intuitive

For higher-leverage versions, a natural approach is:

> If the account starts performing poorly, gradually reduce extra leverage.  
> If performance recovers, slowly restore exposure.

The benefits are obvious:

- shallower drawdowns;
- lower risk during loss streaks;
- a smoother equity curve;
- less time spent at extreme leverage.

From a pure risk-statistics perspective, it worked.

---

## 2. But it had a structural weakness

Smooth protection reacts mainly to:

> what recently happened to the account.

For example:

- recent losses;
- current drawdown;
- worsening account state.

That matters.

But it does not directly answer another question:

> **Does the current trade itself deserve additional risk?**

The result can become:

> recent performance is bad → reduce everything.

That suppresses:

- weak opportunities;
- normal opportunities;
- and potentially the strongest opportunities as well.

It does not actually distinguish trade quality.

---

## 3. Smooth does not necessarily mean smarter

This was the most interesting lesson.

Risk-control research can easily become focused on:

> "Make the curve smoother."

But there is a trivial way to do that:

> always trade smaller.

If leverage is reduced from 10x to 2x, many drawdown metrics will improve.

That does not mean the system became more intelligent.

It simply took less risk.

So the real question should not be:

> Can drawdown be lower?

It should be:

> **Can risk be concentrated on trades that actually justify it, without indiscriminately suppressing the whole system?**

---

## 4. The later direction: trade quality + hard account protection

The next research step separated the problem into two layers.

### Layer 1: the trade itself

Only trades that meet stronger pre-entry conditions are allowed to receive extra risk.

This does not necessarily change whether the trade is taken.

It changes:

> **how much risk the same trade deserves.**

### Layer 2: account state

Account-level protection still exists.

But instead of continuously smoothing every trade, it behaves more like a low-frequency hard brake:

> when the account state deteriorates enough, cap the allowed risk.

Now the responsibilities are separate:

- trade quality decides eligibility for extra risk;
- account state decides whether the system is currently allowed to take that risk.

---

## 5. Why is this structure easier to reason about?

Because each layer answers a clear question.

Smooth de-risking blends everything together:

> the account has been weak, so reduce this trade.

The new structure asks separately:

> How strong is this trade?  
> Is the current account state healthy enough to allow higher exposure?

That matters for research.

If performance later deteriorates, it becomes easier to diagnose:

- did the trade-quality layer fail?
- did the account protection react too late?
- was the leverage ceiling itself too high?

Instead of hiding all behavior inside one continuous weighting function.

---

## 6. More complex models were not automatically better

I also tested more complex causal models for deciding when extra leverage should be allowed.

Some looked better in local historical windows.

But once I required:

- training only on information available at the time;
- cross-period validation;
- simultaneous return and drawdown improvement;
- no dependence on one historical regime;

the more complex models did not consistently beat the simpler structure.

That reinforced another principle:

> **More complex does not automatically mean more robust.**

If a simpler rule captures the main relationship, there may be no reason to add complexity just to gain a few attractive historical metrics.

---

## 7. Risk control is not "minimize drawdown at all costs"

This research also changed how I think about risk control.

Risk control is not:

> minimize every fluctuation.

The easiest way to do that is to stop trading.

A more useful goal is:

> **preserve productive risk exposure while limiting tail risk that does not need to be taken.**

That means balancing two extremes:

- ignoring risk in pursuit of return;
- suppressing every opportunity just to make the curve look smooth.

---

## 8. Why stop optimizing the smooth-protection version?

Because further optimization would likely become:

> finding an even prettier leverage-decay curve.

The question I cared about more was:

> **When is extra risk itself justified?**

Those are different research problems.

The first is:

**Account Smoothing**

The second is closer to:

**Risk Allocation**

For a long-lived trading system, the second feels more important.

---

## Final thought

This research changed how I interpret the word "smooth."

Smooth is good.

But:

> **a smoother equity curve does not necessarily come from better decisions.**

It may simply come from lower exposure.

A more useful risk-control framework should try to preserve:

- the core strategy;
- normal opportunities;
- higher risk only where justified;
- hard protection when the account deteriorates;
- strict causal decision-making.

That is much harder than simply smoothing the leverage curve.

And, in my view, much more interesting.

---

> This article documents quantitative research only and is not investment, trading, or financial advice. Historical results do not guarantee future performance.
