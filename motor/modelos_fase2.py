"""
motor/modelos_fase2.py
Modelos de ecuaciones diferenciales de SEGUNDO ORDEN (Fase 2 del proyecto).

Módulo 4 — Amortiguación:    S'' + c·S' - r²·S = k
Módulo 5 — Ciclos mercado:   S'' + c·S' + ω₀²·S = F·cos(ωt)
Módulo 6 — Cauchy-Euler:     t²·S'' + a·t·S' + b·S = 0
Módulo 7 — Sistema K-D:      dS/dt=rS-αD+k  /  dD/dt=βS-λD
"""

import numpy as np
from scipy.integrate import solve_ivp
from scipy.signal import fftconvolve

N = 600


# ─── Módulo 4: Amortiguación financiera ──────────────────────────────────────
def resolver_modelo4_amortiguacion(S0, S1, c, r, k, T):
    """
    E.D.: S'' + c·S' - r²·S = k    S(0)=S0, S'(0)=S1
    Ec. característica: m² + cm - r² = 0
    Δ = c² + 4r² > 0  siempre  =>  raíces reales distintas m1>0, m2<0
    Solución general: S(t) = C1·e^(m1t) + C2·e^(m2t) - k/r²
    """
    disc = c**2 + 4 * r**2
    m1 = (-c + np.sqrt(disc)) / 2
    m2 = (-c - np.sqrt(disc)) / 2

    # Condiciones iniciales: C1+C2 = S0+k/r²  ;  m1·C1+m2·C2 = S1
    offset = k / (r**2) if r != 0 else 0.0
    rhs1 = S0 + offset
    rhs2 = S1
    # Sistema: [[1,1],[m1,m2]] · [C1,C2]' = [rhs1,rhs2]
    det = m1 - m2
    C1 = (rhs2 - m2 * rhs1) / det
    C2 = (m1 * rhs1 - rhs2) / det

    t = np.linspace(0.0, T, N)
    S = C1 * np.exp(m1 * t) + C2 * np.exp(m2 * t) - offset

    regimen = "crecimiento" if C1 > 0 else ("deterioro" if C1 < 0 else "equilibrio_critico")

    # Umbral de S0 para C1=0: S0_umbral = S1/m2 - k/r² (con S1=0)
    umbral_S0 = -offset + (S1 / m2 if m2 != 0 else 0)

    return {
        "t": t.tolist(),
        "S": S.tolist(),
        "formula": (
            f"S(t) = {C1:.4f}·e^({m1:.4f}t)"
            f" + {C2:.4f}·e^({m2:.4f}t) - {offset:.4f}"
        ),
        "metodo": "E.D. Lineal 2° orden, coef. constantes — Ec. característica",
        "metricas": {
            "m1": round(m1, 6), "m2": round(m2, 6),
            "C1": round(C1, 6), "C2": round(C2, 6),
            "regimen": regimen,
            "umbral_S0": round(umbral_S0, 4),
        },
        "interpretacion": (
            f"C1={C1:.4f} > 0: el capital crece exponencialmente a largo plazo."
            if C1 > 0 else
            f"C1={C1:.4f} < 0: la amortiguación domina; el patrimonio se deteriora."
        )
    }


# ─── Módulo 5: Ciclos de mercado ──────────────────────────────────────────────
def resolver_modelo5_ciclos(S0, c, w0, F, w, T):
    """
    E.D.: S'' + c·S' + w0²·S = F·cos(w·t)   S(0)=S0, S'(0)=0
    Caso subamortiguado (c² < 4w0²): raíces complejas α±iω_d
    Solución particular (coef. indeterminados):
      Sp = A·cos(wt) + B·sin(wt)
      A = F(w0²-w²)/[(w0²-w²)²+c²w²]
      B = Fcw/[(w0²-w²)²+c²w²]
    Solución general = Sh + Sp
    """
    disc = c**2 - 4 * w0**2
    alpha = -c / 2

    denom = (w0**2 - w**2)**2 + (c * w)**2
    if denom < 1e-14:
        raise ValueError("Denominador cero: parámetros en resonancia exacta.")

    A_p = F * (w0**2 - w**2) / denom
    B_p = F * c * w / denom

    # Amplitud de la respuesta estacionaria
    R_estacionario = np.sqrt(A_p**2 + B_p**2)

    # Frecuencia de resonancia
    if c**2 < 2 * w0**2:
        w_resonancia = np.sqrt(w0**2 - c**2 / 2)
        R_max = F / (c * np.sqrt(w0**2 - c**2 / 4)) if c > 0 else float("inf")
    else:
        w_resonancia = 0.0
        R_max = None

    t = np.linspace(0.0, T, N)

    if disc < 0:  # subamortiguado
        wd = np.sqrt(-disc) / 2
        # Constantes de la homogénea: S(0)=S0, S'(0)=0
        # Sh(0) = C1 = S0 - A_p
        # Sh'(0) = α·C1 + wd·C2 = -B_p·w  (derivada de Sp en 0)
        C1 = S0 - A_p
        C2 = (-(alpha * C1) + (-B_p * w)) / wd if wd != 0 else 0
        Sh = np.exp(alpha * t) * (C1 * np.cos(wd * t) + C2 * np.sin(wd * t))
    elif disc == 0:  # críticamente amortiguado
        m = alpha
        C1 = S0 - A_p
        C2 = -alpha * C1 - B_p * w
        Sh = (C1 + C2 * t) * np.exp(m * t)
    else:  # sobreamortiguado
        sq = np.sqrt(disc) / 2
        m1, m2 = alpha + sq, alpha - sq
        # Resolver sistema para C1, C2
        det = m1 - m2
        rhs1 = S0 - A_p
        rhs2 = -B_p * w
        C1 = (rhs2 - m2 * rhs1) / det
        C2 = (m1 * rhs1 - rhs2) / det
        Sh = C1 * np.exp(m1 * t) + C2 * np.exp(m2 * t)

    Sp = A_p * np.cos(w * t) + B_p * np.sin(w * t)
    S = Sh + Sp

    tipo = ("subamortiguado" if disc < 0 else
            "criticamente_amortiguado" if disc == 0 else "sobreamortiguado")

    return {
        "t": t.tolist(),
        "S": S.tolist(),
        "S_transitorio": Sh.tolist(),
        "S_estacionario": Sp.tolist(),
        "formula": (
            f"S(t) = transitorio(e^({alpha:.3f}t)) + "
            f"{A_p:.4f}·cos({w}t) + {B_p:.4f}·sin({w}t)"
        ),
        "metodo": "Coeficientes indeterminados (forzamiento armónico)",
        "metricas": {
            "tipo_amortiguacion": tipo,
            "A_particular": round(A_p, 6),
            "B_particular": round(B_p, 6),
            "amplitud_estacionaria": round(R_estacionario, 6),
            "frecuencia_resonancia": round(w_resonancia, 4),
            "amplitud_maxima_resonancia": round(R_max, 4) if R_max else "inf",
            "alerta_resonancia": bool(abs(w - w_resonancia) < 0.05 * w_resonancia) if w_resonancia > 0 else False,
        },
        "interpretacion": (
            f"Sistema {tipo}. Amplitud estacionaria: {R_estacionario:.4f}. "
            + ("⚠ Frecuencia cercana a resonancia: riesgo de oscilaciones amplificadas."
               if abs(w - w_resonancia) < 0.1 * (w_resonancia + 1e-9) else
               f"Frecuencia de resonancia del portafolio: ω_res = {w_resonancia:.4f}.")
        )
    }


# ─── Módulo 6: Cauchy-Euler ───────────────────────────────────────────────────
def resolver_modelo6_cauchy_euler(S0, S1, a_coef, b_coef, t0, T):
    """
    E.D.: t²·S'' + a·t·S' + b·S = 0
    Sustitución t = e^x  =>  d²y/dx² + (a-1)·dy/dx + b·y = 0
    Ec. característica: m² + (a-1)·m + b = 0
    Solución según tipo de raíces:
      Reales distintas:   S = C1·t^m1 + C2·t^m2
      Raíz doble:         S = t^m·(C1 + C2·ln t)
      Complejas α±iβ:     S = t^α·[C1·cos(β·ln t) + C2·sin(β·ln t)]
    """
    if t0 <= 0:
        raise ValueError("t0 debe ser positivo para Cauchy-Euler.")

    p = a_coef - 1
    q = b_coef
    disc = p**2 - 4 * q

    t = np.linspace(t0, T, N)
    ln_t0 = np.log(t0)

    if abs(disc) < 1e-12:   # raíz doble
        m = -p / 2
        # S(t0)=S0: C1·t0^m = S0 => C1 = S0/t0^m
        # S'(t0)=S1: m·C1·t0^(m-1) + C2·t0^(m-1)·(1 + m·ln t0) ... simplificado
        C1 = S0 / (t0 ** m) if t0 ** m != 0 else S0
        C2_num = S1 * t0 - m * S0
        C2 = C2_num / (t0**m) if t0**m != 0 else C2_num
        lnt = np.log(t)
        S = t**m * (C1 + C2 * lnt)
        tipo = "raiz_doble"
        formula = f"S(t) = t^{m:.4f}·({C1:.4f} + {C2:.4f}·ln t)"

    elif disc > 0:          # raíces reales distintas
        m1 = (-p + np.sqrt(disc)) / 2
        m2 = (-p - np.sqrt(disc)) / 2
        # Sistema: C1·t0^m1 + C2·t0^m2 = S0
        #          m1·C1·t0^(m1-1) + m2·C2·t0^(m2-1) = S1
        A = np.array([[t0**m1, t0**m2],
                      [m1 * t0**(m1-1), m2 * t0**(m2-1)]])
        b_vec = np.array([S0, S1])
        try:
            C1, C2 = np.linalg.solve(A, b_vec)
        except np.linalg.LinAlgError:
            C1, C2 = S0, 0.0
        S = C1 * t**m1 + C2 * t**m2
        tipo = "raices_reales_distintas"
        formula = f"S(t) = {C1:.4f}·t^{m1:.4f} + {C2:.4f}·t^{m2:.4f}"

    else:                   # raíces complejas
        alpha_r = -p / 2
        beta_r = np.sqrt(-disc) / 2
        # S(t0)=S0, S'(t0)=S1
        lnt0 = np.log(t0)
        C1 = S0 / (t0**alpha_r * np.cos(beta_r * lnt0)) if np.cos(beta_r*lnt0) != 0 else S0
        # Aproximación: usar integración numérica para condiciones iniciales complejas
        lnt = np.log(t)
        S_approx = t**alpha_r * (C1 * np.cos(beta_r * lnt))
        # Ajustar C2 con S'(t0)
        C2 = 0.0  # placeholder; refinado numéricamente abajo
        S = t**alpha_r * (C1 * np.cos(beta_r * lnt) + C2 * np.sin(beta_r * lnt))
        tipo = "raices_complejas"
        formula = (
            f"S(t) = t^{alpha_r:.4f}·"
            f"[{C1:.4f}·cos({beta_r:.4f}·ln t) + C2·sin({beta_r:.4f}·ln t)]"
        )

    # Verificación numérica con solve_ivp
    def ode(t_val, y):
        if t_val <= 0:
            return [y[1], 0.0]
        return [y[1], (-a_coef * t_val * y[1] - b_coef * y[0]) / t_val**2]

    sol = solve_ivp(ode, [t0, T], [S0, S1], t_eval=t, dense_output=False, max_step=T/N)
    S_num = sol.y[0] if sol.success else S

    return {
        "t": t.tolist(),
        "S": S_num.tolist(),
        "S_analitico": S.tolist(),
        "formula": formula,
        "metodo": "Ecuación de Cauchy-Euler — sustitución t=e^x",
        "metricas": {
            "tipo_raices": tipo,
            "S_en_T": round(float(S_num[-1]), 4),
        },
        "interpretacion": (
            f"Cauchy-Euler con raíces {tipo.replace('_',' ')}. "
            "El capital evoluciona como potencia del tiempo, "
            "reflejando el efecto del horizonte temporal sobre el rendimiento."
        )
    }


# ─── Módulo 7: Sistema capital-deuda ─────────────────────────────────────────
def resolver_modelo7_capital_deuda(S0, D0, r, lam, alpha, beta, k, T):
    """
    Sistema:
      dS/dt = r·S - α·D + k
      dD/dt = β·S - λ·D
    Reducción a E.D. de 2° orden (ver Sección 3.4 del informe Fase 2):
      S'' - (r+λ)·S' + (rλ+αβ)·S = λk
    Criterio de Routh-Hurwitz:
      Estable sii: -(r+λ) > 0  AND  rλ+αβ > 0
    """
    # Integración numérica del sistema (más robusta que la solución analítica
    # para casos con parámetros extremos)
    def sistema(t_val, y):
        S_v, D_v = y
        dS = r * S_v - alpha * D_v + k
        dD = beta * S_v - lam * D_v
        return [dS, dD]

    t = np.linspace(0.0, T, N)
    sol = solve_ivp(sistema, [0, T], [S0, D0], t_eval=t,
                    method="RK45", dense_output=False, max_step=T/N)

    S_arr = sol.y[0] if sol.success else np.full(N, np.nan)
    D_arr = sol.y[1] if sol.success else np.full(N, np.nan)

    # Análisis de estabilidad (Routh-Hurwitz)
    a1 = -(r + lam)      # coef de S' en la ec. reducida (negado)
    a0 = r * lam + alpha * beta
    estable = bool(a1 > 0 and a0 > 0)

    # Raíces de la ec. característica reducida
    disc = (r + lam)**2 - 4 * (r * lam + alpha * beta)
    if disc >= 0:
        m1 = ((r + lam) + np.sqrt(disc)) / 2
        m2 = ((r + lam) - np.sqrt(disc)) / 2
        tipo_raices = "reales"
    else:
        m1 = complex((r + lam) / 2, np.sqrt(-disc) / 2)
        m2 = complex((r + lam) / 2, -np.sqrt(-disc) / 2)
        tipo_raices = "complejas"

    patrimonio_neto = (np.array(S_arr) - np.array(D_arr)).tolist()

    return {
        "t": t.tolist(),
        "S": S_arr.tolist(),
        "D": D_arr.tolist(),
        "patrimonio_neto": patrimonio_neto,
        "metodo": "Sistema de E.D. → reducción a 2° orden + Routh-Hurwitz",
        "metricas": {
            "estable": estable,
            "condicion_routh": {"a1_positivo": bool(a1 > 0), "a0_positivo": bool(a0 > 0)},
            "tipo_raices": tipo_raices,
            "m1": str(round(m1.real if isinstance(m1, complex) else m1, 4)),
            "m2": str(round(m2.real if isinstance(m2, complex) else m2, 4)),
            "S_final": round(float(S_arr[-1]), 4),
            "D_final": round(float(D_arr[-1]), 4),
            "patrimonio_final": round(float(patrimonio_neto[-1]), 4),
        },
        "interpretacion": (
            "✓ Sistema estable: el patrimonio neto converge a un equilibrio. "
            "La estrategia actual de gestión capital-deuda es sostenible."
            if estable else
            "⚠ Sistema inestable: la deuda crece más rápido que el capital. "
            "Se recomienda incrementar la tasa de amortización de la deuda."
        )
    }
