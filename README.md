# POT

An hourly pot on pump.fun. The creator fee fills it, and at the top of every
hour the whole thing goes to the X handle whose post about $POT got the most
views that hour — paid in dollars through X Money. No wallet, no code, nothing
to claim.

**Every hour, someone gets paid.**

## The rule

1. **The fee fills it.** 100% of the creator fee on every $POT trade goes into
   the pot. Nothing is skimmed, held back for a treasury, or routed to a team
   wallet.
2. **The hour judges it.** Every public post naming $POT inside that hour is
   read. The one with the most views at settlement wins — not likes, not
   followers, views.
3. **X Money sends it.** Dollars, to the handle. The recipient does nothing.
4. **The receipt records it.** A public post naming the winner, the post, the
   view count and the amount.

## Economics

pump.fun lets the creator set a per-trade fee at launch, capped at **3.00%**,
and all of it is the prize.

```
pot_per_day  = volume_24h × (creator_fee_pct / 100)
pot_per_hour = pot_per_day / 24
```

At a 1.00% fee and $1,000,000 of 24h volume: **$10,000 a day, $416.67 an hour**,
to one person, in dollars.

## Readers

Four endpoints, no database, nothing that writes. Documented in full — with a
live "try it" button on each — at [`/docs.html`](https://potpad.vercel.app/docs.html).

| endpoint | reads | source |
| --- | --- | --- |
| `/api/tweet?id=` | a post's views and author | FxTwitter, then syndication |
| `/api/handle?h=` | an account's name and followers | FxTwitter, then syndication |
| `/api/avatar?h=` | an account's picture (proxied bytes) | resolved, then proxied |
| `/api/coin?ca=&fee=` | price, volume, pot size | Dexscreener, filtered to Solana |

Only FxTwitter reports view counts. Where the syndication fallback is the
source, `views` comes back as `null` and never as `0` — a post read that way
cannot be ranked, which is exactly the eligibility rule.

## Status

$POT has **no mint address yet**. When one exists it will be on the site and in
the pinned post at the same time. Anyone posting an address before that is
scamming you.

Until then every figure on the site is a dash rather than a zero, because a zero
would claim we looked and found nothing.

## Running it

```
npm i -g vercel        # or just open index.html for the static half
node srv.mjs           # local stand-in for Vercel on :8833
python3 test.py        # playwright suite against the local server
```

Deployed at [potpad.vercel.app](https://potpad.vercel.app).
