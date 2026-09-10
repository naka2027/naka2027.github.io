---
layout: post
lang: en
translation_key: polymarket-btc5m-twap60-proxy-validation
permalink: /en/articles/polymarket-btc5m-twap60-proxy-validation/
title: "Polymarket BTC 5m Research: Can a Binance-Derived TWAP60 Be Reliable Enough for Historical Research?"
description: "A real-data calibration of Binance 1-second Close and OHLC4 TWAP60 proxies against Chainlink BTC/USD TWAP 60s, followed by a five-year reconstruction robustness test."
date: 2026-09-10
author: Naka Research
tags:
  - Polymarket
  - Polymarket Bot
  - BTC 5m
  - Chainlink
  - TWAP60
  - Binance
  - Quant Research
  - Data Validation
---

If you research **Polymarket BTC 5-minute Up/Down markets**, you eventually run into a basic data problem:

> **What price series should historical research actually use?**

Binance is an obvious starting point.

It provides long, continuous BTCUSDT history at high resolution, including 1-second candles and rich exchange-level market data.

But Polymarket BTC 5-minute markets are not ultimately resolved from Binance.

The relevant settlement reference is a **Chainlink BTC/USD TWAP Data Stream**.

So even though Binance and Chainlink describe the same underlying BTC market, they are not the same data source.

That creates a practical research question:

> If long-span historical Chainlink TWAP60 data is difficult to obtain, can Binance 1-second data be used to build a TWAP60 proxy that is reliable enough for historical research?

We recently had the opportunity to test that question directly against one full day of real Chainlink TWAP60 reports.

The result was more useful than simply asking whether the two price lines were identical.

---

## 1. We Are Not Trying to “Copy Chainlink”

The first distinction matters.

We do not know the complete internal implementation of Chainlink TWAP60, including all details of:

```text
upstream market sources
multi-venue aggregation
internal sampling frequency
outlier handling
weighting
precision and rounding
```

That means Binance BTCUSDT alone cannot reproduce a Chainlink price stream exactly.

But exact reproduction is not the real research objective.

The more useful question is:

> **Does a Binance-derived TWAP60 preserve the 5-minute direction, movement amplitude, and short-horizon structure of the real Chainlink TWAP60 well enough to support historical analysis?**

That is a much narrower—and testable—claim.

---

## 2. Two Binance-Derived TWAP60 Reconstructions

We built two versions.

### Version A: 1-Second Close

The simplest approach uses each Binance 1-second candle close as the representative price for that second:

```text
P(t) = Close(t)
```

Then we calculate a trailing 60-second average:

```text
TWAP60(t)
=
mean(
    P(t-59),
    ...
    P(t)
)
```

### Version B: 1-Second OHLC4

The second version first compresses each one-second candle into an OHLC4 price:

```text
P(t)
=
(
    Open(t)
  + High(t)
  + Low(t)
  + Close(t)
) / 4
```

The same 60-second rolling logic is then applied:

```text
OHLC4
  ↓
60-second rolling average
  ↓
TWAP60 proxy
```

The core difference is therefore very small:

> **Does each second contribute only its close, or a simple average of its OHLC path?**

Everything after that uses the same timing logic.

---

## 3. Why OHLC4 Might Be a Better Proxy

Consider a single Binance one-second candle:

```text
Open  = 100
High  = 104
Low   = 99
Close = 103
```

Using Close alone represents the entire second as:

```text
103
```

OHLC4 represents it as:

```text
(100 + 104 + 99 + 103) / 4
= 101.5
```

For an exchange candle, Close is a perfectly natural value.

But when the goal is to approximate the shape of a time-smoothed reference price that is not tied to one exchange alone, a more averaged within-second representation may preserve the short-term path slightly better.

That is only a hypothesis.

The important part is testing it against real Chainlink data.

---

## 4. Calibrating Against Real Chainlink TWAP60

For this calibration we used real **Chainlink BTC/USD TWAP60 data from September 4, 2026 UTC**.

Second-level coverage for the day was approximately:

```text
95.204%
```

A full UTC day contains 288 five-minute BTC intervals.

To avoid inflating agreement by using nearby observations, we accepted a five-minute interval only when the real Chainlink report existed at **both exact boundary seconds**.

The result:

```text
288 theoretical 5m intervals
258 with exact reports at both boundaries
```

The remaining 30 were left undetermined.

We did not use:

```text
nearest tick
forward fill
interpolation
```

This is important for an Up/Down market.

A nearby price is not proof of what the reference value was at the actual settlement boundary.

---

## 5. Five-Minute Direction Was Extremely Close

The first metric is also the most important one for this particular calibration: **five-minute direction**.

The direction agreement against real Chainlink TWAP60 was:

| Proxy | Exact-boundary bars | Direction agreement |
|---|---:|---:|
| 1s Close | 258 | **99.225%** |
| 1s OHLC4 | 258 | **99.612%** |

In raw counts:

```text
Close proxy:
256 / 258 same direction

OHLC4 proxy:
257 / 258 same direction
```

The disagreements were concentrated almost entirely in intervals where the real TWAP move was extremely close to zero.

For real five-minute Chainlink TWAP60 moves of roughly:

```text
0.5 bp or more
```

both reconstructions had:

```text
100% direction agreement
```

in this one-day sample.

That does not mean every future day will produce 100%.

It does tell us something important:

> **Meaningful five-minute directional movement was not being materially distorted by the Binance-derived reconstruction.**

---

## 6. Movement Amplitude Was Also Very Close

Direction alone is not enough.

A proxy can have the same sign while badly distorting movement magnitude.

So we compared five-minute TWAP movement as well.

| Proxy | Move Pearson | Move Spearman | Signed Move MAE |
|---|---:|---:|---:|
| 1s Close | **0.999510** | 0.998343 | 0.337 bp |
| 1s OHLC4 | **0.999586** | 0.998537 | 0.315 bp |

OHLC4 had a slightly lower movement error.

For high-coverage five-minute windows, range correlation was also extremely high:

```text
Close range Pearson = 0.999730
OHLC4 range Pearson = 0.999753
```

The median ratio between real Chainlink range and reconstructed range was roughly:

```text
0.987
```

So on this sample day, the reconstruction preserved not only direction but also the shape and scale of five-minute movement surprisingly well.

---

## 7. Similar Direction Does Not Mean Identical Price

This is where the calibration becomes more interesting.

If you look only at five-minute direction, it is tempting to conclude:

> The proxy is basically Chainlink.

It is not.

Binance is one trading venue.

Chainlink describes a broader BTC/USD reference state produced through a different data pipeline.

Therefore:

```text
Binance price
-
Binance-derived TWAP
```

is not the same quantity as:

```text
Binance price
-
Real Chainlink TWAP
```

We found that agreement in **relative price positioning** was materially weaker than agreement in five-minute direction.

That is evidence that cross-venue basis is real and cannot simply be reconstructed from Binance alone.

This distinction matters most when the two reference prices are already very close.

So we do not describe the Binance-derived TWAP60 as a:

```text
Chainlink price emulator
```

A better description is:

```text
historical market-structure proxy
```

---

## 8. Why We Also Needed a Five-Year Robustness Test

A one-day Chainlink calibration can answer:

> Does the reconstruction resemble real data?

It cannot answer:

> Does changing the reconstruction method materially change long-run research conclusions?

So we ran a second test on our existing long-span dataset.

The current research dataset contains:

```text
525,968 BTC 5m bars
```

covering:

```text
2021-09-09
to
2026-09-10
```

No parameters were re-optimized for this comparison.

The Close and OHLC4 reconstructions were passed through the same fixed research framework to test whether a small change in data construction would materially alter the long-run structure.

---

## 9. Five Years Showed That Close and OHLC4 Describe Almost the Same Structure

Across 525,968 five-minute bars:

```text
TWAP 5m direction agreement
= 99.8276%
```

Agreement on the side of the spot–proxy relationship was:

```text
99.6616%
```

The two gap magnitudes had a Pearson correlation of:

```text
0.999929
```

Signed gap correlation was:

```text
0.999952
```

Five-minute TWAP movement correlation was:

```text
0.999987
```

The median absolute difference between the two reconstructed gaps was only:

```text
0.0208 bp
```

This was the result we really wanted to see.

> **The historical structure does not depend on one fragile implementation detail of the TWAP reconstruction.**

If changing the representative price from one-second Close to one-second OHLC4 had caused the long-run behavior to change dramatically, that would have been a warning sign.

Instead, the two versions remained extremely close.

---

## 10. Why OHLC4 Becomes the Primary Research Proxy

We now have two independent pieces of evidence.

The real Chainlink calibration showed:

```text
OHLC4 direction agreement > Close
OHLC4 move MAE < Close
OHLC4 range correlation slightly higher
```

The five-year robustness test showed:

```text
Close and OHLC4 preserve almost the same long-run structure
```

So we are making a small change to the research baseline:

> **OHLC4-based TWAP60 will become our primary historical proxy going forward.**

The Close-based version will not disappear.

It remains useful as a:

```text
robustness benchmark
```

If a research result survives both:

```text
1s Close reconstruction
and
1s OHLC4 reconstruction
```

that is more reassuring than a result that exists only under one very specific data transformation.

---

## 11. This Does Not Mean Live Research Should Ignore Chainlink

Historical research needs data that is:

```text
long-span
continuous
high-resolution
repeatable
```

Binance is well suited to that job.

But the actual reference relevant to Polymarket settlement remains Chainlink.

A more useful architecture is therefore:

```text
           Binance 1s market data
                    │
                    ▼
          OHLC4-derived TWAP60
                    │
                    ▼
       historical / live research state


        Real Chainlink TWAP60
                    │
                    ▼
      settlement / validation /
       ongoing proxy calibration
```

The two data lines do not replace each other.

They serve different purposes.

---

## 12. What This Calibration Actually Proved

This work did **not** prove:

```text
we reconstructed Chainlink exactly
```

It also did not prove:

```text
a trading strategy will remain profitable
```

The question we actually tested was more fundamental:

> **Can a TWAP60 built from Binance 1-second data preserve the five-minute direction and movement structure of the real Chainlink TWAP60 well enough for historical research?**

On the real sample currently available to us, the answer is strongly positive.

The five-year Close/OHLC4 robustness test adds another layer:

> **Long-run research conclusions are not highly sensitive to a small change in the TWAP reconstruction method.**

For quantitative research, that kind of result can matter more than finding a slightly better backtest number.

Before trusting a model, we first need to know whether the research data itself is trustworthy.

---

## 13. Important Limitations

Several boundaries still matter.

### First: the real Chainlink calibration currently covers only one full UTC day

A set of 258 exact-boundary intervals is useful for reconstruction sanity checking.

It is not enough to claim that every future market regime will produce the same agreement rate.

We need more real Chainlink TWAP60 history.

### Second: the proxy cannot reproduce Chainlink cross-venue basis

A Binance-derived TWAP still begins with Binance.

It does not know what was happening at:

```text
Coinbase
Kraken
other venues
upstream providers
Chainlink internal aggregation
```

Therefore absolute price-level differences and very small relative gaps should not be treated as exact historical Chainlink substitutes.

### Third: proxy validation is not strategy validation

Showing that:

```text
proxy direction ≈ real direction
```

does not imply that:

```text
any trading rule built on the proxy must be profitable
```

Data validation and strategy validation are separate stages of research.

---

## 14. What Comes Next

The next step is straightforward.

First, we will continue collecting real Chainlink TWAP60 reports so the calibration can expand from:

```text
one-day validation
```

to:

```text
multi-day
multi-volatility
multi-regime
```

Second, OHLC4 becomes the main historical proxy while the Close version remains a long-run control.

Third, future research will continue to include reconstruction robustness checks.

A useful rule is:

> **If an apparent market effect exists only under one extremely specific data transformation, it deserves extra skepticism.**

---

## Conclusion

The original question was:

> **Can Binance 1-second data “reconstruct Chainlink TWAP60”?**

That is probably the wrong way to frame it.

The better question is:

> **Can we build a proxy that preserves the direction and short-horizon movement structure that matter for historical research?**

So far, the answer is:

**Yes—and the agreement is much stronger than we expected.**

But the second half of the conclusion matters just as much:

**A proxy is still not Chainlink.**

OHLC4-based TWAP60 will now serve as our primary historical research proxy.

Real Chainlink TWAP60 remains the source that cannot be replaced for:

> **settlement relevance, live validation, and ongoing calibration.**

Using both is a stronger research foundation than pretending either one can do every job.

---

## Related Research

- [Why Chainlink Makes Polymarket BTC 5-Minute Bots Harder to Research](/en/articles/polymarket-chainlink-btc5m-research-difficulty/)
- [Polymarket Bot Research: Can Binance–TWAP60 Divergence Predict the Next BTC 5-Minute Direction?](/en/articles/polymarket-bot-binance-twap60-divergence/)

---

### References

- [Polymarket Developer Documentation](https://docs.polymarket.com/)
- [Polymarket BTC Up/Down 5m Markets](https://polymarket.com/)
- [Chainlink Data Feeds](https://chain.link/data-feeds)
- [Binance Spot API Documentation](https://developers.binance.com/docs/binance-spot-api-docs/)
- [Polymarket Crypto Up/Down — Market Data Samples](https://github.com/Ligengxin96/polymarket-data-samples)
- [OutcomeTick — Historical Prediction Market Data](https://outcometick.com/)

---

*Disclaimer: This article documents a research process for data reconstruction and validation. It is not financial advice, does not promise trading profitability, and does not disclose or describe a complete production trading strategy.*
