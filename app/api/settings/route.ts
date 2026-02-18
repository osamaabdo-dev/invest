import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());

  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.appSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  );

  return NextResponse.redirect(new URL("/settings", request.url));
}
