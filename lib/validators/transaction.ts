import { AssetType, TransactionType } from "@prisma/client";
import { z } from "zod";

export const transactionSchema = z.object({
  assetType: z.nativeEnum(AssetType),
  symbol: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  quantity: z.number().positive(),
  pricePerUnit: z.number().nonnegative(),
  fees: z.number().nonnegative().default(0),
  executedAt: z.string().datetime(),
  notes: z.string().optional()
});

export const settingsSchema = z.object({
  gold_karat_default: z.string(),
  gold_sync_interval_minutes: z.string(),
  stock_sync_market_minutes: z.string(),
  stock_sync_off_market_minutes: z.string(),
  market_hours: z.string()
});
