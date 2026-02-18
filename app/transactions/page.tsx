import { AddTransactionForm } from "@/components/transactions/add-transaction-form";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({ include: { asset: true }, orderBy: { executedAt: "desc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">العمليات</h1>
      <AddTransactionForm />
      <Card>
        <table className="w-full text-sm">
          <thead><tr><th>الأصل</th><th>النوع</th><th>الكمية</th><th>السعر</th><th>التاريخ</th></tr></thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td>{tx.asset.symbol}</td><td>{tx.type}</td><td>{Number(tx.quantity)}</td><td>{Number(tx.pricePerUnit)}</td><td>{tx.executedAt.toLocaleString("ar-EG")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
