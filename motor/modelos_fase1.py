"""
motor/modelos_fase1.py
Modelos de ecuaciones diferenciales de PRIMER ORDEN (Fase 1 del proyecto).

Módulo 1 — Crecimiento puro:      dS/dt = rS,        S(0)=S0
Módulo 2 — Aportes constantes:    dS/dt = rS + k,    S(0)=S0
Módulo 2d— Aportes diferidos:     dS/dt = rS + k·u(t-a)  [Laplace + Heaviside]
Módulo 3 — Bernoulli:             dS/dt = rS + α·S^n

Cada función retorna un dict serializable a JSON con:
  - t[]:        vector de tiempo
  - S[]:        vector de saldo
  - formula:    representación textual de la solución analítica
  - métricas:   valores derivados relevantes (duplicación, equilibrio, etc.)
"""

import numpy as np
from scipy.integrate import solve_ivp

N = 600  # puntos en el vector de tiempo


# ─── Módulo 1: Crecimiento puro ───────────────────────────────────────────────
def resolver_modelo1(S0: float, r: float, T: float) -> dict:
    """
    Solución: S(t) = S0 · e^(r·t)
    Derivada vía Transformada de Laplace:
      L{S'} = rL{S}  =>  sS̃ - S0 = rS̃  =>  S̃ = S0/(s-r)  =>  S(t) = S0·e^(rt)
    """
    if r == 0:
        raise ValueError("La tasa r no puede ser cero en el modelo de crecimiento puro.")

    t = np.linspace(0.0, T, N)
    S = S0 * np.exp(r * t)

    t_duplicacion = np.log(2) / r if r > 0 else None
    S_en_T = float(S[-1])

    return {
        "t": t.tolist(),
        "S": S.tolist(),
        "formula": f"S(t) = {S0:.2f} · e^({r:.4f}·t)",
        "metodo": "Variables separables / Transformada de Laplace",
        "metricas": {
            "t_duplicacion": round(t_duplicacion, 4) if t_duplicacion else "N/A (r≤0)",
            "S_en_T": round(S_en_T, 4),
            "tasa_efectiva_anual": round((np.exp(r) - 1) * 100, 4),
        },
        "interpretacion": (
            f"Con tasa continua {r*100:.2f}% anual, "
            f"el capital se duplica en {round(t_duplicacion,2)} años."
            if r > 0 else
            "La tasa es negativa: el capital decrece exponencialmente."
        )
    }


# ─── Módulo 2: Aportes constantes ────────────────────────────────────────────
def resolver_modelo2(S0: float, r: float, k: float, T: float,
                     meta: float = None) -> dict:
    """
    Solución: S(t) = (S0 + k/r)·e^(r·t) - k/r
    Derivada vía Transformada de Laplace (ver Sección 2.3 del informe Fase 3):
      sS̃ - S0 = rS̃ + k/s
      S̃ = S0/(s-r) + k/[s(s-r)]
      Fracciones parciales: k/[s(s-r)] = (k/r)[1/(s-r) - 1/s]
      S(t) = (S0+k/r)·e^(rt) - k/r
    """
    if r == 0:
        raise ValueError("La tasa r no puede ser cero.")

    t = np.linspace(0.0, T, N)
    C1 = S0 + k / r
    S = C1 * np.exp(r * t) - k / r

    equilibrio = -k / r  # S* tal que dS/dt = 0
    S_en_T = float(S[-1])

    # Tiempo hasta meta financiera
    t_meta = None
    if meta is not None and meta > 0:
        arg = (meta + k / r) / C1
        if arg > 0:
            t_meta = round(np.log(arg) / r, 4)

    return {
        "t": t.tolist(),
        "S": S.tolist(),
        "formula": f"S(t) = ({C1:.2f})·e^({r:.4f}·t) - {k/r:.2f}",
        "metodo": "E.D. Lineal / Factor integrante / Transformada de Laplace",
        "metricas": {
            "C1": round(C1, 4),
            "equilibrio": round(equilibrio, 4),
            "S_en_T": round(S_en_T, 4),
            "t_meta": t_meta,
        },
        "interpretacion": (
            f"Punto de equilibrio S* = {equilibrio:.2f}. "
            + (f"El capital alcanza la meta en t = {t_meta} años." if t_meta else "")
        )
    }


# ─── Módulo 2d: Aportes diferidos (Transformada de Laplace + Heaviside) ───────
def resolver_modelo2_diferido(S0: float, r: float, k: float,
                               a: float, T: float) -> dict:
    """
    Modelo: dS/dt = rS + k·u(t-a),  S(0)=S0
    Solución via 2do Teorema de Traslación (ver Sección 2.5 del informe Fase 3):
      L{k·u(t-a)} = k·e^(-as)/s
      S̃(s) = S0/(s-r) + k·e^(-as)/[s(s-r)]
      S(t) = S0·e^(rt) + (k/r)·(e^(r(t-a))-1)·u(t-a)

    El factor u(t-a) implementado con np.where: activa el aporte solo para t >= a.
    """
    if r == 0:
        raise ValueError("La tasa r no puede ser cero.")

    t = np.linspace(0.0, T, N)

    comp1 = S0 * np.exp(r * t)                                      # capital base
    comp2 = np.where(t >= a, (k / r) * (np.exp(r * (t - a)) - 1), 0.0)  # Heaviside
    S = comp1 + comp2

    return {
        "t": t.tolist(),
        "S": S.tolist(),
        "S_sin_aportes": comp1.tolist(),   # para visualizar la diferencia
        "formula": (
            f"S(t) = {S0:.2f}·e^({r:.4f}t)"
            f" + ({k/r:.2f})·(e^({r:.4f}(t-{a}))-1)·u(t-{a})"
        ),
        "metodo": "Transformada de Laplace — 2do Teorema de Traslación",
        "metricas": {
            "S_antes_de_a": round(float(S0 * np.exp(r * a)), 4),
            "S_en_T": round(float(S[-1]), 4),
            "ganancia_por_esperar": round(
                float(S[-1]) - float((S0 + k/r) * np.exp(r * T) - k/r), 4
            ),
        },
        "interpretacion": (
            f"Sin aportes los primeros {a} años, el capital llega a "
            f"{round(float(S0*np.exp(r*a)),2)}. "
            f"Con aportes desde t={a}, el capital final es {round(float(S[-1]),2)}."
        )
    }


# ─── Módulo 3: Bernoulli ──────────────────────────────────────────────────────
def resolver_modelo3_bernoulli(S0: float, r: float, alpha: float,
                                n: float, T: float) -> dict:
    """
    Modelo: dS/dt = rS + α·S^n   (n ≠ 1)
    Sustitución v = S^(1-n):
      dv/dt = (1-n)·S^(-n)·dS/dt = (1-n)(r·v + α)
      => dv/dt - (1-n)·r·v = (1-n)·α   [lineal en v]
    Solución vía factor integrante, luego S = v^(1/(1-n)).
    Para n=2 (cuadrático): posible singularidad en tiempo finito (burbuja).
    """
    if n == 1:
        raise ValueError("n=1 no es ecuación de Bernoulli; use el Módulo 2.")

    m = 1 - n
    # Solución analítica de v: dv/dt = m·r·v + m·α
    # v(t) = (v0 + α/r)·e^(m·r·t) - α/r
    v0 = S0 ** m
    A = v0 + alpha / r if r != 0 else v0

    t = np.linspace(0.0, T, N)

    if r != 0:
        v = A * np.exp(m * r * t) - alpha / r
    else:
        # r=0: dv/dt = m·α  =>  v = v0 + m·α·t
        v = v0 + m * alpha * t

    # Detectar singularidad (v cruza cero)
    singularidad = None
    cruces = np.where(np.diff(np.sign(v)))[0]
    if len(cruces) > 0:
        singularidad = round(float(t[cruces[0]]), 4)
        v = np.where(np.abs(v) < 1e-10, np.nan, v)

    # S = v^(1/m), cuidando signo
    with np.errstate(invalid='ignore', divide='ignore'):
        S = np.where(v > 0, v ** (1 / m), np.nan)

    alerta_burbuja = singularidad is not None and alpha < 0 and n == 2

    return {
        "t": t.tolist(),
        "S": [None if np.isnan(x) else round(x, 6) for x in S],
        "formula": (
            f"v(t)=S^({m:.2f}); v(t)=({A:.4f})·e^({m*r:.4f}t)-{alpha/r if r!=0 else 0:.4f}; "
            f"S(t)=v^({1/m:.4f})"
        ),
        "metodo": "Ecuación de Bernoulli — sustitución v = S^(1-n)",
        "metricas": {
            "exponente_n": n,
            "singularidad_en_t": singularidad,
            "alerta_burbuja": alerta_burbuja,
        },
        "interpretacion": (
            f"⚠ El capital diverge en t≈{singularidad} años (singularidad de Bernoulli). "
            "Esto modela un escenario de crecimiento insostenible (burbuja financiera)."
            if alerta_burbuja else
            "El capital evoluciona de forma no lineal según la ecuación de Bernoulli."
        )
    }
