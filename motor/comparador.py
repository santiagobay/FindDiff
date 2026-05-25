"""
motor/comparador.py
Módulo 8 — Comparador de escenarios.
Ejecuta múltiples módulos con distintos parámetros y retorna
todos los resultados para superponerlos en una misma gráfica.
"""

from motor.modelos_fase1 import (
    resolver_modelo1, resolver_modelo2,
    resolver_modelo2_diferido, resolver_modelo3_bernoulli,
)
from motor.modelos_fase2 import (
    resolver_modelo4_amortiguacion, resolver_modelo5_ciclos,
    resolver_modelo6_cauchy_euler, resolver_modelo7_capital_deuda,
)

MAPA = {
    "modulo1":  resolver_modelo1,
    "modulo2":  resolver_modelo2,
    "modulo2d": resolver_modelo2_diferido,
    "modulo3":  resolver_modelo3_bernoulli,
    "modulo4":  resolver_modelo4_amortiguacion,
    "modulo5":  resolver_modelo5_ciclos,
    "modulo6":  resolver_modelo6_cauchy_euler,
    "modulo7":  resolver_modelo7_capital_deuda,
}

COLORES = ["#2C5282", "#1B4332", "#744210", "#742A2A",
           "#44337A", "#234E52", "#7B341E", "#2D3748"]


def resolver_comparador(escenarios: list) -> dict:
    """
    escenarios: lista de {modulo: str, etiqueta: str, params: dict}
    Retorna lista de {etiqueta, t, S, color} para Chart.js.
    """
    resultados = []
    errores = []

    for i, esc in enumerate(escenarios[:8]):   # máx 8 curvas
        modulo = esc.get("modulo", "")
        etiqueta = esc.get("etiqueta", f"Escenario {i+1}")
        params = esc.get("params", {})
        color = COLORES[i % len(COLORES)]

        fn = MAPA.get(modulo)
        if fn is None:
            errores.append(f"Módulo '{modulo}' no reconocido.")
            continue

        try:
            res = fn(**{k: float(v) for k, v in params.items()})
            resultados.append({
                "etiqueta": etiqueta,
                "t": res["t"],
                "S": res["S"],
                "color": color,
                "formula": res.get("formula", ""),
                "interpretacion": res.get("interpretacion", ""),
            })
        except Exception as e:
            errores.append(f"Error en '{etiqueta}': {str(e)}")

    return {"resultados": resultados, "errores": errores}
