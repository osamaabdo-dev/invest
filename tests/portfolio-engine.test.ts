import { describe, expect, it } from "vitest";
import { TransactionType } from "@prisma/client";
import { calculateWeightedAverageHoldings } from "@/lib/domain/portfolio-engine";

const d = (value: string) => new Date(value);

describe("portfolio engine", () => {
  it("calculates weighted average with buy fees", () => {
    const result = calculateWeightedAverageHoldings([
      { type: TransactionType.BUY, quantity: 10, pricePerUnit: 100, fees: 10, executedAt: d("2024-01-01") },
      { type: TransactionType.BUY, quantity: 10, pricePerUnit: 200, fees: 10, executedAt: d("2024-01-02") }
    ] as never);

    expect(result.quantity).toBe(20);
    expect(result.avgCost).toBeCloseTo(151, 6);
    expect(result.realizedPnL).toBe(0);
  });

  it("supports partial sell and realized pnl with fees", () => {
    const result = calculateWeightedAverageHoldings([
      { type: TransactionType.BUY, quantity: 10, pricePerUnit: 100, fees: 0, executedAt: d("2024-01-01") },
      { type: TransactionType.SELL, quantity: 4, pricePerUnit: 120, fees: 8, executedAt: d("2024-01-03") }
    ] as never);

    expect(result.quantity).toBe(6);
    expect(result.avgCost).toBe(100);
    expect(result.realizedPnL).toBeCloseTo(72, 6);
  });

  it("resets avg cost when position fully closed", () => {
    const result = calculateWeightedAverageHoldings([
      { type: TransactionType.BUY, quantity: 2, pricePerUnit: 100, fees: 0, executedAt: d("2024-01-01") },
      { type: TransactionType.SELL, quantity: 2, pricePerUnit: 110, fees: 0, executedAt: d("2024-01-02") }
    ] as never);

    expect(result.quantity).toBe(0);
    expect(result.avgCost).toBe(0);
    expect(result.realizedPnL).toBe(20);
  });
});
