import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const statuses = await prisma.syncStatus.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(statuses);
}
