"""
FindDiff — Motor de Modelación Financiera con Ecuaciones Diferenciales
Punto de entrada Flask: define la aplicación y todos los endpoints de la API.
"""

from flask import Flask, render_template, request, jsonify
import traceback

from motor.modelos_fase1 import (
    resolver_modelo1,
    resolver_modelo2,
    resolver_modelo2_diferido,
    resolver_modelo3_bernoulli,
)
from motor.modelos_fase2 import (
    resolver_modelo4_amortiguacion,
    resolver_modelo5_ciclos,
    resolver_modelo6_cauchy_euler,
    resolver_modelo7_capital_deuda,
)
from motor.comparador import resolver_comparador

app = Flask(__name__)


# ─── Página principal ─────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


# ─── Helper de respuesta de error ─────────────────────────────────────────────
def error(mensaje, codigo=400):
    return jsonify({"error": True, "mensaje": mensaje}), codigo


# ─── Endpoint genérico: valida JSON y captura excepciones ─────────────────────
def endpoint(fn):
    def wrapper(*args, **kwargs):
        try:
            datos = request.get_json(force=True)
            if datos is None:
                return error("Body JSON requerido.")
            return jsonify(fn(datos))
        except (ValueError, ZeroDivisionError) as e:
            return error(str(e))
        except Exception:
            return error("Error interno: " + traceback.format_exc(), 500)
    wrapper.__name__ = fn.__name__
    return wrapper


# ─── Módulo 1: Crecimiento puro dS/dt = rS ───────────────────────────────────
@app.route("/api/modulo1", methods=["POST"])
@endpoint
def api_modulo1(d):
    return resolver_modelo1(
        float(d["S0"]), float(d["r"]), float(d["T"])
    )


# ─── Módulo 2: Aportes constantes dS/dt = rS + k ─────────────────────────────
@app.route("/api/modulo2", methods=["POST"])
@endpoint
def api_modulo2(d):
    return resolver_modelo2(
        float(d["S0"]), float(d["r"]), float(d["k"]), float(d["T"])
    )


# ─── Módulo 2d: Aportes diferidos (Heaviside) ────────────────────────────────
@app.route("/api/modulo2d", methods=["POST"])
@endpoint
def api_modulo2d(d):
    return resolver_modelo2_diferido(
        float(d["S0"]), float(d["r"]), float(d["k"]),
        float(d["a"]), float(d["T"])
    )


# ─── Módulo 3: Bernoulli ──────────────────────────────────────────────────────
@app.route("/api/modulo3", methods=["POST"])
@endpoint
def api_modulo3(d):
    return resolver_modelo3_bernoulli(
        float(d["S0"]), float(d["r"]), float(d["alpha"]),
        float(d["n"]), float(d["T"])
    )


# ─── Módulo 4: Amortiguación S'' + cS' - r²S = k ─────────────────────────────
@app.route("/api/modulo4", methods=["POST"])
@endpoint
def api_modulo4(d):
    return resolver_modelo4_amortiguacion(
        float(d["S0"]), float(d["S1"]), float(d["c"]),
        float(d["r"]), float(d["k"]), float(d["T"])
    )


# ─── Módulo 5: Ciclos de mercado S'' + cS' + w0²S = F cos(wt) ────────────────
@app.route("/api/modulo5", methods=["POST"])
@endpoint
def api_modulo5(d):
    return resolver_modelo5_ciclos(
        float(d["S0"]), float(d["c"]), float(d["w0"]),
        float(d["F"]), float(d["w"]), float(d["T"])
    )


# ─── Módulo 6: Cauchy-Euler t²S'' + atS' + bS = 0 ───────────────────────────
@app.route("/api/modulo6", methods=["POST"])
@endpoint
def api_modulo6(d):
    return resolver_modelo6_cauchy_euler(
        float(d["S0"]), float(d["S1"]), float(d["a"]),
        float(d["b"]), float(d["t0"]), float(d["T"])
    )


# ─── Módulo 7: Sistema capital-deuda ─────────────────────────────────────────
@app.route("/api/modulo7", methods=["POST"])
@endpoint
def api_modulo7(d):
    return resolver_modelo7_capital_deuda(
        float(d["S0"]), float(d["D0"]), float(d["r"]),
        float(d["lam"]), float(d["alpha"]), float(d["beta"]),
        float(d["k"]), float(d["T"])
    )


# ─── Módulo 8: Comparador de escenarios ──────────────────────────────────────
@app.route("/api/comparar", methods=["POST"])
@endpoint
def api_comparar(d):
    return resolver_comparador(d["escenarios"])


if __name__ == "__main__":
    app.run(debug=True, port=5000)
