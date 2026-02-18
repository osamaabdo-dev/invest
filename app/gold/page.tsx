import { AssetSection } from "@/components/reports/asset-section";
import { getPortfolioOverview } from "@/lib/domain/queries";

export default async function GoldPage() {
  const data = await getPortfolioOverview();
  return <AssetSection title="الذهب" holdings={data.gold} />;
}
