import Link from "next/link";

const links = [
  ["/dashboard", "لوحة التحكم"],
  ["/gold", "الذهب"],
  ["/stocks", "الأسهم"],
  ["/cash", "النقد"],
  ["/transactions", "العمليات"],
  ["/reports", "التقارير"],
  ["/settings", "الإعدادات"]
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 p-4">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 hover:bg-muted">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
