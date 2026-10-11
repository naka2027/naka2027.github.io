---
layout: post
lang: en
translation_key: how-to-evaluate-trading-bot-upgrade
permalink: /en/articles/how-to-evaluate-trading-bot-upgrade/
title: How Do You Know a Trading Bot Upgrade Is Actually Better?
description: 'A same-context BTC 5-minute replay shows why win rate alone cannot validate a bot upgrade: evaluate score, drawdown, time distribution, code
  consistency, and out-of-sample limits.'
date: 2026-10-11
author: Naka Research
tags:
- Polymarket Bot
- Backtesting
- Research Validation
- BTC 5m
---

A bot's historical win rate rises from roughly 66% to 67% after an update. Is the new version better?

That question sounds simple, but **a higher win rate is a result, not a complete evaluation**. It might come with fewer trades, a different sample, higher transaction costs, or a more fragile path through adverse market conditions.

Our latest code-level historical replay of a BTC five-minute automation system provides a useful example. Versions v2.0 and v2.4 were evaluated against **the same 18,920 eligible strategy contexts**, allowing a more meaningful comparison than two unrelated headline backtests.

## Start with a same-context comparison

| Metric | v2.0 | v2.4 |
| --- | ---: | ---: |
| Historical executed decisions | 14,742 | 15,361 |
| Win rate | 66.531% | 67.313% |
| Standardized total score | +14,562 | +16,255 |
| Expected standardized score per order | +0.988 | +1.058 |
| Maximum standardized drawdown | -58 | -52 |
| Longest losing streak | 8 | 8 |

The research score uses a deliberately fixed scheme: **+4 for a correct direction, -5 for an incorrect direction, and 0 for no trade**. These are standardized research points—not dollars, not a realized account return, and not a complete model of actual execution costs.

On this basis, v2.4 executed 619 more decisions, raised the win rate by approximately 0.782 percentage points, and increased the standardized score by roughly 11.63%. The combination is more informative than any one number.

## 1. Were the two versions tested on the same opportunities?

A fair comparison starts before calculating performance.

Suppose the earlier version uses data ending in 2025 while the new one includes part of 2026. Or the new pipeline changes which markets count, how the outcome is labeled, or which observations are considered valid. Some apparent performance improvement may simply reflect **a change in the evaluation population**.

In this comparison, the set of 18,920 eligible decision contexts was held fixed. Each version could then be checked at the same target window. Importantly, 18,920 means eligible strategy contexts, **not every five-minute candle that occurred during the historical period**.

## 2. Did the quality of returns and the risk path change together?

Increasing participation can raise an aggregate score while adding risk. Improving win rate can still hurt expectancy if the economics of winning and losing differ.

For that reason, I look at expected score per decision, the profit factor under the same scoring scheme, and drawdown from a previous cumulative peak—not just the final score.

In this replay, expectancy and profit factor improved, while maximum standardized drawdown went from -58 to -52. Yet the longest losing streak remained eight, and not every individual year's drawdown improved. Those unchanged or weaker details deserve space alongside the favorable numbers.

A credible upgrade report should show **what did not improve** as carefully as what did.

## 3. Was the improvement spread across time?

A five-year headline can conceal an improvement concentrated in one short market regime.

Here, each of the six calendar-year segments showed a positive version-to-version score difference. The 2021 and 2026 segments are partial years. More importantly, the most recent seven-day replay window produced only +2 standardized points for v2.4, and the historical path had not fully recovered its most recent drawdown by the cutoff.

**Better aggregate history and a weak recent interval are not contradictory.** Both belong in the evaluation.

## 4. Does the production decision logic reproduce the research?

A research notebook's total score does not establish that deployed decision code produces the same actions.

The implementation should be checked for consistent inputs, deterministic decision boundaries, one-to-one target windows, outcome labels, and independent scoring. Skipped decisions need observable reasons too.

The v2.4 code-side replay reported no mismatches in its recorded decision and scoring consistency checks. This supports **implementation consistency within the tested replay conditions**. It does not establish that future orders will fill at assumed prices or produce live returns.

## 5. What remains untested?

The central limitation is easy to miss: these version choices came from the same ongoing historical research program.

Even favorable results across multiple years cannot remove the selection effects of repeated study and iteration. New, genuinely forward observations that did not influence the research process remain essential.

So I would not describe the comparison as proof of sustainable live profitability. The defensible conclusion is narrower: **under a fixed, historical, code-level evaluation, v2.4 improved several quality and stability measures together and merits continued forward monitoring**.

When judging any trading-bot upgrade, ask six questions: Was the sample identical? Did expectancy improve? What happened to drawdown? Where did the gains occur in time? Did production code reproduce the study? And what evidence is still missing?

---

*Research snapshot: October 11, 2026. All scores are standardized historical replay points, not realized trading profits or investment advice.*

Further reading: [Backtest Overfitting](/en/articles/polymarket-bot-backtest-overfitting/) · [Production-Code Replay Validation](/en/articles/polymarket-bot-replay-production-validation/) · [Win Rate and Entry Price](/en/articles/polymarket-bot-win-rate-entry-price-expected-value/)
