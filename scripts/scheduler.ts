import { prisma } from "@/lib/db/prisma";
import { syncGoldPrices, syncStockPrices } from "@/lib/domain/sync-service";
import { generateMonthlyReport } from "@/lib/domain/report-service";

function isWithinMarketHours(now: Date, marketHours: { from: string; to: string; days: number[] }) {
  const day = now.getDay();
  if (!marketHours.days.includes(day)) return false;
  const [fh, fm] = marketHours.from.split(":").map(Number);
  const [th, tm] = marketHours.to.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= fh * 60 + fm && current <= th * 60 + tm;
}

async function getSetting(key: string, fallback: string) {
  const value = await prisma.appSetting.findUnique({ where: { key } });
  return value?.value ?? fallback;
}

async function tick() {
  const marketHours = JSON.parse(await getSetting("market_hours", '{"from":"10:00","to":"14:30","days":[0,1,2,3,4]}'));
  const now = new Date();

  const goldInterval = Number(await getSetting("gold_sync_interval_minutes", "15"));
  const marketInterval = Number(await getSetting("stock_sync_market_minutes", "5"));
  const offMarketInterval = Number(await getSetting("stock_sync_off_market_minutes", "60"));

  const minute = now.getMinutes();
  if (minute % goldInterval === 0) await syncGoldPrices();

  const stockInterval = isWithinMarketHours(now, marketHours) ? marketInterval : offMarketInterval;
  if (minute % stockInterval === 0) await syncStockPrices();

  if (now.getDate() === 1 && now.getHours() === 0 && minute < 10) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    await generateMonthlyReport(previousMonth);
  }
}

async function main() {
  console.log("Scheduler started");
  await tick();
  setInterval(tick, 60_000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
