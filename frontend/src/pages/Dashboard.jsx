import React from "react";
import { Link } from "react-router-dom";
import { useMetasData } from "../hooks/useMetasData";
import MetricCard from "../components/MetricCard";
import PerformanceChart from "../components/PerformanceChart";
import DistributionChart from "../components/DistributionChart";
import ProgramsTable from "../components/ProgramsTable";
import { formatNumber, formatCurrency } from "../utils/calculations";

export default function Dashboard() {
  const { data, loading, error } = useMetasData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-red-50 border border-error text-error px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error al cargar datos</h3>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Asegúrate de que el backend esté ejecutándose en el puerto 3002
          </p>
        </div>
      </div>
    );
  }

  const metrics = data?.globalMetrics;

  return (
    <div className="min-h-screen pb-12 bg-background">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              📊 DASHBOARD PLAN DE DESARROLLO 2024-2027 TENJO
            </h1>
          
            <nav className="flex gap-2">
              <Link to="/" className="nav-link active">
                Dashboard
              </Link>
              <Link to="/metas" className="nav-link text-white">
                Metas
              </Link>
              <Link to="/finanzas" className="nav-link text-white">
                Finanzas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Metrics Cards */}
        <div className="mb-8 animate-fade-in">
          {/* Cumplimiento Global */}
          <div className="mb-6">
            <MetricCard
              title="Cumplimiento Global 2025"
              value={`${metrics?.cumplimiento_global}%`}
              icon="🎯"
              color="accent"
              progress={metrics?.cumplimiento_global}
              subtitle={`${formatCurrency(
                metrics?.total_ejec
              )} / ${formatCurrency(metrics?.total_plan)}`}
            />
          </div>

          {/* Trimestres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="T1 - Trimestre 1"
              value={`${metrics?.cumplimiento_t1}%`}
              icon="📈"
              color="success"
              progress={metrics?.cumplimiento_t1}
              subtitle={`${formatCurrency(
                metrics?.total_t1_ejec
              )} / ${formatCurrency(metrics?.total_t1_plan)}`}
            />
            <MetricCard
              title="T2 - Trimestre 2"
              value={`${metrics?.cumplimiento_t2}%`}
              icon="📊"
              color="accent"
              progress={metrics?.cumplimiento_t2}
              subtitle={`${formatCurrency(
                metrics?.total_t2_ejec
              )} / ${formatCurrency(metrics?.total_t2_plan)}`}
            />
            <MetricCard
              title="T3 - Trimestre 3"
              value={`${metrics?.cumplimiento_t3}%`}
              icon="📉"
              color="warning"
              progress={metrics?.cumplimiento_t3}
              subtitle={`${formatCurrency(
                metrics?.total_t3_ejec
              )} / ${formatCurrency(metrics?.total_t3_plan)}`}
            />
            <MetricCard
              title="T4 - Trimestre 4"
              value={`${metrics?.cumplimiento_t4}%`}
              icon="📋"
              color="error"
              progress={metrics?.cumplimiento_t4}
              subtitle={`${formatCurrency(
                metrics?.total_t4_ejec
              )} / ${formatCurrency(metrics?.total_t4_plan)}`}
            />
          </div>
        </div>

        {/* Total Metas Card */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-accent">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-secondary font-medium">
                  Total de Metas del Plan Indicativo 2025
                </p>
                <p className="text-4xl font-bold text-primary mt-2">
                  {formatNumber(metrics?.total_metas)}
                </p>
              </div>
              <div className="text-6xl">📋</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="chart-container animate-slide-in">
            <h2 className="text-xl font-bold text-primary mb-4">
              📊 Cumplimiento por Trimestre y Programa
            </h2>
            <PerformanceChart programPerformance={data?.programPerformance} />
          </div>

          <div
            className="chart-container animate-slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-xl font-bold text-primary mb-4">
              🎯 Distribución por Nivel de Avance
            </h2>
            <DistributionChart programPerformance={data?.programPerformance} />
          </div>
        </div>

        {/* Programs Table */}
        <div
          className="chart-container animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-xl font-bold text-primary mb-4">
            📋 Detalle por Programa
          </h2>
          <ProgramsTable programs={data?.programPerformance} />
        </div>

        {/* Footer Info */}
        {data?.metadata && (
          <footer className="mt-12 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg overflow-hidden">
            <div className="bg-white bg-opacity-95 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Última Actualización */}
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">🕐</div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      Última Actualización
                    </h3>
                    <p className="text-secondary text-sm">
                      {new Date(data.metadata.lastUpdated).toLocaleString(
                        "es-CO",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Fuente de Datos */}
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">📄</div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      Fuente de Datos
                    </h3>
                    <p className="text-secondary text-sm">
                      {data.metadata.source}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Análisis T3-T4 2025
                    </p>
                  </div>
                </div>

                {/* Entidad */}
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">🏛️</div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      Entidad Responsable
                    </h3>
                    <p className="text-secondary text-sm font-medium">
                      Secretaría de Planeación
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Alcaldía Municipal de Tenjo, Cundinamarca
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                  <p>
                    © {new Date().getFullYear()} Alcaldía de Tenjo. Todos los
                    derechos reservados.
                  </p>
                  <p className="mt-2 md:mt-0">
                    Dashboard desarrollado para el seguimiento del Plan
                    Indicativo 2025
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
