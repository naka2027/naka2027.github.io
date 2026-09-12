---
layout: post
title: "Polymarket Bot Five-Year Replay: What Happened After Execution Coverage Expanded Nearly 8×?"
date: 2026-09-12
description: "A nearly five-year replay study of a Polymarket BTC 5-minute trading bot, examining what happened to win rate, drawdown and long-term stability after execution coverage expanded by almost 8×."
tags:
  - Polymarket Bot
  - Polymarket Trading Bot
  - Polymarket Quant Trading
  - BTC 5 Minute
  - Quantitative Trading
  - Backtesting
---

# Polymarket Bot Five-Year Replay: What Happened After Execution Coverage Expanded Nearly 8×?

If a Polymarket bot suddenly executes nearly eight times as many historical trades, what should we look at first?

The obvious answer is:

**More trades.**

But that is not the question that matters most.

The real question is:

> Does the original edge survive when the strategy starts operating across a much wider set of market conditions?

If execution coverage increases 8× while win rate falls, drawdown expands and losing streaks become longer, then the additional coverage may simply be adding lower-quality trades.

That is why the main question in our latest research was not how many more trades the system could take.

It was:

**Did stability deteriorate as coverage expanded?**

The latest code-aligned replay, covering almost five years of BTC 5-minute market history, produced an interesting result.

---

## From roughly 18,000 trades to 146,846

The previous public Polymarket bot replay baseline contained roughly 18,000 executed signals.

Under the latest research direction, the full historical replay now contains:

**146,846 executed trades.**

That is close to an 8× expansion in execution coverage.

But trade count alone means very little.

What matters is that overall win rate remained at:

**63.87%.**

The standardized historical Score reached:

**+109,880**

Average Score per executed trade:

**+0.748**

Maximum drawdown:

**-88**

Longest losing streak:

**9 trades**

In other words, dramatically expanding execution coverage did not obviously dilute the overall directional quality of the system.

That is the part we find much more interesting than the increase in trade count itself.

---

## Expanding coverage can be harder than improving win rate

There is a common pattern in quantitative research.

A strategy can often produce a very high historical win rate if its filters become restrictive enough.

But that result may not be particularly useful.

The signal might appear only a few dozen times per year, or only under one very specific market regime.

The harder question is:

> Can we identify more repeatable trading states without materially reducing the quality of each trade?

That is closer to the problem this research direction is trying to solve.

The goal was not simply:

**“How do we move the win rate from 63% to 65%?”**

The more important question was:

**“How do we expand useful coverage without destroying the stability we already have?”**

In the current five-year historical replay, overall win rate remains in a similar range even after execution coverage increased substantially.

So instead of focusing on a slightly better headline win rate, we looked more closely at something else:

**performance consistency across time.**

---

## Yearly results: no negative year in the replay

The current dataset runs from September 2021 through September 2026.

Across the available historical replay:

- 2021: positive
- 2022: positive
- 2023: positive
- 2024: positive
- 2025: positive
- 2026: positive so far

Annual win rates remain broadly within the 63%–65% range.

The important point is not that one year looks exceptionally strong.

It is that we do not see a single year in which the historical Score collapses into negative territory.

For a long-term Polymarket quantitative trading system, we generally prefer this type of distribution to a strategy that performs extremely well in one year and then fails under a different regime.

---

## Monthly results: all 59 completed calendar months were positive

When we move down from yearly to monthly aggregation, the result becomes even more interesting.

The current replay contains:

**59 completed calendar months.**

All of them were positive.

This does not mean a future negative month cannot happen.

It simply means that within the current nearly five-year historical replay, no completed calendar month ended with a negative standardized Score.

This matters more to us than cumulative Score alone.

A backtest can look excellent overall while most of its gains come from a small number of unusually strong periods.

Monthly stability asks a different question:

> Is the edge concentrated in only a few parts of history?

So far, the replay does not show that type of obvious concentration.

---

## Weekly stability moved one level deeper

Earlier research versions already showed positive performance at the yearly and monthly level, but a small number of negative weeks still existed.

Under the latest research direction, all completed weeks in the current replay remain positive.

We consider this an important change.

The stability horizon has moved from:

**year → month**

down to:

**week.**

For a Polymarket bot participating in BTC 5-minute markets, trade opportunities themselves are not scarce.

The difficult part is maintaining consistent statistical behavior across shorter and shorter time horizons while processing a large number of decisions.

Of course, “all historical weeks were positive” does not mean every future week will be profitable.

It only describes what happened inside the current frozen historical replay.

---

## Daily results: 92.51% of completed trading days were positive

At the daily level, we should not expect every session to finish positive.

The current replay contains:

**1,828 completed trading days.**

Among them:

- Positive days: 1,691
- Negative days: 129
- Flat days: 8

Positive-day ratio:

**92.51%.**

Another result we watch closely is the duration of negative clusters.

The longest sequence of negative trading days was:

**2 days.**

There was no three-day consecutive negative sequence in the historical replay.

That does not mean daily volatility disappeared.

There were still clearly negative individual days.

But so far those negative sessions appear more as isolated events than as long, persistent negative regimes.

For us, that distinction matters.

---

## Has recent performance deteriorated?

A strong long-term backtest does not automatically mean the strategy is still behaving well near the present.

So we also looked at multiple recent windows.

The last 365 days, 180 days, 90 days, 30 days, 14 days and 7 completed trading days all remain positive under the standardized replay metric.

The most recent 30 completed trading days were:

**29 positive, 1 negative.**

The most recent 14 completed trading days:

**all positive.**

The most recent 7 completed trading days:

**all positive.**

Win rate over the latest 365-day window was approximately:

**64.54%.**

Over the latest 90 days:

**65.55%.**

At least within the current historical dataset, we do not see an obvious collapse in performance as the replay approaches the present.

But this is still historical replay.

The real test now has to come from forward observation.

---

## Why we care more about stability than a few extra Score points

Quantitative research has an easy trap.

Keep searching for rules that increase historical total performance.

Add 100 points here.

Another 200 there.

Eventually the backtest becomes prettier and prettier.

That is also exactly how overfitting can begin.

So the latest research direction was not evaluated only by total Score.

We paid more attention to questions such as:

- Does performance remain consistent across years?
- Does it remain consistent across months?
- Are there obvious weak weekly regimes?
- Do negative days cluster together?
- Has maximum drawdown materially worsened?
- Have losing streaks become longer?
- Do recent windows diverge sharply from the full historical sample?

In other words:

**The goal is not simply to make the backtest earn more.**

The goal is for a wider strategy to continue behaving like the same stable system.

Those are not the same thing.

---

## More trades do not automatically mean a better bot

There is another number in this replay that is easy to overlook.

Out of more than 526,000 historical market events, only about 27.9% resulted in an executed trade.

That means the system still spends most of its time choosing:

**NO TRADE.**

So moving from roughly 18,000 historical trades to more than 146,000 does not mean the Polymarket bot started trading everything.

NO TRADE remains an important part of the decision process.

The goal of a Polymarket trading bot should not be to maximize activity.

A better goal is:

> Identify useful opportunities across more market conditions while still rejecting a large number of low-quality situations.

Those are very different ideas.

---

## Does this prove the strategy works?

No.

This is still a historical replay.

The standardized Score used here is a research metric. It is not actual account PnL in pUSD.

The replay does not fully simulate:

- real CLOB execution prices;
- order book depth;
- partial fills;
- slippage;
- fees;
- network latency;
- real account performance under dynamic position sizing.

The historical dataset has also been used during the research process.

It should therefore not be described as a completely untouched five-year blind test.

That distinction matters.

What we can say is:

**The current production-aligned logic shows strong historical stability across an almost five-year sequential replay.**

What we cannot say is:

**Future results will necessarily look the same.**

---

## The more important phase starts now

If we look only at the historical data, this may be one of the largest changes in the Polymarket bot research so far.

Not because one metric suddenly became dramatically better.

But because:

**execution coverage expanded to almost 8× the previous level while long-term stability did not deteriorate with it.**

Yearly: positive.

Monthly: positive.

Weekly: positive.

Daily: more than 92% positive.

But in quantitative research, the most important question is never:

> How good does the historical replay look now?

The better question is:

> What happens after we stop modifying the rules?

That is why the next step is not necessarily to keep searching for more historical improvements.

It is to freeze the current logic.

Deploy it.

And observe new data.

If future unseen observations continue to resemble the historical structure, then this change becomes much more meaningful.

---

## Conclusion

The longer we work on automated Polymarket trading, the more we think a good trading bot needs to solve three separate problems:

1. **Find useful trading opportunities.**
2. **Expand those opportunities into sufficient coverage.**
3. **Preserve long-term stability after coverage expands.**

The first problem is difficult.

The second is harder.

The third may be the one that ultimately determines whether a quantitative trading system can survive for the long run.

The current nearly five-year historical replay does not prove that this problem has been solved.

It only suggests that we may be moving in the right direction.

Now the new data gets to answer the rest.

---

*This article documents quantitative research and historical replay results for a Polymarket trading bot. It is not investment advice and does not represent a guarantee of future returns. Standardized Score is not the same as actual account profit.*
