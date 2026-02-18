import { AssetSection } from "@/components/reports/asset-section";
import { getPortfolioOverview } from "@/lib/domain/queries";

export default async function CashPage() {
  const data = await getPortfolioOverview();
  return <AssetSection title="النقد" holdings={data.cash} />;
}
