# متتبع الاستثمارات المحلي (Arabic RTL)

تطبيق Next.js محلي بالكامل لتتبع:
- الذهب
- الأسهم المصرية (EGX / XCAI عبر Twelve Data)
- النقد (EGP)

## التقنية
- Next.js App Router + TypeScript
- Tailwind + مكونات shadcn/ui الأساسية
- Prisma + SQLite
- Recharts
- Zod

## الإعداد المحلي
1) نسخ المتغيرات:
```bash
cp .env.example .env
```
2) تثبيت الحزم:
```bash
npm install
```
3) تشغيل الهجرة وتوليد العميل وبذر البيانات:
```bash
npm run db:migrate
npm run db:generate
npx prisma db seed
```
4) تشغيل التطبيق:
```bash
npm run dev
```

## المتغيرات البيئية
- `DATABASE_URL`: مسار SQLite (محلي)
- `GOLD_API_BASE_URL`, `GOLD_API_KEY`
- `FX_API_BASE_URL`, `FX_API_KEY`
- `TWELVE_DATA_API_KEY`

## السكربتات
- `npm run dev`: تشغيل Next.js
- `npm run db:migrate`: Prisma migrate dev
- `npm run db:studio`: Prisma Studio
- `npm run sync`: تشغيل المجدول المحلي للمزامنة الدورية
- `npm run report -- 2026-01`: توليد تقرير شهر معين
- `npm run test`: اختبارات وحدة لمحرك المحفظة

## وظائف رئيسية
- واجهة عربية RTL مع الوضع الداكن/الفاتح.
- لا يوجد إدخال يدوي لأسعار السوق؛ الأسعار تأتي من APIs وتُخزّن تاريخيًا.
- محرك محفظة يعتمد متوسط تكلفة مرجح (Weighted Average) مع دعم البيع الجزئي ورسوم التداول.
- تقارير شهرية قابلة للتوليد والحفظ والتصدير JSON.
- مجدول محلي لمزامنة الذهب والأسهم بفواصل زمنية قابلة للضبط وساعات سوق.

## المجلدات
- `app/`: الصفحات وواجهات API
- `lib/domain`: منطق المحفظة والمزامنة والتقارير
- `prisma/`: المخطط والهجرات والبذر
- `scripts/`: scheduler وتوليد التقارير
- `tests/`: اختبارات الوحدة

## ملاحظات الإنتاج المحلي
- التطبيق مصمم للتشغيل المحلي فقط (SQLite file-based).
- حالات فشل APIs تُسجل في `SyncStatus` مع retry count وآخر خطأ.
