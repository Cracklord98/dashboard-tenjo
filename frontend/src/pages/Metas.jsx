import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMetasData } from "../hooks/useMetasData";
import MetaCard from "../components/MetaCard";
import MultiSelectFilter from "../components/MultiSelectFilter";

export default function Metas() {
  const { data, loading, error } = useMetasData();
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedEvaluations, setSelectedEvaluations] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [selectedResponsables, setSelectedResponsables] = useState([]);
  const [selectedMetasProducto, setSelectedMetasProducto] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique programs
  const programs = useMemo(() => {
    if (!data?.metas) return [];
    const uniquePrograms = [
      ...new Set(data.metas.map((meta) => meta.programa)),
    ];
    return uniquePrograms.sort();
  }, [data]);

  // Get unique responsables
  const responsables = useMemo(() => {
    if (!data?.metas) return [];
    const uniqueResponsables = [
      ...new Set(
        data.metas
          .map((meta) => meta.dependenciaResponsable)
          .filter((r) => r && r.trim() !== "")
      ),
    ];
    return uniqueResponsables.sort();
  }, [data]);

  // Get unique metas de producto
  const metasProducto = useMemo(() => {
    if (!data?.metas) return [];
    const uniqueMetasProducto = [
      ...new Set(
        data.metas
          .map((meta) => meta.metaProducto)
          .filter((m) => m && m.trim() !== "")
      ),
    ];
    return uniqueMetasProducto.sort();
  }, [data]);

  // Filter metas
  const filteredMetas = useMemo(() => {
    if (!data?.metas) return [];

    return data.metas.filter((meta) => {
      const matchesProgram =
        selectedPrograms.length === 0 ||
        selectedPrograms.includes(meta.programa);
      const matchesEvaluation =
        selectedEvaluations.length === 0 ||
        selectedEvaluations.includes(meta.evaluacion);
      const matchesEstado =
        selectedEstados.length === 0 ||
        selectedEstados.includes(meta.estadoProyecto);
      const matchesResponsable =
        selectedResponsables.length === 0 ||
        selectedResponsables.includes(meta.dependenciaResponsable);
      const matchesMetaProducto =
        selectedMetasProducto.length === 0 ||
        selectedMetasProducto.includes(meta.metaProducto);
      const matchesSearch =
        meta.indicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (meta.nombre &&
          meta.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (meta.metaProducto &&
          meta.metaProducto.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        matchesProgram &&
        matchesEvaluation &&
        matchesEstado &&
        matchesResponsable &&
        matchesMetaProducto &&
        matchesSearch
      );
    });
  }, [
    data,
    selectedPrograms,
    selectedEvaluations,
    selectedEstados,
    selectedResponsables,
    selectedMetasProducto,
    searchTerm,
  ]);

  // Count by evaluation
  const evaluationCounts = useMemo(() => {
    if (!data?.metas) return {};

    return data.metas.reduce((acc, meta) => {
      acc[meta.evaluacion] = (acc[meta.evaluacion] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-primary text-xl">Cargando metas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-red-50 border border-error text-error px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error al cargar datos</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              🎯 Metas del Plan Indicativo - Tenjo
            </h1>
            <nav className="flex gap-2">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/metas"
                className="px-4 py-2 rounded-lg bg-white/20 text-white font-semibold"
              >
                Metas
              </Link>
              <Link
                to="/finanzas"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                Finanzas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-accent">
            <p className="text-sm text-secondary mb-1">Total Metas</p>
            <p className="text-3xl font-bold text-accent">
              {data?.metas?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-success">
            <p className="text-sm text-secondary mb-1">Avance Alto</p>
            <p className="text-3xl font-bold text-success">
              {evaluationCounts["Avance Alto"] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-warning">
            <p className="text-sm text-secondary mb-1">Avance Medio</p>
            <p className="text-3xl font-bold text-warning">
              {evaluationCounts["Avance Medio"] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border-l-4 border-error">
            <p className="text-sm text-secondary mb-1">Avance Bajo</p>
            <p className="text-3xl font-bold text-error">
              {evaluationCounts["Avance Bajo"] || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              🔍 Filtros de Búsqueda
            </h2>
            {(selectedPrograms.length > 0 ||
              selectedEvaluations.length > 0 ||
              selectedEstados.length > 0 ||
              selectedResponsables.length > 0 ||
              selectedMetasProducto.length > 0 ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSelectedPrograms([]);
                  setSelectedEvaluations([]);
                  setSelectedEstados([]);
                  setSelectedResponsables([]);
                  setSelectedMetasProducto([]);
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors font-medium shadow-sm"
              >
                🗑️ Limpiar todo
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, indicador, programa o meta de producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-accent focus:border-accent transition-all text-base shadow-sm"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Multi-Select Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MultiSelectFilter
              label="Programa"
              icon="📊"
              options={programs}
              selectedValues={selectedPrograms}
              onChange={setSelectedPrograms}
            />

            <MultiSelectFilter
              label="Meta de Producto"
              icon="🎯"
              options={metasProducto}
              selectedValues={selectedMetasProducto}
              onChange={setSelectedMetasProducto}
            />

            <MultiSelectFilter
              label="Evaluación"
              icon="⭐"
              options={[
                "Avance Alto",
                "Avance Medio",
                "Avance Bajo",
                "Sin Programación",
              ]}
              selectedValues={selectedEvaluations}
              onChange={setSelectedEvaluations}
            />

            <MultiSelectFilter
              label="Estado"
              icon="📌"
              options={["PROGRAMADO", "NO PROGRAMADO"]}
              selectedValues={selectedEstados}
              onChange={setSelectedEstados}
            />

            <MultiSelectFilter
              label="Responsable"
              icon="👥"
              options={responsables}
              selectedValues={selectedResponsables}
              onChange={setSelectedResponsables}
            />
          </div>

          {/* Active Filters Summary */}
          <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-accent shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-sm text-secondary font-medium">
                    Resultados de búsqueda
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {filteredMetas.length} de {data?.metas?.length || 0} metas
                  </p>
                </div>
              </div>
              {(selectedPrograms.length > 0 ||
                selectedEvaluations.length > 0 ||
                selectedEstados.length > 0 ||
                selectedResponsables.length > 0 ||
                selectedMetasProducto.length > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {selectedPrograms.length > 0 && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      📊 {selectedPrograms.length} programas
                    </span>
                  )}
                  {selectedMetasProducto.length > 0 && (
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">
                      🎯 {selectedMetasProducto.length} metas
                    </span>
                  )}
                  {selectedEvaluations.length > 0 && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      ⭐ {selectedEvaluations.length} evaluaciones
                    </span>
                  )}
                  {selectedEstados.length > 0 && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                      📌 {selectedEstados.length} estados
                    </span>
                  )}
                  {selectedResponsables.length > 0 && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                      👥 {selectedResponsables.length} responsables
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metas Grid */}
        {filteredMetas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-200">
            <p className="text-secondary text-lg">
              No se encontraron metas con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetas.map((meta, index) => (
              <MetaCard key={index} meta={meta} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
