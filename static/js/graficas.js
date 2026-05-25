/**
 * graficas.js — Renderizado de gráficas con Chart.js.
 * Maneja una instancia activa del gráfico principal y
 * provee funciones para gráficas simples, duales y comparadoras.
 */

let graficaActual = null;
let graficaDeuda  = null;

const COLORES_COMP = [
  "#2C5282", "#1B4332", "#744210",
  "#742A2A", "#44337A", "#234E52",
  "#7B341E", "#2D3748"
];

/** Destruye la gráfica actual si existe */
function destruirGrafica() {
  if (graficaActual) { graficaActual.destroy(); graficaActual = null; }
}

function destruirGraficaDeuda() {
  if (graficaDeuda) { graficaDeuda.destroy(); graficaDeuda = null; }
}

/**
 * Opciones base compartidas entre todas las gráficas.
 */
function opcionesBase(labelX = "Tiempo (años)", labelY = "Capital S(t)") {
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 500 },
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 } } },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatearNumero(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: labelX, font: { size: 12, weight: "bold" } },
        ticks: { maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: labelY, font: { size: 12, weight: "bold" } },
        ticks: {
          callback: (v) => formatearNumero(v),
        },
      },
    },
  };
}

/**
 * Formatea números: usa notación compacta para valores grandes.
 */
function formatearNumero(v) {
  if (v === null || v === undefined || isNaN(v)) return "N/A";
  const abs = Math.abs(v);
  if (abs >= 1e9) return (v / 1e9).toFixed(2) + " B";
  if (abs >= 1e6) return (v / 1e6).toFixed(2) + " M";
  if (abs >= 1e3) return (v / 1e3).toFixed(1) + " k";
  return v.toFixed(2);
}

/**
 * Gráfica simple: una sola curva S(t).
 */
function renderizarSimple(canvasId, t, S, etiqueta, color = "#2C5282") {
  destruirGrafica();
  const ctx = document.getElementById(canvasId).getContext("2d");
  const labels = t.map((v) => parseFloat(v).toFixed(1));

  graficaActual = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: etiqueta,
        data: S,
        borderColor: color,
        backgroundColor: color + "1A",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: opcionesBase(),
  });
}

/**
 * Gráfica con dos series (ej: con/sin aportes en el módulo 2d).
 */
function renderizarDoble(canvasId, t, series) {
  // series = [{label, data, color}]
  destruirGrafica();
  const ctx = document.getElementById(canvasId).getContext("2d");
  const labels = t.map((v) => parseFloat(v).toFixed(1));

  graficaActual = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: series.map((s) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color + "18",
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: s.dash || [],
      })),
    },
    options: opcionesBase(),
  });
}

/**
 * Gráfica del módulo 7: capital + deuda en canvas separados.
 */
function renderizarCapitalDeuda(t, S, D, patrimonio) {
  destruirGrafica();
  destruirGraficaDeuda();

  const labels = t.map((v) => parseFloat(v).toFixed(1));

  // Gráfica 1: capital y deuda
  const ctx1 = document.getElementById("grafica").getContext("2d");
  graficaActual = new Chart(ctx1, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Capital S(t)", data: S, borderColor: "#1B4332", backgroundColor: "#1B433218", fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
        { label: "Deuda D(t)",   data: D, borderColor: "#742A2A", backgroundColor: "#742A2A18", fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2, borderDash: [5,3] },
      ],
    },
    options: opcionesBase("Tiempo (años)", "Monto"),
  });

  // Gráfica 2: patrimonio neto
  const ctx2 = document.getElementById("grafica-deuda").getContext("2d");
  graficaDeuda = new Chart(ctx2, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Patrimonio neto S−D",
        data: patrimonio,
        borderColor: "#44337A",
        backgroundColor: "#44337A18",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: opcionesBase("Tiempo (años)", "Patrimonio neto"),
  });
}

/**
 * Gráfica del módulo 5: transitorio + estacionario + total.
 */
function renderizarCiclos(t, S, S_trans, S_est) {
  destruirGrafica();
  const ctx = document.getElementById("grafica").getContext("2d");
  const labels = t.map((v) => parseFloat(v).toFixed(1));

  graficaActual = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "S(t) total",          data: S,      borderColor: "#2C5282", fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
        { label: "Transitorio",         data: S_trans, borderColor: "#744210", fill: false, tension: 0.3, pointRadius: 0, borderWidth: 1.5, borderDash: [6,3] },
        { label: "Estado estacionario", data: S_est,   borderColor: "#1B4332", fill: false, tension: 0.3, pointRadius: 0, borderWidth: 1.5, borderDash: [3,3] },
      ],
    },
    options: opcionesBase(),
  });
}

/**
 * Gráfica del comparador de escenarios: N curvas superpuestas.
 */
function renderizarComparador(canvasId, resultados) {
  destruirGrafica();
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (!resultados.length) return;

  const labels = resultados[0].t.map((v) => parseFloat(v).toFixed(1));

  graficaActual = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: resultados.map((r, i) => ({
        label: r.etiqueta,
        data: r.S,
        borderColor: r.color || COLORES_COMP[i % COLORES_COMP.length],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      })),
    },
    options: opcionesBase(),
  });
}
