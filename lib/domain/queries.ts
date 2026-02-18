import { AssetType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { buildPortfolioMetrics } from "@/lib/domain/portfolio-engine";

export async function getPortfolioOverview() {
  const assets = await prisma.asset.findMany({
    include: {
      transactions: true,
      priceHistory: { orderBy: { observedAt: "desc" }, take: 50 }
    }
  });

  const metrics = buildPortfolioMetrics({ assets });
  const totalValue = metrics.reduce((s, m) => s + m.currentValue, 0);

  return {
    metrics,
    totalValue,
    allocation: metrics.map((m) => ({ name: m.symbol, value: m.currentValue })),
    gold: metrics.filter((m) => m.type === AssetType.GOLD),
    stocks: metrics.filter((m) => m.type === AssetType.STOCK),
    cash: metrics.filter((m) => m.type === AssetType.CASH),
    transactions: await prisma.transaction.findMany({ include: { asset: true }, orderBy: { executedAt: "desc" }, take: 10 }),
    reports: await prisma.monthlyReport.findMany({ orderBy: { month: "asc" }, take: 12 }),
    statuses: await prisma.syncStatus.findMany({ orderBy: { key: "asc" } })
  };
}
