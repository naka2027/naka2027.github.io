---
layout: post
lang: en
translation_key: polymarket-bot-binance-twap60-divergence
permalink: /en/articles/polymarket-bot-binance-twap60-divergence/
title: "Polymarket Bot Research: Can Binance–TWAP60 Divergence Predict the Next BTC 5-Minute Direction?"
description: "Using Binance BTCUSDT 1-second data to reconstruct a TWAP60 proxy and study whether spot–TWAP divergence predicts the next Polymarket BTC 5-minute direction."
date: 2026-09-10
author: Naka Research
tags:
  - Polymarket
  - Polymarket Bot
  - BTC 5m
  - Chainlink
  - TWAP60
  - Binance
  - Trading Bot
  - Quant Research
---

If you are researching a **Polymarket bot**, especially a **Polymarket BTC 5-minute Up/Down bot**, there is one problem that is easy to underestimate:

> The BTC price visible on Binance and the TWAP reference state used for settlement are not always perfectly synchronized.

That does not mean one data source is “wrong.”

They describe different layers of the same BTC market:

```text
Binance BTCUSDT
→ immediate state of the traded spot market

Chainlink BTC/USD TWAP 60s
→ time-smoothed settlement reference

Polymarket BTC 5m
→ final Up / Down resolution based on the settlement reference
```

For medium- or long-horizon trading, a small difference may not matter much.

For a five-minute prediction market whose final result is only **Up or Down**, a few basis points may become surprisingly important.

This article records an ongoing research question:

> **Does the divergence between Binance and TWAP60 contain information about the next Polymarket BTC 5-minute settlement direction?**

The research is not finished.

At this stage, the methodology and statistical structure matter more than declaring a “magic threshold.”

---

## 1. Why a Polymarket BTC 5-Minute Bot Cannot Treat Binance Candles as Settlement Data

Traditional BTC quantitative research is convenient.

Binance provides:

- 1-second candles;
- 1-minute candles;
- 5-minute candles;
- volume;
- trade counts;
- order-book and trade data.

If a BTC five-minute market were resolved directly from Binance open and close prices, the research problem would be simple:

```text
Binance Close > Binance Open
→ UP

Binance Close < Binance Open
→ DOWN
```

But Polymarket BTC five-minute markets are not simply Binance BTCUSDT candle labels.

Polymarket now exposes Chainlink-computed 30-second and 60-second TWAP streams through its real-time data infrastructure. The 60-second TWAP is one of the most important settlement-state references for the BTC 5-minute market we are studying.

A **Polymarket trading bot** therefore observes two price states that are strongly related but not identical:

```text
Spot price
vs
TWAP settlement reference
```

For more background on the three-layer relationship between Binance, Chainlink, and Polymarket, see:

[Why Chainlink Makes Polymarket BTC 5-Minute Bots Harder to Research](/en/articles/polymarket-chainlink-btc5m-research-difficulty/)

---

## 2. A Simple but Interesting Observation

Suppose a five-minute boundary ends with:

```text
Binance close = 100,100
TWAP60 close  = 100,000
```

The difference is $100.

Using a fixed dollar difference is not ideal because BTC itself changes price over time.

So the cleaner representation is basis points:

```text
Gap_{bp}
=
\frac{|BinanceClose-TWAPClose|}
{ReferencePrice}
\times 10000
```

where:

```text
1 bp  = 0.01%
5 bp  = 0.05%
10 bp = 0.10%
```

This keeps the scale comparable whether BTC trades at $40,000, $80,000, or $120,000.

The first research question is:

> **As the spot–TWAP gap becomes larger at the current five-minute boundary, does the probability of a direction mismatch in the next five-minute window also increase?**

Formally:

```text
Gap_t
\rightarrow
P(DirectionMismatch_{t+1})
```

---

## 3. Early Result: The Gap Looks More Like a Probability Variable Than a Hard Threshold

The first test used a small continuous historical sample of roughly **3,253 current-bar → next-bar pairs**.

This is important: the test did **not** use a complete historical archive of official Chainlink TWAP values. It used a **TWAP60 proxy reconstructed from Binance 1-second data**.

The result therefore represents a research approximation, not an exact replay of Polymarket settlement.

Even so, one shape appeared clearly:

> **As the current spot–TWAP gap increased, the probability that the next Binance direction and TWAP60-proxy direction disagreed also increased.**

Mismatch did not disappear when the gap was small.

And larger divergence did not make a mismatch certain.

Instead, the relationship looked gradual. In the preliminary sample, the larger-divergence groups produced roughly **2–3 times the baseline mismatch probability**.

That suggests a relationship closer to:

```text
P(Mismatch \mid Gap)
```

than:

```text
Gap > fixed threshold
→ next bar must mismatch
```

This distinction matters.

Turning a continuous probability relationship into a single hard threshold can easily create a parameter that looks good in one sample and fails elsewhere.

For Polymarket bot research, **risk intensity** may be more useful than a binary trigger.

---

## 4. The More Interesting Part: The Gap Has a Direction

Absolute gap tells us how far the two prices are apart.

But the gap also has a sign.

Define:

```text
SignedGap
=
BinanceClose-TWAP60Close
```

If:

```text
SignedGap > 0
```

then:

> Binance is currently above TWAP60.

If:

```text
SignedGap < 0
```

then:

> Binance is currently below TWAP60.

That creates a second research question:

> **When TWAP60 is below spot, is the next TWAP60 bar more likely to move Up?**

And conversely:

> **When TWAP60 is above spot, is the next TWAP60 bar more likely to move Down?**

The preliminary sample shows that this directional relationship does exist.

Using gap direction alone is not especially strong across the whole sample. But as the divergence becomes more pronounced, the next TWAP60-proxy direction becomes increasingly aligned with the direction implied by the gap.

In the larger-gap subsets, that directional tendency rises from near-random territory to **above 70%**.

This is potentially more interesting than simply asking whether Binance and TWAP disagree.

For a Polymarket BTC 5-minute market, the final question is not:

> What direction will Binance print next?

It is closer to:

> **What direction will the settlement-reference TWAP print next?**

---

## 5. Why Spot Above TWAP Can Make the Next TWAP More Likely to Rise

Consider a simplified boundary:

```text
TWAP60 = 100,000
Spot   = 100,100
```

The traded market is already around 100,100, while the recent 60-second average is still near 100,000.

If BTC does not immediately fall back and instead trades near 100,100, the next rolling TWAP will gradually absorb those higher prices.

In simplified form:

```text
older TWAP state
      ↓
100,000

current spot state
      ↓
100,100
```

There is a portion of the latest spot move that has not yet been fully incorporated into the time-smoothed reference.

The same logic works in reverse.

This does **not** mean TWAP must catch up.

Spot can reverse immediately.

So the gap is not a deterministic signal.

But it may describe something useful:

> **How far the current settlement reference is lagging behind the current traded market state.**

---

## 6. Basis Points Alone Are Not Enough

Two markets can have the same spot–TWAP gap and still have completely different price paths.

State A:

```text
steady rise throughout the last 60 seconds
```

State B:

```text
almost flat for 50 seconds
then a sharp move during the final 10 seconds
```

Both can produce a similar TWAP gap.

But they are clearly different market structures.

So the next stage of this **Polymarket bot research** cannot stop at `gap_bp`.

The current dataset also records higher-level short-horizon structure such as:

- 60-second price range;
- net 60-second move;
- path efficiency;
- short-term acceleration;
- gap relative to recent normal volatility;
- gap relative to the recent 60-second range;
- directional relationships between spot, TWAP, and short-term movement.

The point is not to add indicators endlessly.

The real question is:

> **How was the gap created?**

A slow, persistent divergence and a last-second shock may carry very different information even when both end with the same number of basis points.

---

## 7. The Goal Is Not Maximum Coverage — It Is High-Confidence States

This research is gradually becoming a different problem from ordinary next-candle prediction.

We may not need to predict every BTC five-minute bar.

A more useful question could be:

> **Are there rare market states that, once present, make the next TWAP direction statistically much more certain?**

A condition may cover only a small fraction of the full market.

But if it has:

```text
low frequency
+
high long-run precision
+
stability across different years
```

it can still be valuable as a research feature.

That means evaluation cannot focus only on:

```text
Accuracy
```

It also needs:

```text
Precision
Sample Size
Confidence Interval
Year-by-Year Stability
Volatility-Regime Stability
```

A rule that reaches 90% in one month is not very interesting.

A low-frequency state that remains strong across several years and very different BTC regimes is much harder to dismiss.

---

## 8. Reconstructing a TWAP60 Proxy From Binance 1-Second Data

There is a practical data problem:

**multi-year high-frequency Chainlink TWAP60 history is not as easy to obtain in bulk as Binance Kline history.**

So the current project uses a research proxy.

The official Binance Spot API supports `1s` klines:

```text
GET /api/v3/klines
symbol=BTCUSDT
interval=1s
```

For each second, a rolling 60-second average is reconstructed:

```text
TWAP60(t)
\approx
\frac{1}{60}
\sum_{i=0}^{59}Price_{t-i}
```

The rolling values are then aligned to strict UTC five-minute boundaries to create:

```text
TWAP60 Open
TWAP60 High
TWAP60 Low
TWAP60 Close
```

The native Binance five-minute OHLC is retained alongside it:

```text
Binance 5m
vs
Reconstructed TWAP60 5m
```

This creates a continuous research dataset for studying spot–TWAP divergence.

---

## 9. Historical Gaps Must Be Handled Strictly

Second-level BTC history is not guaranteed to contain every second forever.

For this research, missing data cannot simply be handled as:

```text
missing second
→ reuse the previous price
```

The differences under study may be only a few basis points.

Artificially filling a missing section can change:

- TWAP60 close;
- five-minute direction;
- divergence;
- the final research label.

So the reconstruction uses a conservative rule:

> **If any required second is missing from the source window used to build a five-minute TWAP bar, that bar is skipped.**

No interpolation.

No forward fill.

And no shifting later five-minute bars because of an earlier gap.

For high-frequency quantitative research, data integrity is often more important than maximizing the number of retained observations.

---

## 10. This Is Not a Perfect Reconstruction of Chainlink TWAP60

This distinction is critical.

The reconstructed series is:

> **a Binance-based TWAP60 proxy**

It is not an exact historical copy of the official Chainlink BTC/USD TWAP60 feed.

Chainlink uses its own data aggregation and calculation process.

Polymarket documentation explicitly notes that Chainlink does not currently publish the custom TWAP feed's full sampling boundaries, weighting, rounding, or missing-input behavior. An independently calculated rolling average therefore should not be treated as an exact reproduction of the official value.

The current research question is narrower:

> **Does the relationship between immediate spot state and a 60-second time-averaged state contain stable short-horizon structure?**

If that relationship fails across five years of Binance second-level data, there is little reason to force it further.

If it remains stable across years and regimes, the next step is to calibrate and validate the proxy against real Chainlink TWAP60 data.

---

## 11. Why Test Five Years?

A short sample can produce beautiful statistics very easily.

BTC five-minute data is especially vulnerable to this.

A relationship that works in a trending week may disappear during a low-volatility month.

So the research is now being expanded to roughly five years of BTC second-level history.

The pipeline processes data day by day:

```text
fetch Binance BTCUSDT 1s
        ↓
validate second-level continuity
        ↓
reconstruct TWAP60
        ↓
build 5m TWAP OHLC
        ↓
measure spot–TWAP divergence
        ↓
calculate short-horizon structure
        ↓
attach the next TWAP direction
        ↓
append to one continuous research dataset
```

That means processing well over one hundred million one-second price observations.

But the actual question remains simple:

> **Does the relationship survive across different years?**

---

## 12. What This Means for Polymarket Bot Research

Many discussions about a **Polymarket trading bot** eventually return to familiar questions:

- Which indicator should be used?
- What is the win rate?
- Will the next BTC candle go Up or Down?
- What does the backtest look like?

But ultra-short prediction markets introduce another layer:

> **Is the BTC market state seen by the trading venue currently the same as the state seen by the settlement system?**

That may be a more fundamental question.

Binance and Chainlink are not interchangeable data sources.

Binance provides rich information about the traded market.

TWAP provides a time-smoothed settlement reference.

Polymarket eventually compresses that reference into:

```text
UP
or
DOWN
```

When the final label is binary, small differences between data states can become more important than they would be in ordinary spot trading.

---

## Conclusion: Treat Divergence as a Market State, Not Just a Data Error

There is not enough evidence yet to claim that we have found a stable Polymarket BTC five-minute prediction rule.

And a strong number from a small sample is not a reason to move anything into production.

The useful conclusions so far are more limited:

1. **Spot–TWAP divergence does not look like meaningless noise.**
2. **Larger gaps are associated with meaningful changes in next-bar direction behavior.**
3. **The sign of the gap — whether TWAP is above or below spot — may contain more useful information than the absolute distance alone.**

The real test is the five-year validation.

If the relationship only exists for a few days or weeks, it should be discarded.

If it survives different years, volatility environments, and BTC market structures, then:

> **Binance–TWAP divergence may deserve to be treated as an independent market-state variable in Polymarket BTC 5-minute bot research.**

That is the part worth continuing to test.

---

### Related Research

- [Why Chainlink Makes Polymarket BTC 5-Minute Bots Harder to Research](/en/articles/polymarket-chainlink-btc5m-research-difficulty/)

### References

- [Polymarket Documentation — Chainlink TWAP Prices](https://docs.polymarket.com/market-data/chainlink-twap)
- [Binance Spot API — Kline/Candlestick Data](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

> This article is for technical research, education, and informational purposes only. The historical TWAP60 series discussed here is a research proxy reconstructed from Binance second-level data, not official historical Chainlink settlement data. Preliminary statistics do not imply future trading performance.
