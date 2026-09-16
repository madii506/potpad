# POT

An hourly pot on Robinhood Chain. The creator fee fills it, and at the top of
every hour the whole thing goes to the X handle whose post about $POT got the
most views that hour — paid in dollars through X Money. No wallet, no code,
nothing to claim.

**Every hour, someone gets paid.**

## Readers

| endpoint | source | notes |
|---|---|---|
| `/api/tweet?url=` | FxTwitter → syndication | the only source that reports **views**; syndication returns `views: null`, never 0 |
| `/api/handle?h=` | FxTwitter → syndication | `{handle,name,followers,verified,avatar,exists,src}` |
| `/api/avatar?h=` | FxTwitter → pbs.twimg | resolves then proxies the bytes, `s-maxage=86400` |
| `/api/coin?ca=` | Dexscreener + Blockscout | `potPerDay = volume.h24 × 0.007`; `holders` is null by design — Blockscout 403s from Vercel, the page reads it client-side |

## Economics

Pons charges 1.00% per trade, split 70 / 30 with the creator. 0.70% of volume
is the creator share, and 100% of it is the pot.

Set `CONFIG.ca` in `index.html` to wire the contract address. Until then every
figure renders as a dash and the anti-scam strip carries the pre-launch warning.


---

Live at potpad.vercel.app
