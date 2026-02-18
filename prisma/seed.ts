import { PrismaClient, AssetType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.asset.upsert({
    where: { type_symbol: { type: AssetType.GOLD, symbol: "GOLD-24K" } },
    update: {},
    create: {
      type: AssetType.GOLD,
      symbol: "GOLD-24K",
      name: "ذهب 24 قيراط",
      metadata: { defaultKarat: 24 }
    }
  });

  await prisma.asset.upsert({
    where: { type_symbol: { type: AssetType.CASH, symbol: "CASH-EGP" } },
    update: {},
    create: {
      type: AssetType.CASH,
      symbol: "CASH-EGP",
      name: "نقدي بالجنيه المصري"
    }
  });

  await prisma.appSetting.createMany({
    data: [
      { key: "gold_karat_default", value: "21" },
      { key: "gold_sync_interval_minutes", value: "15" },
      { key: "stock_sync_market_minutes", value: "5" },
      { key: "stock_sync_off_market_minutes", value: "60" },
      { key: "market_hours", value: JSON.stringify({ from: "10:00", to: "14:30", days: [0, 1, 2, 3, 4] }) }
    ],
    skipDuplicates: true
  });
}

main().finally(async () => prisma.$disconnect());
