import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, formatNumber } from "../utils/calculations";
import MultiSelectFilter from "../components/MultiSelectFilter";

export default function Finanzas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ejes"); // ejes, programas
  const [selectedEjes, setSelectedEjes] = useState([]);
  const [selectedProgramas, setSelectedProgramas] = useState([]);
  const [selectedMetasProducto, setSelectedMetasProducto] = useState([]);
  const [selectedResponsables, setSelectedResponsables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metasData, setMetasData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3002/api/financial/summary").then((res) => res.json()),
      fetch("http://localhost:3002/api/metas").then((res) => res.json())
    ])
      .then(([financialResult, metasResult]) => {
        setData(financialResult.data);
        setMetasData(metasResult.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get unique ejes and programas - MUST be called before any conditional returns
  const ejesList = useMemo(() => {
    if (!data?.by_eje) return [];
    return Object.keys(data.by_eje).sort();
  }, [data]);

  const programasList = useMemo(() => {
    if (!data?.by_programa) return [];
    return Object.keys(data.by_programa).sort();
  }, [data]);

  const metasProductoList = useMemo(() => {
    if (!metasData || metasData.length === 0) return [];
    const uniqueMetas = [...new Set(
      metasData
        .map(meta => meta.metaProducto)
        .filter(m => m && m.trim() !== "")
    )];
    return uniqueMetas.sort();
  }, [metasData]);

  const responsablesList = useMemo(() => {
    if (!metasData || metasData.length === 0) return [];
    const uniqueResponsables = [...new Set(
      metasData
        .map(meta => meta.responsable)
        .filter(r => r && r.trim() !== "")
    )];
    return uniqueResponsables.sort();
  }, [metasData]);

  // Filter ejes
  const filteredEjes = useMemo(() => {
    if (!data?.by_eje) return {};

    let filtered = Object.entries(data.by_eje);

    if (selectedEjes.length > 0) {
      filtered = filtered.filter(([eje]) => selectedEjes.includes(eje));
    }

    // Filter by meta producto
    if (selectedMetasProducto.length > 0 && metasData.length > 0) {
      const ejesWithMetas = new Set(
        metasData
          .filter(meta => selectedMetasProducto.includes(meta.metaProducto))
          .map(meta => meta.eje)
          .filter(Boolean)
      );
      filtered = filtered.filter(([eje]) => ejesWithMetas.has(eje));
    }

    // Filter by responsable
    if (selectedResponsables.length > 0 && metasData.length > 0) {
      const ejesWithResponsables = new Set(
        metasData
          .filter(meta => selectedResponsables.includes(meta.responsable))
          .map(meta => meta.eje)
          .filter(Boolean)
      );
      filtered = filtered.filter(([eje]) => ejesWithResponsables.has(eje));
    }

    if (searchTerm) {
      filtered = filtered.filter(([eje]) =>
        eje.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return Object.fromEntries(filtered);
  }, [data, selectedEjes, selectedMetasProducto, selectedResponsables, searchTerm, metasData]);

  // Filter programas
  const filteredProgramas = useMemo(() => {
    if (!data?.by_programa) return {};

    let filtered = Object.entries(data.by_programa);

    if (selectedProgramas.length > 0) {
      filtered = filtered.filter(([programa]) =>
        selectedProgramas.includes(programa)
      );
    }

    // Filter by meta producto
    if (selectedMetasProducto.length > 0 && metasData.length > 0) {
      const programasWithMetas = new Set(
        metasData
          .filter(meta => selectedMetasProducto.includes(meta.metaProducto))
          .map(meta => meta.programaPdt || meta.programa)
          .filter(Boolean)
      );
      filtered = filtered.filter(([programa]) => programasWithMetas.has(programa));
    }

    // Filter by responsable
    if (selectedResponsables.length > 0 && metasData.length > 0) {
      const programasWithResponsables = new Set(
        metasData
          .filter(meta => selectedResponsables.includes(meta.responsable))
          .map(meta => meta.programaPdt || meta.programa)
          .filter(Boolean)
      );
      filtered = filtered.filter(([programa]) => programasWithResponsables.has(programa));
    }

    if (searchTerm) {
      filtered = filtered.filter(([programa]) =>
        programa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return Object.fromEntries(filtered);
  }, [data, selectedProgramas, selectedMetasProducto, selectedResponsables, searchTerm, metasData]);

  const clearFilters = () => {
    setSelectedEjes([]);
    setSelectedProgramas([]);
    setSelectedMetasProducto([]);
    setSelectedResponsables([]);
    setSearchTerm("");
  };

  // Conditional returns AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary text-xl">Cargando datos financieros...</p>
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
        </div>
      </div>
    );
  }

  const { total, by_eje, by_programa } = data;

  return (
    <div className="min-h-screen pb-12 bg-background">
      {/* Header */}
      <header className="bg-primary shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                💰 EJECUCIÓN FINANCIERA 2025 - TENJO
              </h1>
              <p className="text-gray-200 mt-1">
                ALCALDÍA DE TENJO, CUNDINAMARCA
              </p>
            </div>
            <nav className="flex gap-2">
              <Link to="/" className="nav-link text-white">
                Dashboard
              </Link>
              <Link to="/metas" className="nav-link text-white">
                Metas
              </Link>
              <Link to="/finanzas" className="nav-link active">
                Finanzas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Resumen General */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            📊 Resumen General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Apropiación Definitiva */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  APROPIACIÓN DEFINITIVA
                </h3>
                <span className="text-2xl">💼</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(total.apropiacion)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Presupuesto total 2025
              </p>
            </div>

            {/* Compromisos */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-accent">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  COMPROMISOS
                </h3>
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-3xl font-bold text-accent">
                {formatCurrency(total.compromisos)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {total.porcentaje_compromisos}% del presupuesto
              </p>
            </div>

            {/* Pagos */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-success">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  PAGOS REALIZADOS
                </h3>
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(total.pagos)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {total.porcentaje_pagos}% del presupuesto
              </p>
            </div>

            {/* Plan Financiero PDM */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  PLAN FINANCIERO PDM
                </h3>
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-3xl font-bold text-secondary">
                {formatCurrency(total.plan_financiero)}
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-2027</p>
            </div>
          </div>

          {/* Barra de progreso de ejecución */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-bold text-primary mb-4">
              Ejecución Presupuestal
            </h3>
            <div className="space-y-4">
              {/* Compromisos */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Compromisos
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {total.porcentaje_compromisos}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-accent rounded-full h-3 transition-all duration-500"
                    style={{
                      width: `${Math.min(total.porcentaje_compromisos, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Pagos */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Pagos
                  </span>
                  <span className="text-sm font-bold text-success">
                    {total.porcentaje_pagos}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-success rounded-full h-3 transition-all duration-500"
                    style={{
                      width: `${Math.min(total.porcentaje_pagos, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-primary mb-4">🔍 Filtros</h2>

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre de eje o programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Eje */}
            <MultiSelectFilter
              label="Filtrar por Eje Estratégico"
              options={ejesList}
              selectedValues={selectedEjes}
              onChange={setSelectedEjes}
              placeholder="Todos los ejes"
            />

            {/* Filtro por Programa */}
            <MultiSelectFilter
              label="Filtrar por Programa"
              options={programasList}
              selectedValues={selectedProgramas}
              onChange={setSelectedProgramas}
              placeholder="Todos los programas"
            />

            {/* Filtro por Meta Producto */}
            <MultiSelectFilter
              label="Filtrar por Meta de Producto"
              options={metasProductoList}
              selectedValues={selectedMetasProducto}
              onChange={setSelectedMetasProducto}
              placeholder="Todas las metas"
            />

            {/* Filtro por Responsable */}
            <MultiSelectFilter
              label="Filtrar por Responsable"
              options={responsablesList}
              selectedValues={selectedResponsables}
              onChange={setSelectedResponsables}
              placeholder="Todos los responsables"
            />
          </div>

          {/* Botón de limpiar filtros y contador */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {activeTab === "ejes" && (
                <>
                  Mostrando{" "}
                  <span className="font-bold text-primary">
                    {Object.keys(filteredEjes).length}
                  </span>{" "}
                  de <span className="font-bold">{ejesList.length}</span> ejes
                </>
              )}
              {activeTab === "programas" && (
                <>
                  Mostrando{" "}
                  <span className="font-bold text-primary">
                    {Object.keys(filteredProgramas).length}
                  </span>{" "}
                  de <span className="font-bold">{programasList.length}</span>{" "}
                  programas
                </>
              )}
            </div>
            {(selectedEjes.length > 0 ||
              selectedProgramas.length > 0 ||
              selectedMetasProducto.length > 0 ||
              selectedResponsables.length > 0 ||
              searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-8">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("ejes")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "ejes"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Por Eje Estratégico
            </button>
            <button
              onClick={() => setActiveTab("programas")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "programas"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Por Programa
            </button>
          </div>

          {/* Contenido por Eje */}
          {activeTab === "ejes" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Eje Estratégico
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Apropiación
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Compromisos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Pagos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      % Compromisos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      % Pagos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(filteredEjes).length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No se encontraron ejes con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    Object.entries(filteredEjes)
                      .sort((a, b) => b[1].apropiacion - a[1].apropiacion)
                      .map(([eje, ejeData], index) => (
                        <tr
                          key={eje}
                          className={`hover:bg-gray-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {eje}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                            {formatCurrency(ejeData.apropiacion)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">
                            {formatCurrency(ejeData.compromisos)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">
                            {formatCurrency(ejeData.pagos)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                ejeData.porcentaje_compromisos >= 70
                                  ? "bg-green-100 text-green-800"
                                  : ejeData.porcentaje_compromisos >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {ejeData.porcentaje_compromisos}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                ejeData.porcentaje_pagos >= 70
                                  ? "bg-green-100 text-green-800"
                                  : ejeData.porcentaje_pagos >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {ejeData.porcentaje_pagos}%
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Contenido por Programa */}
          {activeTab === "programas" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Programa
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Apropiación
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Compromisos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Pagos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      % Compromisos
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      % Pagos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(filteredProgramas).length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No se encontraron programas con los filtros aplicados
                      </td>
                    </tr>
                  ) : (
                    Object.entries(filteredProgramas)
                      .sort((a, b) => b[1].apropiacion - a[1].apropiacion)
                      .map(([programa, progData], index) => (
                        <tr
                          key={programa}
                          className={`hover:bg-gray-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {programa}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                            {formatCurrency(progData.apropiacion)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">
                            {formatCurrency(progData.compromisos)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">
                            {formatCurrency(progData.pagos)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                progData.porcentaje_compromisos >= 70
                                  ? "bg-green-100 text-green-800"
                                  : progData.porcentaje_compromisos >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {progData.porcentaje_compromisos}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                progData.porcentaje_pagos >= 70
                                  ? "bg-green-100 text-green-800"
                                  : progData.porcentaje_pagos >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {progData.porcentaje_pagos}%
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
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
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>
                  © {new Date().getFullYear()} Alcaldía de Tenjo. Todos los
                  derechos reservados.
                </p>
                <p className="mt-2 md:mt-0">
                  Dashboard de ejecución financiera 2025
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
