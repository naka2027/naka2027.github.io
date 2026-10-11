---
layout: post
lang: en
translation_key: positive-months-weak-recent-week
permalink: /en/articles/positive-months-weak-recent-week/
title: '64 Positive Monthly Scores, Yet a Weak Recent Week: How to Read Both'
description: All 64 historical calendar-month segments scored positively, yet the recent seven-day window was weak. A guide to aggregation, rolling windows,
  drawdown, and forward validation.
date: 2026-10-11
author: Naka Research
tags:
- Backtesting
- Stability
- Market Regimes
- BTC 5m
---

“All 64 calendar-month segments in the historical replay had positive standardized scores.”

As a standalone graphic, that sounds reassuring.

But in the same BTC five-minute replay, the newest **seven-day window scored only +2 standardized points**, and the cumulative path had not yet returned to its most recent peak.

Both statements can be accurate. Why do they convey such different impressions?

## What does a positive month actually establish?

The latest historical run spans **64 calendar-month segments** from July 2021 to October 2026. Each segment produced a positive score under a fixed research convention.

Three qualifications are essential:

1. The calendar-year segments for 2021 and 2026 are incomplete; October 2026 itself was still in progress at the cutoff.
2. “Positive” refers to a standardized historical directional score of **+4 for a correct decision and -5 for an incorrect one**, not actual monthly account profits.
3. A positive calendar month does not imply that every week, day, or drawdown interval inside it was positive.

Without those distinctions, a research statistic starts to look like an audited live-performance claim—which it is not.

## Aggregation can hide the path

Imagine four consecutive intervals in a month:

```text
Interval 1   +40
Interval 2   -25
Interval 3   -10
Interval 4    +5
Total        +10
```

The month finishes positive. Yet its middle could contain a long unfavorable period and a meaningful peak-to-trough decline.

Monthly totals are useful for describing one calendar partition. They are not a complete account of path risk.

That is why I want to read monthly results alongside calendar weeks, days, **rolling windows**, and cumulative drawdown.

## Why examine rolling seven-day windows?

A calendar week is cut at a fixed boundary. If a difficult period begins near the end of one week and continues into the next, the loss cluster may be split between two reports.

A rolling seven-day window looks backward across a fixed duration from each available cutoff. It can reveal adverse clusters that do not line up neatly with Monday-to-Sunday reporting.

In the same-context version comparison, the number of negative rolling seven-day windows fell from 108 to 69. The worst rolling seven-day score improved from -44 to -34. For complete rolling 30-day windows, the minimum standardized score improved from +11 to +48.

Those are useful distributional observations, but beware of false sample counts: **adjacent rolling windows share most of their observations**. Sixty-nine negative windows are not sixty-nine independent shocks.

## Why the most recent week still matters

For v2.4, the latest one-day window scored +24, the latest seven-day window +2, and the latest 30-day window +147 standardized points.

These are different views of the same recent period. Selecting the most flattering one does not provide a fuller explanation.

At the replay cutoff, the cumulative path remained **14 points below a recent peak**. During that drawdown episode it had been as far as **45 points below the peak**. The recovery was meaningful but incomplete.

This is a reason to keep monitoring, not enough information to label the whole system permanently successful or broken. A better question is how weak intervals are distributed, how long they persist, and whether genuinely new observations support or challenge the current explanation.

## Historical stability is not forward validation

Calendar segmentation makes historical analysis more informative, but it does not create untouched data. When a strategy has been developed through repeated examinations of the same history, selection effects remain possible even if every annual or monthly segment looks favorable.

New forward observations should therefore be separated from the data used to make the research decisions. Actual fills, fees, market-data quality, and operational exceptions also belong in a separate economic evaluation.

So both facts deserve a place in the report: **64 historically positive standardized month segments, and a weak most recent seven-day interval**.

A credible researcher should be comfortable displaying both.

---

*Snapshot: October 11, 2026. “Positive month” means positive standardized historical score, not realized live monthly profit. Rolling windows are overlapping observations.*

Further reading: [Why 61 Positive Scores Aren't 61 Profitable Months](/en/articles/polymarket-bot-monthly-stability/) · [Strategy Stability](/en/articles/polymarket-btc5m-bot-strategy-stability/) · [Small-Sample Validation](/en/articles/polymarket-bot-small-sample-five-year-validation/)
