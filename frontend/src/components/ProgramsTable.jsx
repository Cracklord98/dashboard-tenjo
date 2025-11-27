import React from "react";
import { formatNumber } from "../utils/calculations";

export default function ProgramsTable({ programs }) {
  if (!programs || Object.keys(programs).length === 0) {
    return (
      <div className="text-center text-secondary">No hay datos disponibles</div>
    );
  }

  const programsArray = Object.entries(programs).map(([name, data]) => ({
    name,
    ...data,
  }));

  const getStatusClass = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-error";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
              Programa
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              Metas
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              T1 %
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              T2 %
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              T3 %
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              T4 %
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">
              Total %
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {programsArray.map((program, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">
                {program.name}
              </td>
              <td className="px-6 py-4 text-sm text-center text-secondary">
                {program.metas_count}
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`font-semibold ${getStatusClass(
                    program.t1_cumplimiento || 0
                  )}`}
                >
                  {(program.t1_cumplimiento || 0).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`font-semibold ${getStatusClass(
                    program.t2_cumplimiento || 0
                  )}`}
                >
                  {(program.t2_cumplimiento || 0).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`font-semibold ${getStatusClass(
                    program.t3_cumplimiento || 0
                  )}`}
                >
                  {(program.t3_cumplimiento || 0).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`font-semibold ${getStatusClass(
                    program.t4_cumplimiento || 0
                  )}`}
                >
                  {(program.t4_cumplimiento || 0).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-center">
                <span
                  className={`font-bold ${getStatusClass(
                    program.total_cumplimiento || 0
                  )}`}
                >
                  {(program.total_cumplimiento || 0).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
