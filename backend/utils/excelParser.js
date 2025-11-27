import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse Excel file and convert to JSON
 * @param {string} filename - Name of the Excel file
 * @returns {Object} Parsed data with metas and metadata
 */
export function parseExcelToJSON(filename = "PLAN INDICATIVO TENJO.xlsx") {
  try {
    const filePath = join(__dirname, "../data", filename);
    console.log("📂 Intentando leer archivo Excel desde:", filePath);

    const workbook = xlsx.readFile(filePath);
    console.log("✅ Archivo Excel leído correctamente");
    console.log("📊 Hojas disponibles:", workbook.SheetNames);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log("📄 Usando hoja:", sheetName);

    // Convert to JSON
    const rawData = xlsx.utils.sheet_to_json(worksheet);
    console.log("📋 Filas encontradas:", rawData.length);
    if (rawData.length > 0) {
      console.log(
        "🔑 Columnas detectadas:",
        Object.keys(rawData[0]).slice(0, 10).join(", ") + "..."
      );
    }

    // Transform data to match expected structure for Tenjo
    const metas = rawData.map((row, index) => {
      // Parse numbers safely
      const parseNum = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        // Remove commas and parse
        const cleaned = String(value).replace(/,/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      };

      // Parse T1-T4 values for 2025
      const t1_plan = parseNum(
        row["T1 PLANEADO 2025"] || row["T1. PLANEADO 2025"] || 0
      );
      const t1_ejec = parseNum(
        row["T1 EJECUTADO 2025"] || row["T1. EJECUTADO 2025"] || 0
      );
      const t2_plan = parseNum(
        row["T2 PLANEADO 2025"] || row["T2. PLANEADO 2025"] || 0
      );
      const t2_ejec = parseNum(
        row["T2 EJECUTADO 2025"] || row["T2. EJECUTADO 2025"] || 0
      );
      const t3_plan = parseNum(
        row["T3 PLANEADO 2025"] || row["T3. PLANEADO 2025"] || 0
      );
      const t3_ejec = parseNum(
        row["T3 EJECUTADO 2025"] || row["T3. EJECUTADO 2025"] || 0
      );
      const t4_plan = parseNum(
        row["T4 PLANEADO 2025"] || row["T4. PLANEADO 2025"] || 0
      );
      const t4_ejec = parseNum(
        row["T4 EJECUTADO 2025"] || row["T4. EJECUTADO 2025"] || 0
      );

      // Calculate totals
      const totalPlanExcel = parseNum(row["TOTAL PLANEADO 2025"] || 0);
      const totalEjecExcel = parseNum(row["TOTAL EJECUTADO 2025"] || 0);

      const calculatedTotalPlan = t1_plan + t2_plan + t3_plan + t4_plan;
      const calculatedTotalEjec = t1_ejec + t2_ejec + t3_ejec + t4_ejec;

      const totalPlan = totalPlanExcel || calculatedTotalPlan;
      const totalEjec = totalEjecExcel || calculatedTotalEjec;

      // Calculate avance
      let avanceExcel = parseNum(row["AVANCE 2025"] || 0);

      // If avance is between 0 and 1, convert to percentage
      if (avanceExcel > 0 && avanceExcel <= 1) {
        avanceExcel = avanceExcel * 100;
      }

      // Handle errors: if avance is greater than 100 or negative, recalculate
      if (avanceExcel > 100 || avanceExcel < 0) {
        avanceExcel = totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0;
      }

      const avance =
        avanceExcel || (totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0);

      // Parse financial data
      const apropiacionDefinitiva = parseNum(
        row["APROPIACION DEFINITIVA 2025"] || 0
      );
      const compromisos = parseNum(row["COMPROMISOS 2025"] || 0);
      const pagos = parseNum(row["PAGOS 2025"] || 0);
      const ejecucionFinanciera = parseNum(row["% EJECUCIÓN FINANCIERA"] || 0);

      return {
        id: row["COD. INT. (Meta)"] || row["COD META PRODUCTO"] || index + 1,
        // Estructura jerárquica
        eje: (row.EJE || "").trim(),
        ponderadorEje: parseNum(row["PONDERADOR EJE"] || 0),
        nombreSector: row["NOMBRE DE SECTOR"] || "",
        sectorMga: row["SECTOR MGA"] || "",
        programaMga: row["PROGRAMA MGA"] || "",
        codIntPrograma: row["COD. INT. PROGRAMA"] || "",
        programaPdt: row["PROGRAMA PDT"] || "",
        codSubprograma: row["COD SUBPROGRAMA"] || "",
        codIntSubprograma: row["COD. INT. SUBPROGRAMA"] || "",
        subprograma: row.SUBPROGRAMA || "",

        // Metas de Resultado
        codIntMeta: row["COD. INT. (Meta)"] || "",
        metaResultado:
          row["MR / META DE RESULTADO"] || row["META DE RESULTADO"] || "",
        indicadorResultado: row["INDICADOR DE RESULTADO"] || "",
        lineaBase: parseNum(row["L.B"] || row["L.B (Linea Base)"] || 0),

        // Proyecto
        productoMga: row["PRODUCTO MGA"] || "",
        bpin: row.BPIN || "",
        nombreProyecto: row["NOMBRE DEL PROYECTO"] || "",

        // Meta de Producto
        codMetaProducto: row["COD META PRODUCTO"] || "",
        metaProducto: row["META DE PRODUCTO"] || "",
        lineaBaseProducto: row["L.B (Producto)"] || "",
        unidadMedida: row["UNIDAD DE MEDIDA"] || "",
        tendenciaIndicador: row["TENDENCIA INDICADOR"] || "",
        indicador: row.INDICADOR || "",
        responsable: row.RESPONSABLE || "",
        pactoPorNinez: row["PACTO POR LA NIÑEZ"] || "",

        // Avance físico
        valorEsperadoCuatrienio: parseNum(
          row["VALOR ESPERADO CUATRIENIO"] || 0
        ),
        porcentajeEjecutadoVsCuatrienio: parseNum(
          row["% TOTAL EJECUTADO (Año) VS CUATRIENIO"] || 0
        ),
        valorEsperado2025: parseNum(row["VALOR ESPERADO 2025"] || 0),

        // Trimestres
        t1_plan,
        t1_ejec,
        t2_plan,
        t2_ejec,
        t3_plan,
        t3_ejec,
        t4_plan,
        t4_ejec,
        totalPlan,
        totalEjec,
        avance,

        estado: row.ESTADO || "",
        soportesCumplimiento: row["SOPORTES DE CUMPLIMIENTO"] || "",

        // Datos financieros
        apropiacionDefinitiva,
        compromisos,
        pagos,
        ejecucionFinanciera:
          ejecucionFinanciera > 0 && ejecucionFinanciera <= 1
            ? ejecucionFinanciera * 100
            : ejecucionFinanciera,
        planFinancieroPdm: parseNum(row["PLAN FINANCIERO PDM 2024-2027"] || 0),

        // Clasificación para compatibilidad
        programa: row["PROGRAMA PDT"] || row.SUBPROGRAMA || "Sin Programa",
        evaluacion: calculateEvaluation(avance),
      };
    });

    console.log("✅ Datos transformados correctamente");
    console.log("📊 Total de metas procesadas:", metas.length);
    if (metas.length > 0) {
      console.log("🔍 Primera meta de ejemplo:", {
        id: metas[0].id,
        indicador: metas[0].indicador?.substring(0, 50),
        programa: metas[0].programa,
        t1_plan: metas[0].t1_plan,
        t1_ejec: metas[0].t1_ejec,
        avance: metas[0].avance,
      });
    }

    return {
      metas,
      metadata: {
        totalMetas: metas.length,
        lastUpdated: new Date().toISOString(),
        source: filename,
      },
    };
  } catch (error) {
    console.error("❌ Error parsing Excel file:", error);
    console.error("📍 Error details:", error.message);
    console.error(
      "📂 File path attempted:",
      join(__dirname, "../data", filename)
    );
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Calculate evaluation based on performance
 */
function calculateEvaluation(avance) {
  if (avance >= 90) return "Avance Alto";
  if (avance >= 70) return "Avance Medio";
  if (avance > 0) return "Avance Bajo";
  return "Sin Programación";
}

/**
 * Calculate global metrics from metas data
 */
export function calculateGlobalMetrics(metas) {
  let totalT1Plan = 0,
    totalT1Ejec = 0;
  let totalT2Plan = 0,
    totalT2Ejec = 0;
  let totalT3Plan = 0,
    totalT3Ejec = 0;
  let totalT4Plan = 0,
    totalT4Ejec = 0;
  let totalPlan = 0,
    totalEjec = 0;

  metas.forEach((meta) => {
    totalT1Plan += meta.t1_plan;
    totalT1Ejec += meta.t1_ejec;
    totalT2Plan += meta.t2_plan;
    totalT2Ejec += meta.t2_ejec;
    totalT3Plan += meta.t3_plan;
    totalT3Ejec += meta.t3_ejec;
    totalT4Plan += meta.t4_plan;
    totalT4Ejec += meta.t4_ejec;
    totalPlan += meta.totalPlan;
    totalEjec += meta.totalEjec;
  });

  const cumplimientoT1 =
    totalT1Plan > 0 ? (totalT1Ejec / totalT1Plan) * 100 : 0;
  const cumplimientoT2 =
    totalT2Plan > 0 ? (totalT2Ejec / totalT2Plan) * 100 : 0;
  const cumplimientoT3 =
    totalT3Plan > 0 ? (totalT3Ejec / totalT3Plan) * 100 : 0;
  const cumplimientoT4 =
    totalT4Plan > 0 ? (totalT4Ejec / totalT4Plan) * 100 : 0;
  const cumplimientoGlobal = totalPlan > 0 ? (totalEjec / totalPlan) * 100 : 0;

  return {
    cumplimiento_global: Number(cumplimientoGlobal.toFixed(1)),
    cumplimiento_t1: Number(cumplimientoT1.toFixed(1)),
    cumplimiento_t2: Number(cumplimientoT2.toFixed(1)),
    cumplimiento_t3: Number(cumplimientoT3.toFixed(1)),
    cumplimiento_t4: Number(cumplimientoT4.toFixed(1)),
    total_metas: metas.length,
    total_plan: totalPlan,
    total_ejec: totalEjec,
    total_t1_plan: totalT1Plan,
    total_t1_ejec: totalT1Ejec,
    total_t2_plan: totalT2Plan,
    total_t2_ejec: totalT2Ejec,
    total_t3_plan: totalT3Plan,
    total_t3_ejec: totalT3Ejec,
    total_t4_plan: totalT4Plan,
    total_t4_ejec: totalT4Ejec,
  };
}

/**
 * Calculate performance by program
 */
export function calculateProgramPerformance(metas) {
  const programs = {};

  metas.forEach((meta) => {
    const programa = meta.programa || "Sin Programa";

    if (!programs[programa]) {
      programs[programa] = {
        metas_count: 0,
        t1_plan: 0,
        t1_ejec: 0,
        t2_plan: 0,
        t2_ejec: 0,
        t3_plan: 0,
        t3_ejec: 0,
        t4_plan: 0,
        t4_ejec: 0,
        total_plan: 0,
        total_ejec: 0,
      };
    }

    programs[programa].metas_count++;
    programs[programa].t1_plan += meta.t1_plan;
    programs[programa].t1_ejec += meta.t1_ejec;
    programs[programa].t2_plan += meta.t2_plan;
    programs[programa].t2_ejec += meta.t2_ejec;
    programs[programa].t3_plan += meta.t3_plan;
    programs[programa].t3_ejec += meta.t3_ejec;
    programs[programa].t4_plan += meta.t4_plan;
    programs[programa].t4_ejec += meta.t4_ejec;
    programs[programa].total_plan += meta.totalPlan;
    programs[programa].total_ejec += meta.totalEjec;
  });

  // Calculate percentages
  Object.keys(programs).forEach((programa) => {
    const prog = programs[programa];
    prog.t1_cumplimiento =
      prog.t1_plan > 0
        ? Number(((prog.t1_ejec / prog.t1_plan) * 100).toFixed(1))
        : 0;
    prog.t2_cumplimiento =
      prog.t2_plan > 0
        ? Number(((prog.t2_ejec / prog.t2_plan) * 100).toFixed(1))
        : 0;
    prog.t3_cumplimiento =
      prog.t3_plan > 0
        ? Number(((prog.t3_ejec / prog.t3_plan) * 100).toFixed(1))
        : 0;
    prog.t4_cumplimiento =
      prog.t4_plan > 0
        ? Number(((prog.t4_ejec / prog.t4_plan) * 100).toFixed(1))
        : 0;
    prog.total_cumplimiento =
      prog.total_plan > 0
        ? Number(((prog.total_ejec / prog.total_plan) * 100).toFixed(1))
        : 0;
  });

  return programs;
}

/**
 * Calculate performance by Eje (Strategic Axis)
 */
export function calculateEjePerformance(metas) {
  const ejes = {};

  metas.forEach((meta) => {
    const eje = meta.eje || "Sin Eje";

    if (!ejes[eje]) {
      ejes[eje] = {
        metas_count: 0,
        ponderador: meta.ponderadorEje || 0,
        total_plan: 0,
        total_ejec: 0,
        apropiacion: 0,
        compromisos: 0,
        pagos: 0,
      };
    }

    ejes[eje].metas_count++;
    ejes[eje].total_plan += meta.totalPlan;
    ejes[eje].total_ejec += meta.totalEjec;
    ejes[eje].apropiacion += meta.apropiacionDefinitiva || 0;
    ejes[eje].compromisos += meta.compromisos || 0;
    ejes[eje].pagos += meta.pagos || 0;
  });

  // Calculate percentages
  Object.keys(ejes).forEach((eje) => {
    const ejeData = ejes[eje];
    ejeData.avance_fisico =
      ejeData.total_plan > 0
        ? Number(((ejeData.total_ejec / ejeData.total_plan) * 100).toFixed(1))
        : 0;
    ejeData.ejecucion_financiera =
      ejeData.apropiacion > 0
        ? Number(((ejeData.pagos / ejeData.apropiacion) * 100).toFixed(1))
        : 0;
  });

  return ejes;
}

/**
 * Calculate financial summary
 */
export function calculateFinancialSummary(metas) {
  let totalApropiacion = 0;
  let totalCompromisos = 0;
  let totalPagos = 0;
  let totalPlanFinanciero = 0;

  const byPrograma = {};
  const byEje = {};

  metas.forEach((meta) => {
    totalApropiacion += meta.apropiacionDefinitiva || 0;
    totalCompromisos += meta.compromisos || 0;
    totalPagos += meta.pagos || 0;
    totalPlanFinanciero += meta.planFinancieroPdm || 0;

    // By Program
    const programa = meta.programaPdt || "Sin Programa";
    if (!byPrograma[programa]) {
      byPrograma[programa] = {
        apropiacion: 0,
        compromisos: 0,
        pagos: 0,
      };
    }
    byPrograma[programa].apropiacion += meta.apropiacionDefinitiva || 0;
    byPrograma[programa].compromisos += meta.compromisos || 0;
    byPrograma[programa].pagos += meta.pagos || 0;

    // By Eje
    const eje = meta.eje || "Sin Eje";
    if (!byEje[eje]) {
      byEje[eje] = {
        apropiacion: 0,
        compromisos: 0,
        pagos: 0,
      };
    }
    byEje[eje].apropiacion += meta.apropiacionDefinitiva || 0;
    byEje[eje].compromisos += meta.compromisos || 0;
    byEje[eje].pagos += meta.pagos || 0;
  });

  // Calculate percentages
  Object.keys(byPrograma).forEach((programa) => {
    const prog = byPrograma[programa];
    prog.porcentaje_compromisos =
      prog.apropiacion > 0
        ? Number(((prog.compromisos / prog.apropiacion) * 100).toFixed(1))
        : 0;
    prog.porcentaje_pagos =
      prog.apropiacion > 0
        ? Number(((prog.pagos / prog.apropiacion) * 100).toFixed(1))
        : 0;
  });

  Object.keys(byEje).forEach((eje) => {
    const ejeData = byEje[eje];
    ejeData.porcentaje_compromisos =
      ejeData.apropiacion > 0
        ? Number(((ejeData.compromisos / ejeData.apropiacion) * 100).toFixed(1))
        : 0;
    ejeData.porcentaje_pagos =
      ejeData.apropiacion > 0
        ? Number(((ejeData.pagos / ejeData.apropiacion) * 100).toFixed(1))
        : 0;
  });

  return {
    total: {
      apropiacion: totalApropiacion,
      compromisos: totalCompromisos,
      pagos: totalPagos,
      plan_financiero: totalPlanFinanciero,
      porcentaje_compromisos:
        totalApropiacion > 0
          ? Number(((totalCompromisos / totalApropiacion) * 100).toFixed(1))
          : 0,
      porcentaje_pagos:
        totalApropiacion > 0
          ? Number(((totalPagos / totalApropiacion) * 100).toFixed(1))
          : 0,
    },
    by_programa: byPrograma,
    by_eje: byEje,
  };
}
