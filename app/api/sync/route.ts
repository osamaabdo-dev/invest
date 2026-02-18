import { NextResponse } from "next/server";
import { syncGoldPrices, syncStockPrices } from "@/lib/domain/sync-service";

export async function POST() {
  const [gold, stocks] = await Promise.all([syncGoldPrices(), syncStockPrices()]);
  return NextResponse.json({ gold, stocks });
}
