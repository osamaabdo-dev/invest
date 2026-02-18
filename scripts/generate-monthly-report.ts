import { generateMonthlyReport } from "@/lib/domain/report-service";

const month = process.argv[2] ?? new Date().toISOString().slice(0, 7);

generateMonthlyReport(month)
  .then((report) => {
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
