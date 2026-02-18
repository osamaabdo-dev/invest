import { AssetSection } from "@/components/reports/asset-section";
import { getPortfolioOverview } from "@/lib/domain/queries";

export default async function StocksPage() {
  const data = await getPortfolioOverview();
  return <AssetSection title="الأسهم المصرية" holdings={data.stocks} />;
}
