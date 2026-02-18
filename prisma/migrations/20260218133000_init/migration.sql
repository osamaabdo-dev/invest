-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "pricePerUnit" DECIMAL NOT NULL,
    "fees" DECIMAL NOT NULL DEFAULT 0,
    "totalValue" DECIMAL NOT NULL,
    "executedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "source" TEXT NOT NULL,
    "observedAt" DATETIME NOT NULL,
    CONSTRAINT "PriceHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotAt" DATETIME NOT NULL,
    "totalValue" DECIMAL NOT NULL,
    "cashValue" DECIMAL NOT NULL,
    "goldValue" DECIMAL NOT NULL,
    "stocksValue" DECIMAL NOT NULL,
    "metadata" JSONB
);

-- CreateTable
CREATE TABLE "MonthlyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "startValue" DECIMAL NOT NULL,
    "endValue" DECIMAL NOT NULL,
    "netCashFlows" DECIMAL NOT NULL,
    "realizedPnL" DECIMAL NOT NULL,
    "unrealizedPnL" DECIMAL NOT NULL,
    "reportData" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SyncStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "lastSuccessAt" DATETIME,
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_type_symbol_key" ON "Asset"("type", "symbol");
CREATE INDEX "Transaction_assetId_executedAt_idx" ON "Transaction"("assetId", "executedAt");
CREATE INDEX "PriceHistory_assetId_observedAt_idx" ON "PriceHistory"("assetId", "observedAt");
CREATE INDEX "PortfolioSnapshot_snapshotAt_idx" ON "PortfolioSnapshot"("snapshotAt");
CREATE UNIQUE INDEX "MonthlyReport_month_key" ON "MonthlyReport"("month");
CREATE UNIQUE INDEX "SyncStatus_key_key" ON "SyncStatus"("key");
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");
