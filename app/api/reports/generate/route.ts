import { NextResponse } from "next/server";
import { generateMonthlyReport } from "@/lib/domain/report-service";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let month = "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    month = body.month;
  } else {
    const formData = await request.formData();
    month = String(formData.get("month"));
  }

  const report = await generateMonthlyReport(month);
  return NextResponse.json(report, { status: 201 });
}
