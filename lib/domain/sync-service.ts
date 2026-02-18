import { AssetType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { fetchGoldPricePerGramEgp, fetchTwelveDataQuote } from "@/lib/api/market";

async function updateSyncStatus(key: string, input: { ok: boolean; error?: string }) {
  await prisma.syncStatus.upsert({
    where: { key },
    update: {
      lastSuccessAt: input.ok ? new Date() : undefined,
      lastError: input.ok ? null : input.error,
      retryCount: input.ok ? 0 : { increment: 1 }
    },
    create: {
      key,
      lastSuccessAt: input.ok ? new Date() : null,
      lastError: input.error ?? null,
      retryCount: input.ok ? 0 : 1
    }
  });
}

export async function syncGoldPrices() {
  const key = "gold_sync";
  try {
    const goldAsset = await prisma.asset.findFirstOrThrow({ where: { type: AssetType.GOLD } });
    const price = await fetchGoldPricePerGramEgp();

    await prisma.priceHistory.create({
      data: {
        assetId: goldAsset.id,
        price,
        source: "gold_api",
        observedAt: new Date()
      }
    });

    await updateSyncStatus(key, { ok: true });
    return { ok: true, price };
  } catch (error) {
    await updateSyncStatus(key, { ok: false, error: (error as Error).message });
    return { ok: false, error: (error as Error).message };
  }
}

export async function syncStockPrices() {
  const key = "stocks_sync";
  try {
    const stockAssets = await prisma.asset.findMany({ where: { type: AssetType.STOCK } });

    for (const asset of stockAssets) {
      const price = await fetchTwelveDataQuote(asset.symbol);
      await prisma.priceHistory.create({
        data: {
          assetId: asset.id,
          price,
          source: "twelve_data",
          observedAt: new Date()
        }
      });
    }

    await updateSyncStatus(key, { ok: true });
    return { ok: true, count: stockAssets.length };
  } catch (error) {
    await updateSyncStatus(key, { ok: false, error: (error as Error).message });
    return { ok: false, error: (error as Error).message };
  }
}
