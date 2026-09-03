---
layout: post
lang: en
translation_key: polymarket-bot-replay-production-validation
permalink: /en/articles/polymarket-bot-replay-production-validation/
title: "A Good Backtest Is Not Enough: Why Production Code Must Reproduce It Trade by Trade"
description: "Matching total PnL is not enough for a Polymarket trading bot. This article explains why we validate per-event timing, direction, STOP decisions, state, and unchanged historical regions."
date: 2026-08-22
author: Naka Research
tags:
  - Polymarket Trading Bot
  - Backtesting
  - Validation
  - Production
---

Suppose a research script produces:

```text
total score +1000
```

Then the production replay also produces:

```text
total score +1000
```

Does that prove the implementation is correct?

No.

Two wrong decisions can cancel each other out.

For example:

```text
research:   A wins, B loses
production: A loses, B wins
```

The total can match while the strategy is no longer the same strategy.

That is why our Polymarket bot validation does not stop at aggregate results. We care about **event-level equivalence**.

---

## Research code and production code are different systems

Research software is usually optimized for fast experimentation, batch statistics, easy slicing, and candidate comparison.

Production software has different requirements:

- live state maintenance;
- fault handling;
- order tracking;
- persistence;
- recovery;
- concurrency;
- deterministic rule priority.

Even when both are supposed to implement “the same strategy,” the code paths may be structurally different.

That creates a practical risk:

> **Research validates A, but production quietly runs A'.**

Nothing needs to crash for that drift to exist.

---

## “Almost the same definition” is dangerous

Imagine two features both described informally as:

> “the number of direction switches in a recent window.”

A research script may already have one field with a similar name.

It is tempting to reuse it.

But small semantic differences matter:

- candle open-to-close direction vs close-to-close direction;
- one extra boundary transition;
- different treatment of flat candles;
- different continuity requirements.

Those are not the same feature.

An aggregate score may not expose the mistake because only a small number of boundary events change.

But those events may determine:

```text
KEEP / ADJUST / STOP
```

for exactly the cases the new rule was designed to handle.

---

## So validation cannot stop at final PnL

Our public methodology describes acceptance checks including:

- signal time;
- target window;
- source;
- base direction;
- post-signal action;
- final direction;
- STOP outcome;
- result;
- data continuity;
- per-event equivalence across unchanged history.

The last item is especially important.

If I change one narrow rule, I need to verify two things:

> The intended events changed correctly.

and:

> **The large set of unrelated events did not change accidentally.**

---

## A public example: 4,098 previously accepted signals

One public incremental refresh included **4,098 previously accepted signals** from October 1, 2025 through the prior cutoff.

When the data were refreshed, we checked the time index and key decision fields against the already accepted history.

They matched.

Long-state numeric differences were limited to floating-point precision and did not change any event-level decision.

That check added no new “profit.”

It answered a more important question:

> **Did we update the data, or did we accidentally rewrite historical strategy behavior?**

---

## Matching totals can hide priority bugs

Consider a new rule intended to do:

```text
specific condition → STOP
```

If production inserts it at the wrong priority, an older rule may handle those events first.

The new rule technically exists.

It may never actually execute.

The reverse can happen too: a new rule is inserted too early and starts overriding older behavior.

That is why rule validation has to include:

- insertion point;
- scope;
- events expected to change;
- events that must not change.

---

## Why production replay matters

If research and production maintain two independent implementations, eventually you get:

```text
research truth
vs
production truth
```

Which one is the strategy?

I prefer to replay historical data through production-side logic wherever possible.

That removes one major ambiguity:

> “Is the code we ship actually the code represented by the backtest?”

It does not solve every problem.

It does reduce research/implementation drift.

---

## Event-level replay still is not live execution

There is another boundary.

Historical replay of production decision code can show that:

> production logic reproduces the intended historical decisions.

It cannot prove that:

> live orders will fill at the same price and size.

Polymarket execution includes:

- order-book state;
- fees;
- latency;
- GTC / GTD / FOK / FAK behavior;
- partial fills;
- cancellation;
- API state.

The official order lifecycle is a state machine, not a single instantaneous `buy()` call.

So I separate:

```text
strategy equivalence
```

from:

```text
execution equivalence
```

Both matter.

---

## Three layers of strategy acceptance

At a high level, I think about upgrades in three stages.

### 1. Research acceptance

Does the idea have enough evidence?

### 2. Code acceptance

Does production code reproduce the intended logic event by event?

### 3. Runtime acceptance

Do real data, orders, and state behave correctly in the live environment?

A strong idea can fail at any of these boundaries.

---

## Why this detail is worth writing about

From the outside, a Polymarket trading bot looks like:

```text
data
↓
signal
↓
order
```

In long-running research, some of the hardest questions are smaller:

> Are these two definitions really equivalent?

> Did one new rule silently change unrelated historical events?

> Did matching totals hide offsetting errors?

> Did research and production drift apart?

Those details do not produce the flashiest screenshots.

They determine whether you are backtesting the actual production strategy—or a strategy you only think production is running.

---

Public methodology:

[Polymarket BTC 5m Public Backtest Report](https://github.com/naka2027/polymarket-bot/blob/main/BACKTEST_EN.md)

Official execution references:

- [Polymarket Order Lifecycle](https://docs.polymarket.com/concepts/order-lifecycle)
- [Polymarket User WebSocket Channel](https://docs.polymarket.com/api-reference/wss/user)

Related:

- [No Look-Ahead Isn't Enough: The Other Side of Polymarket Bot Overfitting](/en/articles/polymarket-bot-backtest-overfitting/)
- [Polymarket Bot Backtesting: What Does a 63.75% Win Rate Actually Mean?](/en/articles/polymarket-bot-backtest-win-rate/)

> This article discusses validation methodology. It does not disclose internal formulas, parameters, rule priorities, or strategy-replicating code.
