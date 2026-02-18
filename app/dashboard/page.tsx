import { Card } from "@/components/ui/card";
import { AllocationDonut } from "@/components/charts/allocation-donut";
import { ValueLineChart } from "@/components/charts/value-line-chart";
import { getPortfolioOverview } from "@/lib/domain/queries";
import { formatCurrencyEGP } from "@/lib/utils";

export default async function DashboardPage() {
  const data = await getPortfolioOverview();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>القيمة الإجمالية: {formatCurrencyEGP(data.totalValue)}</Card>
        <Card>عدد الأصول: {data.metrics.length}</Card>
        <Card>الربح المحقق: {formatCurrencyEGP(data.metrics.reduce((s, m) => s + m.realizedPnL, 0))}</Card>
        <Card>الربح غير المحقق: {formatCurrencyEGP(data.metrics.reduce((s, m) => s + m.unrealizedPnL, 0))}</Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-semibold">توزيع المحفظة</h2>
          <AllocationDonut data={data.allocation} />
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">اتجاه قيمة المحفظة</h2>
          <ValueLineChart data={data.reports.map((r) => ({ name: r.month, value: Number(r.endValue) }))} />
        </Card>
      </div>
      <Card>
        <h2 className="mb-2 font-semibold">آخر العمليات</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th>الأصل</th><th>النوع</th><th>الكمية</th><th>القيمة</th><th>التاريخ</th></tr></thead>
            <tbody>
              {data.transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td>{tx.asset.name}</td><td>{tx.type}</td><td>{Number(tx.quantity)}</td><td>{formatCurrencyEGP(Number(tx.totalValue))}</td><td>{tx.executedAt.toLocaleString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
