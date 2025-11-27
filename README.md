# 📊 Dashboard Plan de Desarrollo - Tenjo 2024-2027

Dashboard interactivo para la **Secretaría de Planeación** de la Alcaldía Municipal de Tenjo, Cundinamarca. Visualiza y analiza en tiempo real el avance del Plan de Desarrollo 2024-2027, convirtiendo automáticamente datos de Excel en un dashboard web moderno con React, Tailwind CSS y ECharts.

---

## 📑 Tabla de Contenidos

- [Resumen Ejecutivo](#-resumen-ejecutivo)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Formato del Archivo Excel](#-formato-del-archivo-excel)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [URLs de Acceso](#-urls-de-acceso)
- [API Endpoints](#-api-endpoints)
- [Características Principales](#-características-principales)
- [Personalización](#-personalización)
- [Build para Producción](#-build-para-producción)
- [Solución de Problemas](#-solución-de-problemas)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Licencia](#-licencia)

---

## 📖 Resumen Ejecutivo

Este proyecto es una **solución completa** que transforma datos de hojas de cálculo Excel en un dashboard web interactivo y profesional. Diseñado específicamente para el seguimiento del Plan Indicativo 2025 del municipio de Gachancipá.

### ✨ Características Clave

- 🚀 **Parser Automático**: Lee archivos Excel y los convierte a JSON sin configuración manual
- 📊 **3 Vistas Principales**: Dashboard global, tabla de programas y catálogo de metas
- 📈 **Visualizaciones Interactivas**: Gráficos de barras, donas y tablas dinámicas con ECharts
- 🔍 **Filtros Avanzados**: Búsqueda por texto, programa y nivel de rendimiento
- 🎨 **Diseño Moderno**: Interfaz responsive con Tailwind CSS y animaciones
- ⚡ **Tiempo Real**: Actualización automática al cambiar el archivo Excel
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil

### 🎯 Propósito

Facilitar el **seguimiento y análisis** del cumplimiento del Plan de Desarrollo 2024-2027, proporcionando:

- Visibilidad inmediata del avance físico trimestral por eje estratégico
- Seguimiento de ejecución financiera (apropiación, compromisos, pagos)
- Identificación rápida de programas con bajo/medio/alto rendimiento
- Acceso detallado a metas de resultado y producto
- Información centralizada para toma de decisiones

### 📊 Datos que Muestra

- **Metas del Plan de Desarrollo 2024-2027**
- **Avance físico por trimestre** (T1, T2, T3, T4) de 2025
- **Ejecución financiera**: Apropiación, Compromisos y Pagos
- **Jerarquía completa**: Eje → Programa → Subprograma → Metas
- **Indicadores de resultado y producto**
- **Clasificación automática** por nivel de avance
- **Proyectos BPIN** y responsables por meta
- **Línea base** y metas del cuatrienio

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
plan-indicativo-dashboard/
├── backend/                          # API Node.js + Express
│   ├── server.js                    # Servidor principal y configuración de rutas
│   ├── package.json                 # Dependencias backend
│   ├── controllers/
│   │   └── dataController.js        # Lógica de negocio y endpoints
│   ├── utils/
│   │   └── excelParser.js           # Parser de Excel a JSON (flexible)
    └── data/
        ├── README.md                       # Instrucciones para el Excel
        └── PLAN INDICATIVO TENJO.xlsx  # Archivo de datos de Tenjo
│
└── frontend/                         # App React + Vite
    ├── package.json                 # Dependencias frontend
    ├── vite.config.js               # Configuración de Vite + Proxy
    ├── tailwind.config.js           # Tema personalizado Tailwind
    ├── postcss.config.js            # PostCSS + Autoprefixer
    ├── index.html                   # Punto de entrada HTML
    ├── public/                      # Assets estáticos
    └── src/
        ├── main.jsx                 # Entry point React
        ├── App.jsx                  # Router principal
        ├── pages/
        │   ├── Dashboard.jsx        # Página principal con métricas
        │   ├── Metas.jsx            # Página de metas con filtros
        │   └── Finanzas.jsx         # Página de ejecución financiera
        ├── components/
        │   ├── MetricCard.jsx       # Tarjeta de métrica individual
        │   ├── PerformanceChart.jsx # Gráfico de barras (T3/T4)
        │   ├── DistributionChart.jsx # Gráfico de dona (distribución)
        │   ├── ProgramsTable.jsx    # Tabla de programas
        │   └── MetaCard.jsx         # Tarjeta de meta individual
        ├── hooks/
        │   └── useMetasData.js      # Custom hook para fetch de datos
        ├── utils/
        │   └── calculations.js      # Funciones de cálculo y formato
        └── styles/
            └── index.css            # Estilos globales + Tailwind
```

### Flujo de Datos

```
📄 Excel (PlanIndicativo.xlsx)
    ↓
🔧 excelParser.js (convierte a JSON)
    ↓
📊 dataController.js (procesa y agrega datos)
    ↓
🌐 API REST (Express endpoints)
    ↓
🔄 useMetasData.js (custom hook con Axios)
    ↓
⚛️ Componentes React (Dashboard/Metas)
    ↓
📈 ECharts (visualizaciones interactivas)
    ↓
👤 Usuario (navegador web)
```

### Componentes Frontend

| Componente | Responsabilidad | Props Principales |
|------------|-----------------|-------------------|
| `App.jsx` | Router y navegación | - |
| `Dashboard.jsx` | Vista principal con métricas | `data, loading, error` |
| `Metas.jsx` | Vista de metas con filtros | `data, loading, error` |
| `MetricCard.jsx` | Tarjeta de métrica con progreso | `title, value, icon, color, progress` |
| `PerformanceChart.jsx` | Gráfico de barras T3/T4 | `programPerformance` |
| `DistributionChart.jsx` | Gráfico de dona por nivel | `programPerformance` |
| `ProgramsTable.jsx` | Tabla de programas | `programs` |
| `MetaCard.jsx` | Tarjeta de meta individual | `meta` object |
| `useMetasData.js` | Fetch y estado de datos | - |

### Patrón de Diseño

- **Separación de Responsabilidades**: Backend (datos) ↔ Frontend (UI)
- **Componentes Modulares**: Cada componente tiene una responsabilidad única
- **Custom Hooks**: Lógica de fetch centralizada y reutilizable
- **Atomic Design**: Componentes pequeños y composibles
- **Single Source of Truth**: Datos vienen del backend vía API

## 🚀 Stack Tecnológico

### Backend (Node.js + Express)

- **Node.js 18+** - Runtime JavaScript del lado del servidor
- **Express 4.18** - Framework web minimalista y flexible
- **xlsx 0.18.5** - Librería para lectura y conversión de archivos Excel a JSON
- **CORS** - Middleware para habilitar peticiones cross-origin
- **dotenv** - Gestión de variables de entorno
- **nodemon** (dev) - Auto-restart del servidor en desarrollo

**Puerto por defecto**: 3002

### Frontend (React + Vite)

- **React 18.2** - Librería UI declarativa basada en componentes
- **React Router DOM 6.20** - Enrutamiento SPA sin recargas
- **Vite 5.0** - Build tool ultra-rápido con HMR
- **Tailwind CSS 3.3** - Framework CSS utility-first con diseño personalizado
- **ECharts 5.4** - Librería de gráficos interactivos potente y flexible
- **echarts-for-react** - Wrapper de ECharts para React
- **Axios 1.6** - Cliente HTTP para consumo de API
- **PostCSS + Autoprefixer** - Procesamiento CSS con prefijos automáticos

**Puerto por defecto**: 3000

### Herramientas de Desarrollo

- **ES Modules** (type: "module") - Sintaxis moderna de importación
- **Hot Module Replacement** - Recarga instantánea en desarrollo
- **Custom Hooks** - Lógica reutilizable (useMetasData)
- **Componentes Modulares** - Arquitectura basada en componentes separados

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- Archivo Excel `PlanIndicativo.xlsx` con la estructura adecuada

## 📊 Formato del Archivo Excel

El archivo `PlanIndicativo.xlsx` debe contener las siguientes columnas (el parser detecta automáticamente variaciones en los nombres):

### Columnas Completas del Excel

| Columna | Alternativas Aceptadas | Descripción | Tipo |
|---------|------------------------|-------------|------|
| **N°** | N, ID | ID único de registro | Número |
| **EJE** | - | Eje estratégico | Texto |
| **SECTOR PROGRAMA** | SECTOR | Código del sector | Texto |
| **NOMBRE SECTOR PROGRAMA** | NOMBRE SECTOR | Nombre completo del sector | Texto |
| **OBJETIVO DE META DO** | OBJETIVO META | Objetivo de la meta | Texto |
| **META DE PROGRAMA DO** | META PROGRAMA | Meta del programa | Texto |
| **N° INDICADOR** | NINDICADOR | Número de indicador | Texto |
| **LÍNEA BASE (2023)** | Línea Base, LineaBase | Valor base del año 2023 | Número |
| **Ejecutado (2024)** | Ejecutado 2024 | Valor ejecutado en 2024 | Número |
| **ESPERADO 2027** | Esperado 2027 | Meta esperada para 2027 | Número |
| **DEPENDENCIA RESPONSABLE** | DEPENDENCIA | Dependencia responsable | Texto |
| **N° METAS EN PROYECTO** | N METAS PROYECTO | Cantidad de metas en el proyecto | Número |
| **N° METAS PROYECTO PROTECT** | N METAS PROTECT | Metas del proyecto protect | Número |
| **N° DE META EN EL PLAN DE DESARROLLO** | Número Meta | ID de meta en plan desarrollo | Texto |
| **NOMBRE** | - | Nombre descriptivo | Texto |
| **META DE PRODUCTO** | META | Meta de producto | Texto |
| **INDICADOR DE PRODUCTO** | Indicador | Nombre del indicador | Texto |
| **CÓDIGO DANE** | Codigo DANE | Código DANE | Texto |
| **CÓDIGO CCPET** | Codigo CCPET | Código CCPET | Texto |
| **T1 PLANEADO 2025** | T1_Plan, T1 PLANEADO | Planeado Trimestre 1 | Número |
| **T1 EJECUTADO 2025** | T1_Ejec, T1 EJECUTADO | Ejecutado Trimestre 1 | Número |
| **T2 PLANEADO 2025** | T2_Plan, T2 PLANEADO | Planeado Trimestre 2 | Número |
| **T2 EJECUTADO 2025** | T2_Ejec, T2 EJECUTADO | Ejecutado Trimestre 2 | Número |
| **T3 PLANEADO 2025** | T3_Plan, T3 PLANEADO | Planeado Trimestre 3 | Número |
| **T3 EJECUTADO 2025** | T3_Ejec, T3 EJECUTADO | Ejecutado Trimestre 3 | Número |
| **T4 PLANEADO 2025** | T4_Plan, T4 PLANEADO | Planeado Trimestre 4 | Número |
| **T4 EJECUTADO 2025** | T4_Ejec, T4 EJECUTADO | Ejecutado Trimestre 4 | Número |
| **TOTAL PLANEADO 2025** | Total Planeado | Total planeado del año | Número |
| **TOTAL EJECUTADO 2025** | Total Ejecutado | Total ejecutado del año | Número |
| **% TOTAL AVANCE 2025** | % Avance, Avance | Porcentaje de cumplimiento | Número |
| **% EN TOTAL DEL ESTADO** | % Estado | Porcentaje en total del estado | Número |
| **ESTADO PROGRAMA** | Programa, Estado | Nombre del programa | Texto |
| **ESTADO DEL PROYECTO** | Estado Proyecto | Estado actual del proyecto | Texto |

### Notas Importantes

- **Detección Flexible**: El parser detecta automáticamente variaciones en nombres de columnas (mayúsculas, minúsculas, espacios, guiones).
- **Campos Opcionales**: `numeroMeta`, `codigoDane`, `codigoCcpet` pueden estar vacíos.
- **Evaluación Automática**: Si no se proporciona el campo `% TOTAL AVANCE`, se calcula automáticamente como `(TOTAL EJECUTADO / TOTAL PLANEADO) * 100`.
- **Clasificación**: 
  - **Avance Alto**: ≥ 90%
  - **Avance Medio**: 70% - 89%
  - **Avance Bajo**: < 70%
  - **Sin Programación**: Total planeado = 0

## 🔧 Instalación

### 1. Clonar o copiar el proyecto

```bash
cd plan-indicativo-dashboard
```

### 2. Instalar Dependencias

**Backend:**

```bash
cd backend
npm install
```

Esto instalará: `express`, `cors`, `xlsx`, `dotenv`, `nodemon`

**Frontend:**

```bash
cd ../frontend
npm install
```

Esto instalará: `react`, `react-dom`, `react-router-dom`, `echarts`, `echarts-for-react`, `axios`, `vite`, `tailwindcss`

### 3. Configurar el Archivo Excel

Coloca tu archivo `PLAN INDICATIVO TENJO.xlsx` en la carpeta `backend/data/`:

```bash
# Windows
copy "C:\ruta\a\tu\PLAN INDICATIVO TENJO.xlsx" backend\data\

# Linux/Mac
cp "/ruta/a/tu/PLAN INDICATIVO TENJO.xlsx" backend/data/
```

**Importante**: El archivo debe llamarse exactamente `PLAN INDICATIVO TENJO.xlsx` o actualiza el nombre en `backend/utils/excelParser.js`

## ▶️ Ejecución

### Opción 1: Ejecutar Backend y Frontend por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# El servidor estará en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# La app estará en http://localhost:3000
```

### Opción 2: Script único (opcional)

Puedes crear un script para ejecutar ambos simultáneamente usando `concurrently`:

```bash
# En la raíz del proyecto
npm install -g concurrently
```

Luego crea un `package.json` en la raíz:

```json
{
  "name": "plan-indicativo-dashboard",
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "install:all": "cd backend && npm install && cd ../frontend && npm install"
  }
}
```

Y ejecuta:
```bash
npm run dev
```

## 🌐 URLs de Acceso

### Desarrollo Local
- **Frontend:** <http://localhost:5173> (Vite)
- **Backend API:** <http://localhost:3002>
- **Health Check:** <http://localhost:3002/health>

### Producción
- **Backend API:** <https://dashboard-tenjo.onrender.com>
- **Health Check:** <https://dashboard-tenjo.onrender.com/health>

## 📡 API Endpoints

El backend expone los siguientes endpoints REST:

| Endpoint | Método | Descripción | Respuesta |
|----------|--------|-------------|-----------|
| `/api/metas` | GET | Obtiene todas las metas con datos completos | Array de objetos meta con T1-T4, evaluación, dependencia, finanzas |
| `/api/metrics/global` | GET | Métricas agregadas globales | Total de metas, cumplimiento global, cumplimiento por trimestre (T1-T4) |
| `/api/metrics/programs` | GET | Performance agrupado por programa | Objeto con programas como keys y métricas por trimestre |
| `/api/metrics/ejes` | GET | Performance agrupado por eje estratégico | Objeto con ejes, avance físico y ejecución financiera |
| `/api/financial/summary` | GET | Resumen financiero completo | Total, por eje y por programa (apropiación, compromisos, pagos) |
| `/api/reload` | POST | Recarga datos desde Excel (limpia caché) | Mensaje de éxito y metadata actualizada |
| `/health` | GET | Health check del servidor | `{status: "OK", message: "Server is running"}` |

### Ejemplo de Respuesta `/api/metrics/global`

```json
{
  "total_metas": 150,
  "cumplimiento_global": 75.5,
  "total_plan": 1000000,
  "total_ejec": 755000,
  "cumplimiento_t1": 80.2,
  "total_t1_plan": 250000,
  "total_t1_ejec": 200500,
  "cumplimiento_t2": 78.1,
  "cumplimiento_t3": 72.3,
  "cumplimiento_t4": 71.0
}
```

### Ejemplo de Respuesta `/api/metrics/programs`

```json
{
  "PROGRAMA DE EDUCACIÓN": {
    "t1_cumplimiento": 85.5,
    "t2_cumplimiento": 82.3,
    "t3_cumplimiento": 78.9,
    "t4_cumplimiento": 75.2,
    "cumplimiento_global": 80.5,
    "nivel": "Medio"
  }
}
```

## 🎨 Características Principales

### 📊 Dashboard Principal (Página de Inicio)

#### Tarjetas de Métricas Globales
- **Cumplimiento Global 2025**: Indicador principal con porcentaje y progreso visual
- **T3 - Trimestre 3**: Avance del tercer trimestre con valores ejecutados vs planeados
- **T4 - Trimestre 4**: Monitoreo del cuarto trimestre con indicadores en color rojo
- **Total de Metas**: Contador total de metas del Plan Indicativo 2025
- Cada métrica incluye valores absolutos (ejecutado/planeado) con formato de miles

#### Visualizaciones Interactivas
- **Gráfico de Barras Comparativo**: 
  - Muestra los principales programas y ejes
  - Compara cumplimiento por trimestre
  - Tooltips informativos al pasar el mouse
  - Rotación de etiquetas para mejor legibilidad
  - Colores de Tenjo: Amarillo (#dab109), Verde (#085c2b), Rojo (#6d0006)

- **Gráfico de Distribución por Nivel**:
  - Gráfico de dona (doughnut chart)
  - Clasificación por rendimiento:
    - **Alto** (≥90%): Verde
    - **Medio** (70-89%): Amarillo
    - **Bajo** (<70%): Rojo
  - Muestra cantidad de programas en cada nivel
  - Porcentajes y valores absolutos

#### Tabla Detallada de Programas
- Vista completa de todos los programas
- Columnas organizadas:
  - Nombre del programa
  - Cumplimiento T3 (%)
  - Cumplimiento T4 (%)
  - Cumplimiento Global (%)
- Indicadores de colores según nivel de rendimiento
- Ordenamiento y navegación intuitiva

#### Footer Informativo
- **Última Actualización**: Fecha y hora de la última carga de datos
- **Fuente de Datos**: Nombre del archivo Excel origen
- **Entidad Responsable**: Información de la Secretaría de Planeación
- Copyright y descripción del propósito del dashboard

### 📋 Vista de Metas (Página Secundaria)

#### Filtros y Búsqueda Avanzada
- **Búsqueda por texto**: Busca en nombre, meta, indicador o dependencia
- **Filtro por Programa**: Dropdown con todos los programas disponibles
- **Filtro por Evaluación**: 
  - Alto (≥90%)
  - Medio (70-89%)
  - Bajo (<70%)
  - Sin Programación

#### Tarjetas de Metas Individuales
Cada meta se presenta en una tarjeta con:
- **Información Principal**:
  - Nombre de la meta
  - Meta de producto
  - Indicador de producto
  - Dependencia responsable
  
- **Métricas de Progreso**:
  - Total ejecutado / Total planeado
  - Porcentaje de avance
  - Badge con clasificación de rendimiento
  
- **Detalle por Trimestres**:
  - T1, T2, T3, T4: Planeado vs Ejecutado
  - Formato de números con separador de miles
  
- **Metadatos**:
  - Línea Base (2023)
  - Ejecutado (2024)
  - Esperado (2027)
  - Código DANE
  - Código CCPET

- **Indicador Visual**: Barra de progreso con colores según cumplimiento

### 💰 Vista de Finanzas (Nueva Página)

#### Resumen Financiero General
Tarjetas principales con indicadores financieros:
- **Apropiación Definitiva**: Presupuesto total aprobado para 2025
- **Compromisos**: Monto comprometido con porcentaje sobre apropiación
- **Pagos Realizados**: Monto pagado con porcentaje de ejecución
- **Plan Financiero PDM**: Proyección 2024-2027

#### Barras de Progreso de Ejecución
- Visualización clara del porcentaje de compromisos
- Visualización del porcentaje de pagos
- Colores diferenciados (amarillo para compromisos, verde para pagos)

#### Tabs de Visualización
**Por Eje Estratégico:**
- Tabla completa con todos los ejes del Plan de Desarrollo
- Columnas: Apropiación, Compromisos, Pagos
- Porcentajes de compromisos y pagos
- Indicadores de color según nivel de ejecución

**Por Programa:**
- Desglose financiero por cada programa PDT
- Mismas métricas que por eje
- Ordenamiento por monto de apropiación
- Identificación rápida de programas con mayor/menor ejecución

#### Características de las Tablas Financieras
- Formato de moneda con separadores de miles
- Badges de color según porcentaje de ejecución:
  - Verde: ≥70% (buena ejecución)
  - Amarillo: 40-69% (ejecución media)
  - Rojo: <40% (ejecución baja)
- Ordenamiento descendente por apropiación

### 🎨 Diseño y UX

#### Sistema de Colores Personalizado (Tenjo)
- **Primary** (#6d0006): Rojo institucional de Tenjo para headers
- **Accent** (#dab109): Amarillo de Tenjo para elementos destacados
- **Success** (#085c2b): Verde de Tenjo para alto rendimiento
- **Warning** (#dab109): Amarillo para rendimiento medio
- **Error** (#6d0006): Rojo para bajo rendimiento
- **Background** (#FAFBFC): Gris claro para fondo

#### Animaciones
- `animate-fade-in`: Entrada suave de elementos
- `animate-slide-in`: Deslizamiento con delay progresivo
- Spin loader durante carga de datos

#### Responsive Design
- Grid adaptable (1 columna móvil, 2-3 columnas desktop)
- Tablas con scroll horizontal en móviles
- Navegación optimizada para todos los tamaños

### 🔄 Navegación
- **Header fijo** con logo y título del municipio de Tenjo
- Tabs de navegación:
  - Dashboard (vista principal con métricas generales)
  - Metas (vista detallada de metas de resultado y producto)
  - Finanzas (ejecución presupuestal por eje y programa)
- React Router para navegación SPA sin recargas

## 🛠️ Personalización

### Cambiar Puerto del Backend

Crea o edita `backend/.env`:

```env
PORT=3002
```

### Cambiar Puerto del Frontend

Edita `frontend/vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3002', // Actualiza el puerto si lo cambias
      changeOrigin: true,
    },
  },
})
```

### Personalizar Colores del Dashboard

Edita `frontend/tailwind.config.js` para cambiar la paleta de colores:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#1E3A8A',    // Azul header
      accent: '#0891B2',      // Cyan destacado
      success: '#059669',     // Verde éxito
      warning: '#D69E2E',     // Amarillo advertencia
      error: '#E53E3E',       // Rojo error
      secondary: '#6B7280',   // Gris secundario
      background: '#F3F4F6',  // Fondo gris claro
    }
  }
}
```

### Ajustar Clasificación de Rendimiento

Edita `frontend/src/utils/calculations.js` para cambiar los umbrales:

```javascript
export const getEvaluacion = (porcentaje) => {
  if (porcentaje >= 90) return "Alto";      // Cambiar umbral
  if (porcentaje >= 70) return "Medio";     // Cambiar umbral
  return "Bajo";
};
```

## 📦 Build para Producción

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Los archivos estarán en frontend/dist/
```

Para previsualizar el build:
```bash
npm run preview
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'xlsx'"

```bash
cd backend
npm install xlsx
```

### Error: "CORS policy"

Asegúrate de que el backend esté configurado con CORS y ejecutándose en el puerto 3002.

### Error al leer el Excel

- Verifica que el archivo esté en `backend/data/PlanIndicativo.xlsx`
- Comprueba que las columnas tengan los nombres correctos (ver tabla de columnas)
- Revisa que no haya filas vacías al inicio del Excel
- Confirma que el archivo no esté abierto en Excel (puede bloquear lectura)

### Frontend no se conecta al Backend

- Verifica que el backend esté ejecutándose en puerto 3002
- Revisa los logs del servidor para ver si hay errores
- Comprueba la consola del navegador (F12) para errores de red
- Confirma que no haya firewall bloqueando el puerto

### Dashboard muestra "Cargando datos..." indefinidamente

- Verifica que el archivo Excel exista en `backend/data/`
- Revisa los logs del backend para errores de parsing
- Confirma que el backend responda en <http://localhost:3002/health>

### Gráficos no se visualizan

- Verifica que `echarts` y `echarts-for-react` estén instalados
- Limpia la caché del navegador (Ctrl + Shift + R)
- Revisa la consola para errores de JavaScript

## 📝 Notas Importantes

- **Caché de datos**: El backend carga los datos del Excel al iniciar. Si actualizas el archivo, reinicia el servidor para ver los cambios.
- **Parser flexible**: Las columnas del Excel son case-insensitive y aceptan variaciones (espacios, guiones, mayúsculas).
- **Cálculo automático**: Si falta el campo `% TOTAL AVANCE`, se calcula automáticamente.
- **Clasificación**: Los programas se clasifican automáticamente en Alto/Medio/Bajo según umbrales configurables.
- **Puerto por defecto**: Backend usa puerto 3002 (puedes cambiarlo en `.env`).
- **Datos de ejemplo**: Si no tienes un Excel, el proyecto incluye estructura y lógica para trabajar con cualquier archivo compatible.

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

- [x] Parser de Excel flexible con detección automática de columnas
- [x] API REST completa con 3 endpoints principales
- [x] Dashboard interactivo con métricas globales
- [x] Gráficos de barras comparativos por trimestre (T3/T4)
- [x] Gráfico de distribución por nivel de rendimiento
- [x] Tabla detallada con todos los programas
- [x] Vista de metas con filtros múltiples
- [x] Búsqueda en tiempo real
- [x] Tarjetas individuales de metas con todos los detalles
- [x] Sistema de colores personalizados
- [x] Animaciones y transiciones suaves
- [x] Diseño responsive para móviles y tablets
- [x] Navegación SPA con React Router
- [x] Footer informativo con metadata
- [x] Formato de números con separador de miles
- [x] Indicadores visuales de progreso
- [x] Clasificación automática por rendimiento (Alto/Medio/Bajo)
- [x] Cálculo automático de porcentajes de avance
- [x] Logging detallado en servidor
- [x] Manejo de errores robusto

### 💡 Posibles Extensiones Futuras

Funcionalidades que se pueden agregar según necesidades:

- [ ] Autenticación y roles de usuario
- [ ] Exportación de reportes PDF/Excel
- [ ] Edición en línea de metas
- [ ] Gráficos adicionales (líneas de tiempo, heat maps)
- [ ] Comparación entre años (2024 vs 2025)
- [ ] Dashboard por dependencia
- [ ] Notificaciones de alerta para bajo rendimiento
- [ ] Histórico de cambios y auditoría
- [ ] Integración con bases de datos (MySQL/PostgreSQL)
- [ ] API de carga masiva de archivos Excel
- [ ] Panel de administración
- [ ] WebSockets para actualizaciones en tiempo real

## 👥 Desarrollado Para

**Alcaldía Municipal de Gachancipá, Cundinamarca**  
Secretaría de Planeación y Servicios Públicos

Dashboard diseñado específicamente para el seguimiento y análisis del Plan Indicativo 2025, facilitando la toma de decisiones basada en datos y el monitoreo del cumplimiento de metas institucionales.

### 🎯 Objetivos del Dashboard

- ✅ Centralizar información del Plan Indicativo 2025
- ✅ Facilitar el seguimiento trimestral de metas
- ✅ Identificar rápidamente programas con bajo rendimiento
- ✅ Proporcionar datos actualizados para toma de decisiones
- ✅ Generar transparencia en la gestión pública

## 📚 Documentación Adicional

- **Estructura del Excel**: Ver `backend/data/README.md`
- **Componentes Frontend**: Revisar código en `frontend/src/components/`
- **API Backend**: Documentado en sección "API Endpoints"

## 🔄 Historial de Versiones

### v1.0.0 (Actual)

- ✅ Parser de Excel flexible y robusto
- ✅ API REST con 3 endpoints principales
- ✅ Dashboard principal con métricas globales
- ✅ Vista de metas con filtros avanzados
- ✅ Gráficos interactivos (barras y dona)
- ✅ Tabla detallada de programas
- ✅ Sistema de colores personalizado
- ✅ Diseño responsive completo
- ✅ Documentación completa

## 🤝 Contribuciones

Este proyecto está abierto a mejoras. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o soporte técnico sobre este dashboard:

- Revisa la sección **Solución de Problemas**
- Verifica que estés usando las versiones correctas (Node.js 18+)
- Confirma que el archivo Excel tenga la estructura correcta

## 📄 Licencia

MIT License - Libre para uso institucional y educativo.

Copyright © 2025 Alcaldía de Gachancipá, Cundinamarca

---

**Desarrollado con ❤️ para la gestión pública eficiente** 🏛️✨

*Este dashboard es parte del compromiso con la transparencia y la eficiencia en la administración pública del municipio de Gachancipá.*
