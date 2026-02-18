import { AssetType, TransactionType, type Asset, type PriceHistory, type Transaction } from "@prisma/client";
import { toNumber } from "@/lib/utils";

export type HoldingMetrics = {
  assetId: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  avgCost: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  realizedPnL: number;
  unrealizedPnL: number;
};

type TxInput = Pick<Transaction, "type" | "quantity" | "pricePerUnit" | "fees" | "executedAt">;

export function calculateWeightedAverageHoldings(transactions: TxInput[]) {
  const sorted = [...transactions].sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime());

  let quantity = 0;
  let avgCost = 0;
  let realizedPnL = 0;

  for (const tx of sorted) {
    const q = toNumber(tx.quantity);
    const p = toNumber(tx.pricePerUnit);
    const fees = toNumber(tx.fees);

    if (tx.type === TransactionType.BUY || tx.type === TransactionType.DEPOSIT) {
      const totalCost = quantity * avgCost + q * p + fees;
      quantity += q;
      avgCost = quantity > 0 ? totalCost / quantity : 0;
    }

    if (tx.type === TransactionType.SELL || tx.type === TransactionType.WITHDRAW) {
      const proceeds = q * p - fees;
      const removedCost = q * avgCost;
      realizedPnL += proceeds - removedCost;
      quantity -= q;
      if (quantity < 1e-9) {
        quantity = 0;
        avgCost = 0;
      }
    }
  }

  return {
    quantity,
    avgCost,
    costBasis: quantity * avgCost,
    realizedPnL
  };
}

export function buildPortfolioMetrics(params: {
  assets: (Asset & { transactions: Transaction[]; priceHistory: PriceHistory[] })[];
}): HoldingMetrics[] {
  return params.assets.map((asset) => {
    const latestPrice = [...asset.priceHistory]
      .sort((a, b) => b.observedAt.getTime() - a.observedAt.getTime())
      .at(0);

    const currentPrice = asset.type === AssetType.CASH ? 1 : toNumber(latestPrice?.price ?? 0);
    const { quantity, avgCost, costBasis, realizedPnL } = calculateWeightedAverageHoldings(asset.transactions);
    const currentValue = quantity * currentPrice;

    return {
      assetId: asset.id,
      symbol: asset.symbol,
      type: asset.type,
      quantity,
      avgCost,
      costBasis,
      currentPrice,
      currentValue,
      realizedPnL,
      unrealizedPnL: currentValue - costBasis
    };
  });
}
