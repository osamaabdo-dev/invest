import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_: Request, { params }: { params: { month: string } }) {
  const report = await prisma.monthlyReport.findUnique({ where: { month: params.month } });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(report.reportData);
}
