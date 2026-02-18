import { AssetType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { transactionSchema } from "@/lib/validators/transaction";

export async function GET() {
  const txs = await prisma.transaction.findMany({ include: { asset: true }, orderBy: { executedAt: "desc" } });
  return NextResponse.json(txs);
}

export async function POST(request: Request) {
  const json = await request.json();
  const data = transactionSchema.parse(json);

  const asset = await prisma.asset.upsert({
    where: { type_symbol: { type: data.assetType, symbol: data.symbol } },
    update: { name: data.name },
    create: {
      type: data.assetType,
      symbol: data.symbol,
      name: data.name,
      metadata: data.assetType === AssetType.STOCK ? { exchangeMic: "XCAI" } : undefined
    }
  });

  const totalValue = data.quantity * data.pricePerUnit;

  const tx = await prisma.transaction.create({
    data: {
      assetId: asset.id,
      type: data.type,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      fees: data.fees,
      totalValue,
      executedAt: new Date(data.executedAt),
      notes: data.notes
    }
  });

  return NextResponse.json(tx, { status: 201 });
}
