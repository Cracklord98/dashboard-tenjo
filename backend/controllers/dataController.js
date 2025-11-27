import {
  parseExcelToJSON,
  calculateGlobalMetrics,
  calculateProgramPerformance,
  calculateEjePerformance,
  calculateFinancialSummary,
} from "../utils/excelParser.js";

let cachedData = null;

/**
 * Load and cache data from Excel
 */
function loadData() {
  if (!cachedData) {
    console.log("🔄 Cargando datos desde Excel (primera vez)...");
    const { metas, metadata } = parseExcelToJSON();
    console.log("📊 Calculando métricas globales...");
    const globalMetrics = calculateGlobalMetrics(metas);
    console.log("📈 Calculando performance por programa...");
    const programPerformance = calculateProgramPerformance(metas);
    console.log("🎯 Calculando performance por eje...");
    const ejePerformance = calculateEjePerformance(metas);
    console.log("💰 Calculando resumen financiero...");
    const financialSummary = calculateFinancialSummary(metas);

    cachedData = {
      metas,
      global_metrics: globalMetrics,
      program_performance: programPerformance,
      eje_performance: ejePerformance,
      financial_summary: financialSummary,
      metadata,
    };
    console.log("✅ Datos cargados y cacheados exitosamente");
    console.log("📋 Total metas:", metas.length);
    console.log(
      "🎯 Cumplimiento global:",
      globalMetrics.cumplimiento_global + "%"
    );
  } else {
    console.log("⚡ Usando datos cacheados");
  }
  return cachedData;
}

/**
 * Get all metas data
 */
export function getMetasData(req, res) {
  try {
    const data = loadData();
    res.json({
      success: true,
      data: data.metas,
      metadata: data.metadata,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get global metrics
 */
export function getGlobalMetrics(req, res) {
  try {
    const data = loadData();
    res.json({
      success: true,
      data: data.global_metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get program performance
 */
export function getProgramPerformance(req, res) {
  try {
    const data = loadData();
    res.json({
      success: true,
      data: data.program_performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get eje (strategic axis) performance
 */
export function getEjePerformance(req, res) {
  try {
    const data = loadData();
    res.json({
      success: true,
      data: data.eje_performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get financial summary
 */
export function getFinancialSummary(req, res) {
  try {
    const data = loadData();
    res.json({
      success: true,
      data: data.financial_summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Force reload data from Excel (clear cache)
 */
export function reloadData(req, res) {
  try {
    cachedData = null;
    const data = loadData();
    res.json({
      success: true,
      message: "Datos recargados exitosamente",
      metadata: data.metadata,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
