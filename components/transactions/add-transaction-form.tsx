"use client";

import { useState } from "react";
import { AssetType, TransactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTransactionForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload = {
      assetType: formData.get("assetType"),
      symbol: formData.get("symbol"),
      name: formData.get("name"),
      type: formData.get("type"),
      quantity: Number(formData.get("quantity")),
      pricePerUnit: Number(formData.get("pricePerUnit")),
      fees: Number(formData.get("fees") || 0),
      executedAt: new Date(String(formData.get("executedAt"))).toISOString(),
      notes: formData.get("notes")
    };

    await fetch("/api/transactions", { method: "POST", body: JSON.stringify(payload) });
    setLoading(false);
    window.location.reload();
  }

  return (
    <form action={onSubmit} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
      <select name="assetType" defaultValue={AssetType.GOLD} className="rounded-md border p-2">
        {Object.values(AssetType).map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <Input name="symbol" placeholder="الرمز (مثال: COMI)" required />
      <Input name="name" placeholder="الاسم" required />
      <select name="type" defaultValue={TransactionType.BUY} className="rounded-md border p-2">
        {Object.values(TransactionType).map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <Input name="quantity" type="number" step="0.0001" placeholder="الكمية" required />
      <Input name="pricePerUnit" type="number" step="0.0001" placeholder="السعر لكل وحدة" required />
      <Input name="fees" type="number" step="0.0001" placeholder="العمولات" />
      <Input name="executedAt" type="datetime-local" required />
      <Input name="notes" placeholder="ملاحظات" />
      <Button disabled={loading}>{loading ? "جاري الحفظ..." : "إضافة العملية"}</Button>
    </form>
  );
}
