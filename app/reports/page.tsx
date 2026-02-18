import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export default async function ReportsPage() {
  const reports = await prisma.monthlyReport.findMany({ orderBy: { month: "desc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">التقارير الشهرية</h1>
      <form action="/api/reports/generate" method="post" className="flex gap-2">
        <input type="month" name="month" className="rounded-md border p-2" required />
        <Button type="submit">توليد التقرير</Button>
      </form>
      <Card>
        <table className="w-full text-sm">
          <thead><tr><th>الشهر</th><th>بداية</th><th>نهاية</th><th>تدفقات</th><th>تصدير</th></tr></thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t">
                <td>{r.month}</td><td>{Number(r.startValue)}</td><td>{Number(r.endValue)}</td><td>{Number(r.netCashFlows)}</td>
                <td><a href={`/api/reports/${r.month}`} className="text-blue-600">JSON</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
