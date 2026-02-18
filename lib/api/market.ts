import { fetchWithRetry } from "@/lib/api/http";

export async function fetchUsdEgpRate() {
  const baseUrl = process.env.FX_API_BASE_URL;
  const key = process.env.FX_API_KEY;
  if (!baseUrl) throw new Error("FX_API_BASE_URL is missing");

  const res = await fetchWithRetry(`${baseUrl}?base=USD&symbols=EGP${key ? `&apikey=${key}` : ""}`);
  const data = await res.json();
  const rate = data?.rates?.EGP ?? data?.result?.EGP;
  if (!rate) throw new Error("Cannot parse FX response");
  return Number(rate);
}

export async function fetchGoldPricePerGramEgp() {
  const baseUrl = process.env.GOLD_API_BASE_URL;
  const key = process.env.GOLD_API_KEY;
  if (!baseUrl) throw new Error("GOLD_API_BASE_URL is missing");

  const res = await fetchWithRetry(`${baseUrl}${key ? `?apikey=${key}` : ""}`);
  const data = await res.json();

  if (data.price_per_gram_egp) return Number(data.price_per_gram_egp);

  const xauUsd = data.price ?? data.xau_usd;
  if (!xauUsd) throw new Error("Cannot parse gold response");

  const usdEgp = await fetchUsdEgpRate();
  const gramInOunce = 31.1034768;
  return (Number(xauUsd) * usdEgp) / gramInOunce;
}

export async function fetchTwelveDataQuote(symbol: string) {
  const key = process.env.TWELVE_DATA_API_KEY;
  if (!key) throw new Error("TWELVE_DATA_API_KEY is missing");

  const encoded = encodeURIComponent(`${symbol}:XCAI`);
  const res = await fetchWithRetry(`https://api.twelvedata.com/price?symbol=${encoded}&apikey=${key}`);
  const data = await res.json();

  if (!data?.price) throw new Error(data?.message ?? "Cannot parse Twelve Data response");
  return Number(data.price);
}
