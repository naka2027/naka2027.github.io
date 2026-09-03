---
layout: post
lang: en
translation_key: why-we-rejected-a-polymarket-bot-rule
permalink: /en/articles/why-we-rejected-a-polymarket-bot-rule/
title: "A New Rule Looked Great Recently. Why I Still Rejected It."
description: "One of the most dangerous moments in Polymarket bot research is when a new rule perfectly fixes recent losses. This is how we test whether a candidate is real—or just a clean explanation of known history."
date: 2026-08-25
author: Naka Research
tags:
  - Polymarket Strategy
  - Overfitting
  - Risk
  - Research
---

When recent performance weakens, the easiest research move is:

> Open the losing cases, find a shared pattern, and add a rule that filters them out.

That will almost always improve the recent backtest.

That is exactly why it is dangerous.

We recently investigated a candidate like this.

It was not shipped.

The reason it died is more interesting than the rule itself.

---

## How it started

Short-horizon strategies will have weak periods.

You may see lower win rate, a denser losing streak, or one candidate family performing worse than usual.

That does not automatically mean the strategy needs a new rule.

But once a researcher sees a cluster of losses, the natural question is:

> What did these losing cases have in common?

Given enough data, you will find something.

Regime, volatility, directional persistence, local trade structure—large datasets are full of patterns that look meaningful after the outcome is known.

The important question is not whether a pattern can be found.

It is:

> **Would the pattern still matter if we did not already know which trades lost?**

---

## Step one: turn “fix recent losses” into a falsifiable hypothesis

We did not define the task as:

> Find a filter that improves the recent window.

We reframed it as:

> Does this recent weakness represent a market condition that also appears repeatedly in earlier history and can be identified consistently?

Those are very different objectives.

The first chases visible losses.

The second requires evidence outside the local problem that inspired the idea.

---

## Step two: recent improvement is not an acceptance criterion

A new candidate can look excellent in the local window.

That proves only:

> It explains the sample we already inspected.

The next questions are harder:

- Does the same phenomenon exist in earlier history?
- Does it appear across multiple years?
- Is the improvement concentrated in a tiny number of events?
- What happens to full-strategy drawdown?
- What happens to the longest losing streak?
- Does the worst week or month improve?
- Does the effect survive small parameter changes?
- If selection is restricted to past data, does the result still hold?

If those answers are weak, a beautiful recent chart is not enough.

---

## Step three: a local rule can damage the whole system

This is easy to miss in a layered strategy.

A candidate may look excellent on the small set of events it directly affects.

But once added to the full strategy it may change:

- which trades execute;
- which trades become STOP;
- how dependent state evolves afterward;
- internal priority interactions;
- the strategy's chronological path.

So we cannot validate only:

```text
candidate events
before vs after
```

We also need:

```text
full strategy
before vs after
```

The second comparison matters more.

---

## Step four: inspect drawdown and losing streaks, not just delta

When a new filter adds historical score, confirmation bias arrives quickly.

But if the same rule also makes maximum drawdown worse, losing streaks longer, or certain years more fragile, I do not consider it an obvious upgrade.

Stable quantitative systems are often built by refusing to trade a little bit of average improvement for a worse tail.

---

## Step five: ask whether the recent data invented the idea

This is the uncomfortable part.

Even if you exclude the last few days from threshold selection, you still need to ask:

> Why did we decide to investigate this feature family?

If the answer is:

> Because we just saw those recent losses,

then the recent sample has already influenced the research direction.

That does not automatically invalidate the candidate.

It does mean the “recent holdout” is not as independent as it looks.

This is why I separate:

```text
the final days were not used to tune the threshold
```

from:

```text
the final days did not influence the hypothesis
```

Those are different claims.

---

## The final decision: do not ship

This candidate did not pass our broader acceptance criteria around full-strategy drawdown, losing streaks, and historical selection robustness.

So the conclusion was simple:

> **Do not ship it.**

We did not continue moving thresholds until it passed.

That may be one of the hardest habits in quantitative research:

> **Let an idea die when it is almost good enough.**

With one more condition, one more threshold, or one more lookback adjustment, history can almost always be made prettier.

At some point you have to ask whether you are still studying the market—or studying the dataset.

---

## Why publish a failed idea?

If a research blog only says:

- new rule shipped;
- win rate improved;
- drawdown improved;
- another edge discovered;

it becomes difficult to distinguish research from product marketing.

Real research should contain both:

```text
discover
test
keep
```

and:

```text
discover
test
reject
```

A rejected rule demonstrates something important:

> The objective is not to make every backtest revision look better.

The objective is to improve our understanding of where the strategy may or may not generalize.

---

## Why this article does not reveal the rule

You will not find the exact formula, internal signal branch, historical lookback, thresholds, trigger boundaries, or per-event data that would reconstruct the strategy.

Those details are strategy IP.

What I can publish is the research process:

> how a candidate went from “this looks useful recently” to “this does not deserve production.”

I think that is more useful than publishing a parameter sheet.

---

## The research question I prefer now

A tempting question is:

> How much can this rule improve the backtest?

A better question is:

> **If this rule is false, what is the fastest credible way to kill it?**

Those questions create very different research cultures.

One accumulates rules.

The other removes rules that do not have enough evidence.

For a Polymarket bot expected to run continuously, I prefer the second.

---

Related:

- [No Look-Ahead Isn't Enough: The Other Side of Polymarket Bot Overfitting](/en/articles/polymarket-bot-backtest-overfitting/)
- [Why a Polymarket Trading Bot Must Learn Not to Trade](/en/articles/why-polymarket-bot-needs-no-trade/)
- [A Good Backtest Is Not Enough: Why Production Code Must Reproduce It Trade by Trade](/en/articles/polymarket-bot-replay-production-validation/)

Project:

[Polymarket BTC 5m Bot](https://github.com/naka2027/polymarket-bot)

> This article discusses research methodology and high-level system logic only. It does not disclose strategy formulas, thresholds, lookback windows, internal rule mappings, or parameters that would reproduce the strategy.
