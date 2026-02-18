import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export default async function SettingsPage() {
  const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
  const statuses = await prisma.syncStatus.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">الإعدادات</h1>
      <Card>
        <form action="/api/settings" method="post" className="grid gap-3 md:grid-cols-2">
          {settings.map((s) => (
            <label key={s.id} className="grid gap-1 text-sm">
              {s.key}
              <input name={s.key} defaultValue={s.value} className="rounded-md border p-2" />
            </label>
          ))}
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">حفظ الإعدادات</button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-2 text-lg font-semibold">حالة المزامنة</h2>
        <ul className="space-y-1 text-sm">
          {statuses.map((s) => (
            <li key={s.id}>{s.key}: {s.lastSuccessAt?.toLocaleString("ar-EG") ?? "لا يوجد"} {s.lastError ? ` - خطأ: ${s.lastError}` : ""}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
