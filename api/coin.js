// Market read for the coin itself. Dexscreener carries price / volume /
// liquidity / mcap; Blockscout carries the holder count but 403s when called
// from Vercel, so holders is deliberately returned as null and the PAGE
// re-reads it client-side. Never cache that null.
const DS = 'https://api.dexscreener.com/latest/dex/tokens/';
const BS = 'https://robinhoodchain.blockscout.com/api/v2/tokens/';

const isCA = (s = '') => /^0x[a-fA-F0-9]{40}$/.test(String(s).trim());

async function grab(url, ms = 6000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { accept: 'application/json' } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; } finally { clearTimeout(t); }
}

export default async function handler(req, res) {
  const ca = String(req.query?.ca || '').trim();
  res.setHeader('cache-control', 's-maxage=45, stale-while-revalidate=180');
  if (!isCA(ca)) return res.status(400).json({ error: 'contract address required' });

  const ds = await grab(DS + ca);
  const pairs = (ds?.pairs || []).filter((p) => p.chainId === 'robinhood');
  pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
  const p = pairs[0] || null;

  const vol24 = p?.volume?.h24 ?? null;
  // Pons: 1.00% trade fee, 70% to the creator. 0.70% of volume is the pot.
  const potPerDay = vol24 == null ? null : vol24 * 0.007;

  const bs = await grab(BS + ca);

  return res.status(200).json({
    ca,
    hasPair: !!p,
    price: p?.priceUsd ? Number(p.priceUsd) : null,
    marketCap: p?.marketCap ?? p?.fdv ?? null,
    liquidity: p?.liquidity?.usd ?? null,
    volume24: vol24,
    change24: p?.priceChange?.h24 ?? null,
    pairUrl: p?.url ?? null,
    potPerDay,
    potPerHour: potPerDay == null ? null : potPerDay / 24,
    name: bs?.name ?? p?.baseToken?.name ?? null,
    symbol: bs?.symbol ?? p?.baseToken?.symbol ?? null,
    holders: null,        // 403 from Vercel. The page reads this itself.
    holdersNote: 'read client-side from Blockscout',
  });
}
