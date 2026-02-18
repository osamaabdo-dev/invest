import { Card } from "@/components/ui/card";
import { ValueLineChart } from "@/components/charts/value-line-chart";
import { formatCurrencyEGP } from "@/lib/utils";
import type { HoldingMetrics } from "@/lib/domain/portfolio-engine";

export function AssetSection({ title, holdings }: { title: string; holdings: HoldingMetrics[] }) {
  const total = holdings.reduce((s, h) => s + h.currentValue, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>القيمة الحالية: {formatCurrencyEGP(total)}</Card>
        <Card>إجمالي الربح المحقق: {formatCurrencyEGP(holdings.reduce((s, h) => s + h.realizedPnL, 0))}</Card>
        <Card>إجمالي الربح غير المحقق: {formatCurrencyEGP(holdings.reduce((s, h) => s + h.unrealizedPnL, 0))}</Card>
        <Card>عدد المراكز: {holdings.length}</Card>
      </div>
      <Card>
        <ValueLineChart data={holdings.map((h) => ({ name: h.symbol, value: h.currentValue }))} />
      </Card>
      <Card>
        <table className="w-full text-sm">
          <thead><tr><th>الرمز</th><th>الكمية</th><th>متوسط التكلفة</th><th>السعر الحالي</th><th>القيمة</th><th>P&L</th></tr></thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.assetId} className="border-t">
                <td>{h.symbol}</td>
                <td>{h.quantity.toFixed(4)}</td>
                <td>{formatCurrencyEGP(h.avgCost)}</td>
                <td>{formatCurrencyEGP(h.currentPrice)}</td>
                <td>{formatCurrencyEGP(h.currentValue)}</td>
                <td>{formatCurrencyEGP(h.realizedPnL + h.unrealizedPnL)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
