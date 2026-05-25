/**
 * api.js — Comunicación entre el frontend y la API Flask.
 * Todas las peticiones pasan por llamarEndpoint(), que maneja
 * errores de red, errores HTTP y errores de validación del backend.
 */

/**
 * Llama a POST /api/{modulo} con los parámetros dados.
 * @param {string} modulo  — nombre del endpoint (ej: "modulo2", "modulo7")
 * @param {object} params  — parámetros financieros como objeto JS
 * @returns {Promise<object>} — respuesta JSON del backend
 * @throws {Error} con mensaje legible si algo falla
 */
async function llamarEndpoint(modulo, params) {
  const resp = await fetch(`/api/${modulo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.mensaje || `Error ${resp.status} del servidor.`);
  }

  return data;
}

/**
 * Wrappers por módulo — simplifican las llamadas desde main.js
 * y documentan qué parámetros espera cada endpoint.
 */

async function apiModulo1(S0, r, T) {
  return llamarEndpoint("modulo1", { S0, r, T });
}

async function apiModulo2(S0, r, k, T) {
  return llamarEndpoint("modulo2", { S0, r, k, T });
}

async function apiModulo2d(S0, r, k, a, T) {
  return llamarEndpoint("modulo2d", { S0, r, k, a, T });
}

async function apiModulo3(S0, r, alpha, n, T) {
  return llamarEndpoint("modulo3", { S0, r, alpha, n, T });
}

async function apiModulo4(S0, S1, c, r, k, T) {
  return llamarEndpoint("modulo4", { S0, S1, c, r, k, T });
}

async function apiModulo5(S0, c, w0, F, w, T) {
  return llamarEndpoint("modulo5", { S0, c, w0, F, w, T });
}

async function apiModulo6(S0, S1, a, b, t0, T) {
  return llamarEndpoint("modulo6", { S0, S1, a, b, t0, T });
}

async function apiModulo7(S0, D0, r, lam, alpha, beta, k, T) {
  return llamarEndpoint("modulo7", { S0, D0, r, lam, alpha, beta, k, T });
}

async function apiComparar(escenarios) {
  return llamarEndpoint("comparar", { escenarios });
}

/**
 * Lee todos los inputs de un formulario y los devuelve como objeto numérico.
 * @param {HTMLElement} contenedor — el div que contiene los inputs
 * @returns {object} { nombre: valor_numerico }
 */
function leerFormulario(contenedor) {
  const resultado = {};
  contenedor.querySelectorAll("input[name]").forEach((inp) => {
    const val = parseFloat(inp.value);
    if (isNaN(val)) throw new Error(`El campo "${inp.name}" debe ser un número.`);
    resultado[inp.name] = val;
  });
  return resultado;
}
