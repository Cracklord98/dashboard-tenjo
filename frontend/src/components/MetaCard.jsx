import React from "react";
import { formatNumber, calculatePercentage } from "../utils/calculations";

export default function MetaCard({ meta }) {
  const t1Percentage = calculatePercentage(meta.t1_ejec, meta.t1_plan);
  const t2Percentage = calculatePercentage(meta.t2_ejec, meta.t2_plan);
  const t3Percentage = calculatePercentage(meta.t3_ejec, meta.t3_plan);
  const t4Percentage = calculatePercentage(meta.t4_ejec, meta.t4_plan);
  const avgPercentage =
    meta.avance || calculatePercentage(meta.totalEjec, meta.totalPlan);

  const getStatusClass = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-error";
  };

  const getStatusBadge = (evaluacion) => {
    if (evaluacion === "Avance Alto")
      return "bg-green-50 text-success border border-success";
    if (evaluacion === "Avance Medio")
      return "bg-yellow-50 text-warning border border-warning";
    if (evaluacion === "Avance Bajo")
      return "bg-red-50 text-error border border-error";
    return "bg-gray-50 text-secondary border border-secondary";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-primary flex-1">
          {meta.metaProducto || meta.indicador}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
            meta.evaluacion
          )}`}
        >
          {meta.evaluacion}
        </span>
      </div>

      <div className="mb-4 space-y-1">
        {meta.nombre && (
          <p className="text-sm text-secondary">
            <span className="font-semibold">Proyecto:</span> {meta.nombre}
          </p>
        )}
        <p className="text-sm text-secondary">
          <span className="font-semibold">Programa:</span> {meta.programa}
        </p>
        {meta.eje && (
          <p className="text-xs text-secondary">
            <span className="font-semibold">Eje:</span> {meta.eje}
          </p>
        )}
        {meta.sectorPrograma && (
          <p className="text-xs text-secondary">
            <span className="font-semibold">Sector:</span> {meta.sectorPrograma}
          </p>
        )}
        {meta.dependenciaResponsable && (
          <p className="text-xs text-secondary">
            <span className="font-semibold">Dependencia:</span>{" "}
            {meta.dependenciaResponsable}
          </p>
        )}
        {meta.numeroMeta && (
          <p className="text-xs text-secondary">Meta #{meta.numeroMeta}</p>
        )}
        {meta.estadoProyecto && (
          <span className="inline-block mt-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
            {meta.estadoProyecto}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border-l-4 border-accent pl-3">
          <p className="text-xs text-secondary uppercase font-semibold mb-1">
            T1 2025
          </p>
          <p className={`text-xl font-bold ${getStatusClass(t1Percentage)}`}>
            {t1Percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-secondary mt-1">
            {formatNumber(meta.t1_ejec)} / {formatNumber(meta.t1_plan)}
          </p>
        </div>

        <div className="border-l-4 border-success pl-3">
          <p className="text-xs text-secondary uppercase font-semibold mb-1">
            T2 2025
          </p>
          <p className={`text-xl font-bold ${getStatusClass(t2Percentage)}`}>
            {t2Percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-secondary mt-1">
            {formatNumber(meta.t2_ejec)} / {formatNumber(meta.t2_plan)}
          </p>
        </div>

        <div className="border-l-4 border-warning pl-3">
          <p className="text-xs text-secondary uppercase font-semibold mb-1">
            T3 2025
          </p>
          <p className={`text-xl font-bold ${getStatusClass(t3Percentage)}`}>
            {t3Percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-secondary mt-1">
            {formatNumber(meta.t3_ejec)} / {formatNumber(meta.t3_plan)}
          </p>
        </div>

        <div className="border-l-4 border-error pl-3">
          <p className="text-xs text-secondary uppercase font-semibold mb-1">
            T4 2025
          </p>
          <p className={`text-xl font-bold ${getStatusClass(t4Percentage)}`}>
            {t4Percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-secondary mt-1">
            {formatNumber(meta.t4_ejec)} / {formatNumber(meta.t4_plan)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">Avance Total 2025</span>
          <span
            className={`text-lg font-bold ${getStatusClass(avgPercentage)}`}
          >
            {avgPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent to-success h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(avgPercentage, 100)}%` }}
            />
          </div>
          <span className="text-xs text-secondary whitespace-nowrap">
            {formatNumber(meta.totalEjec)} / {formatNumber(meta.totalPlan)}
          </span>
        </div>
      </div>
    </div>
  );
}
