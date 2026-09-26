---
layout: post
lang: en
translation_key: high-leverage-is-not-just-multiplication
permalink: /en/articles/high-leverage-is-not-just-multiplication/
title: "High Leverage Is Not Just Multiplying Position Size by 10"
description: "Why 10x or 20x in a BTC futures system should be treated as a leverage ceiling rather than a fixed setting, and how trade quality, account state, and path risk interact."
date: 2026-09-26
author: Naka Research
tags:
  - BTC
  - Futures
  - Leverage
  - Risk Management
  - Quant Trading
  - Automated Trading
---

# High Leverage Is Not Just Multiplying Position Size by 10

When a trading system says:

**5x / 10x / 20x**

the obvious interpretation is:

> 5x means every trade uses 5x.  
> 20x means every trade uses 20x.

For a system with account protection and dynamic risk control, that is not the right interpretation.

A more useful definition is:

> **10x or 20x is the maximum allowed leverage, not necessarily the leverage used on every trade.**

That difference matters a lot.

---

## 1. Leverage does not create edge

The first principle is simple:

> Leverage does not create trading edge.

If the underlying strategy has no edge, leverage only magnifies the problem.

Leverage amplifies:

- profits;
- losses;
- drawdowns;
- path dependence;
- the speed at which mistakes become unrecoverable.

So before studying higher leverage, the more important question is:

> Is the underlying trading logic stable enough?

---

## 2. Maximum leverage is not actual leverage

Suppose a system allows up to 10x.

Individual trades may still use:

- something near the cap in favorable states;
- lower leverage for ordinary trades;
- reduced leverage after consecutive losses;
- reduced leverage during account drawdown;
- gradually restored risk after recovery.

So:

> **A 10x configuration means the system is allowed to use 10x when conditions justify it.**

It does not mean:

> every trade must use full 10x.

This is why the configured leverage number alone is not very informative.

More useful metrics include:

- average effective leverage;
- leverage distribution;
- which states receive extra leverage;
- leverage during drawdowns;
- whether exposure contracts after losses.

---

## 3. Why smooth de-risking is not always optimal

One obvious idea for high-leverage protection is:

> When recent performance gets worse, reduce leverage smoothly. When performance recovers, restore it gradually.

This can produce a smoother equity curve.

But it has a weakness:

> It reacts mainly to what the account recently experienced, not to whether the current trade itself deserves extra risk.

That can lead to:

- good opportunities being globally down-weighted;
- lower risk but also lower return;
- a smoother system simply because it became more conservative.

A better direction, in my research, was:

> **keep the core risk structure stable and allow extra leverage only when the current trade state justifies it.**

That is very different from simply saying:

> "We lost recently, so reduce everything."

---

## 4. Risk control has two dimensions

I now think leverage control is cleaner when separated into two questions.

### Dimension 1: Trade quality

Ask:

> Does this trade deserve additional risk?

This should depend only on information known before the trade.

### Dimension 2: Account state

Ask:

> Even if the trade looks strong, should the account currently allow high exposure?

Relevant states include:

- consecutive losses;
- elevated drawdown;
- protection mode.

The final effective leverage comes from both dimensions.

---

## 5. Why 20x is not just a more aggressive 10x

Mathematically, 20x may look like twice 10x.

Risk does not scale that cleanly.

At higher leverage:

- abnormal slippage matters more;
- gaps matter more;
- liquidation distance becomes smaller;
- failed protection has less tolerance;
- a short loss sequence can rapidly change the account state.

So:

> **The real problem with high leverage is not average return. It is tail-path risk.**

A backtest that never reaches zero does not prove that live trading is safe.

---

## 6. Why average effective leverage matters more

If a system configured with a 20x cap spends most of its life around 8x or 10x effective leverage, then the more accurate description is:

> **a dynamic-leverage system with a 20x ceiling**

not:

> a fixed 20x strategy.

This reveals how the system actually behaves:

- high leverage is rare;
- ordinary states use less risk;
- deteriorating account states reduce exposure;
- risk protection has higher priority than maximizing nominal return.

---

## 7. Theoretical compounding can be dangerously misleading

One of the most misleading outputs in high-leverage research is theoretical terminal equity.

If a long-horizon backtest has positive average edge, leverage can quickly produce enormous compounded numbers.

That does not mean:

> a real account can scale the same way indefinitely.

Real trading includes:

- liquidity;
- slippage;
- fees;
- funding;
- market capacity;
- minimum order constraints;
- exchange risk controls;
- liquidation;
- capital withdrawals;
- operational limits.

So high-leverage research should focus more on:

> **whether the system remains controllable under stress**

than on how many zeros appear in the final balance.

---

## 8. What should leverage research measure?

I now care more about:

- maximum closed drawdown;
- maximum intratrade drawdown;
- exposure contraction during loss streaks;
- average effective leverage;
- share of trades using high leverage;
- year-by-year risk consistency;
- cost-stress resilience;
- behavior during extreme moves.

These tell me more than whether the configured cap is 10x or 20x.

---

## 9. Why the low-leverage baseline matters

One of the biggest mistakes in high-leverage research is damaging a stable low-leverage core while optimizing the 10x or 20x versions.

A useful principle is:

> **High-leverage research should not break the lower-risk baseline.**

If the extra-leverage layer fails, the underlying system should still preserve its original structure.

That turns the problem into:

> adding risk budget on top of a stable core

instead of:

> rewriting the strategy just to maximize leveraged backtest returns.

---

## Final thought

The real question in high-leverage research is not:

> "Can 20x make more money?"

It is:

> **Which trades deserve more risk, when should the account allow that risk, and can the system reduce exposure fast enough when conditions deteriorate?**

So I increasingly think of 5x / 10x / 20x as:

**Risk Ceilings**

not:

**Fixed Leverage**

A mature high-leverage system should not always use high leverage.

In fact:

> **its most important skill may be knowing when not to.**

---

> This article documents quantitative research only and is not investment, trading, or financial advice. Leveraged trading is extremely risky, and historical replay does not guarantee future performance.
