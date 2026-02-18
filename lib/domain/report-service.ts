import { endOfMonth, format, startOfMonth } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { buildPortfolioMetrics } from "@/lib/domain/portfolio-engine";

export async function generateMonthlyReport(month: string) {
  const date = new Date(`${month}-01T00:00:00.000Z`);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const periodTransactions = await prisma.transaction.findMany({
    where: { executedAt: { gte: start, lte: end } },
    include: { asset: true }
  });

  const assets = await prisma.asset.findMany({ include: { transactions: true, priceHistory: true } });
  const metrics = buildPortfolioMetrics({ assets });

  const endValue = metrics.reduce((sum, m) => sum + m.currentValue, 0);
  const realizedPnL = metrics.reduce((sum, m) => sum + m.realizedPnL, 0);
  const unrealizedPnL = metrics.reduce((sum, m) => sum + m.unrealizedPnL, 0);

  const netCashFlows = periodTransactions.reduce((sum, tx) => {
    const sign = tx.type === "DEPOSIT" ? 1 : tx.type === "WITHDRAW" ? -1 : 0;
    return sum + sign * Number(tx.totalValue);
  }, 0);

  const payload = {
    month: format(start, "yyyy-MM"),
    startValue: endValue - realizedPnL - unrealizedPnL,
    endValue,
    netCashFlows,
    realizedPnL,
    unrealizedPnL,
    byAsset: metrics,
    topWinners: [...metrics].sort((a, b) => b.unrealizedPnL - a.unrealizedPnL).slice(0, 3),
    topLosers: [...metrics].sort((a, b) => a.unrealizedPnL - b.unrealizedPnL).slice(0, 3)
  };

  await prisma.monthlyReport.upsert({
    where: { month: payload.month },
    update: {
      startValue: payload.startValue,
      endValue: payload.endValue,
      netCashFlows: payload.netCashFlows,
      realizedPnL: payload.realizedPnL,
      unrealizedPnL: payload.unrealizedPnL,
      reportData: payload
    },
    create: {
      month: payload.month,
      startValue: payload.startValue,
      endValue: payload.endValue,
      netCashFlows: payload.netCashFlows,
      realizedPnL: payload.realizedPnL,
      unrealizedPnL: payload.unrealizedPnL,
      reportData: payload
    }
  });

  return payload;
}
