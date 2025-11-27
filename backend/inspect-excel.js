import XLSX from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const filePath = join(__dirname, "data", "PLAN INDICATIVO TENJO.xlsx");
  console.log("📂 Reading:", filePath);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  console.log("📊 Sheet:", sheetName);

  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log("\n🔍 Total rows:", jsonData.length);
  console.log("\n📋 Columns in first row:");
  if (jsonData.length > 0) {
    Object.keys(jsonData[0]).forEach((key, idx) => {
      console.log(`  ${idx + 1}. "${key}"`);
    });

    console.log("\n🎯 First 3 rows sample data:");
    jsonData.slice(0, 3).forEach((row, idx) => {
      console.log(`\nRow ${idx + 1}:`);
      console.log(
        "  programa:",
        row["ESTADO PROGRAMA DO-NO-DO PROGRAMA"] ||
          row.PROGRAMA ||
          row.ESTADO ||
          "(empty)"
      );
      console.log("  sectorPrograma:", row["SECTOR PROGRAMA"] || "(empty)");
      console.log(
        "  indicador:",
        row["INDICADOR"]?.substring(0, 50) || "(empty)"
      );
      console.log("  avance:", row["% TOTAL AVANCE 2025"] || row.AVANCE || 0);
    });
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
