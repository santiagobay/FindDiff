/**
 * main.js — Lógica principal del frontend de FinDiff.
 *
 * Responsabilidades:
 *  1. Escuchar clicks en los botones del sidebar.
 *  2. Renderizar el formulario correspondiente al módulo activo.
 *  3. Leer y validar los inputs del formulario.
 *  4. Llamar al endpoint correcto via api.js.
 *  5. Pasar los datos a graficas.js para visualización.
 *  6. Renderizar las métricas e interpretación en el panel de resultados.
 */

// ─── Configuración de módulos ──────────────────────────────────────────────
const MODULOS = {
  "1": {
    titulo: "Módulo 1 — Crecimiento Puro",
    ecuacion: "dS/dt = r · S     S(0) = S₀\nSolución: S(t) = S₀ · e^(r·t)",
    tpl: "tpl-1",
    metodo: "Variables separables / Transformada de Laplace",
    color: "#2C5282",
    emoji: "📈",
    tagline: "¿Cuánto crecerá mi dinero si no lo toco?",
    explicacion: `
      <p>Imagina que depositas dinero en una cuenta de ahorros o en un fondo de inversión
      y simplemente lo dejas ahí, sin agregar ni retirar nada. Con el tiempo, los intereses
      generan más intereses — eso es el <strong>interés compuesto</strong>, y es exactamente
      lo que este módulo calcula.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🌱</span>
        <span>Piénsalo como una planta: entre más grande sea, más rápido crece. Un capital
        mayor genera más intereses, que a su vez hacen crecer el capital aún más rápido.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Capital inicial (S₀)</span>
          <span class="exp-param-desc">El dinero con el que arrancas hoy.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Tasa r</span>
          <span class="exp-param-desc">El rendimiento anual de tu inversión en decimal.
          Ej: 8% anual → escribe 0.08</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Horizonte T</span>
          <span class="exp-param-desc">Cuántos años quieres proyectar.</span>
        </div>
      </div>

      <div class="exp-resultado-esperado">
        <strong>¿Qué te dice el resultado?</strong> La gráfica muestra exactamente cuánto
        tendrás en cada año. También calcula el <em>tiempo de duplicación</em>: el número
        de años que tarda tu capital en doblarse.
      </div>`,
  },
  "2": {
    titulo: "Módulo 2 — Aportes Constantes",
    ecuacion: "dS/dt = r·S + k     S(0) = S₀\nSolución: S(t) = (S₀+k/r)·e^(rt) − k/r",
    tpl: "tpl-2",
    metodo: "E.D. Lineal — Factor integrante / Laplace",
    color: "#1B4332",
    emoji: "💰",
    tagline: "Ahorro con depósitos regulares — o retiros de una pensión.",
    explicacion: `
      <p>La mayoría de personas no solo deja el dinero quieto: cada mes depositan una
      parte de su sueldo, o cada mes retiran dinero de sus ahorros para vivir. Este módulo
      modela exactamente eso.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🚿</span>
        <span>Imagina una tina con un caño abierto (los intereses llenan la tina) y tú
        además puedes abrir otra llave para agregar más agua (aportes) o abrir el desagüe
        para sacar (retiros). Este módulo calcula el nivel del agua en todo momento.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Capital inicial (S₀)</span>
          <span class="exp-param-desc">Lo que tienes hoy en la cuenta.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Tasa r</span>
          <span class="exp-param-desc">Rendimiento anual continuo (ej: 0.06 = 6% anual).</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Aporte k</span>
          <span class="exp-param-desc">Dinero que agregas por año (positivo) o que retiras
          (negativo). Ej: si ahorras $200 al mes, k = 2400 al año.</span>
        </div>
      </div>

      <div class="exp-alerta">
        <span>💡</span>
        <span>El módulo también calcula el <strong>punto de equilibrio</strong>: el saldo
        al que los intereses generados igualan exactamente los retiros. Si estás retirando
        más de lo que generan los intereses, el capital cae — el software te lo advierte.</span>
      </div>`,
  },
  "2d": {
    titulo: "Módulo 2d — Aportes Diferidos",
    ecuacion: "dS/dt = r·S + k·u(t−a)     S(0) = S₀\nSolución: S₀·e^(rt) + (k/r)(e^(r(t−a))−1)·u(t−a)",
    tpl: "tpl-2d",
    metodo: "Transformada de Laplace — 2do Teorema de Traslación",
    color: "#44337A",
    emoji: "⏳",
    tagline: "Empiezo a ahorrar en el futuro — ¿cuánto pierdo por esperar?",
    explicacion: `
      <p>¿Alguna vez pensaste "voy a empezar a ahorrar cuando me aumenten el sueldo"?
      Este módulo calcula exactamente cuánto dinero <strong>pierdes</strong> por esperar
      en lugar de empezar hoy.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">⏰</span>
        <span>Es como un semáforo en verde desde el día 1 para los intereses, pero el
        carril de los aportes está en rojo hasta que tú lo actives. El modelo calcula
        ambas trayectorias y las superpone en la misma gráfica para que veas la diferencia.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Inicio de aportes (a)</span>
          <span class="exp-param-desc">El año en que empiezas a depositar. Si es 0, es
          igual al Módulo 2. Si es 3, empiezas en 3 años.</span>
        </div>
      </div>

      <div class="exp-resultado-esperado">
        <strong>¿Qué te dice el resultado?</strong> La gráfica muestra dos curvas:
        la azul es tu capital real (esperando hasta el año <em>a</em>), y la gris
        punteada es cómo habría crecido si hubieras empezado desde el primer día.
        La diferencia es el <em>costo de la espera</em>.
      </div>`,
  },
  "3": {
    titulo: "Módulo 3 — Rendimiento No Lineal",
    ecuacion: "dS/dt = r·S + α·S^n     S(0) = S₀",
    tpl: "tpl-3",
    metodo: "Ecuación de Bernoulli",
    color: "#744210",
    emoji: "🌀",
    tagline: "Cuando más capital tienes, mejor tasa consigues — o peor.",
    explicacion: `
      <p>En inversiones reales, la tasa de rendimiento no siempre es fija. Algunos fondos
      le ofrecen <strong>mejores condiciones a quienes más invierten</strong> (economías de
      escala). Otros instrumentos, como ciertos derivados, pueden volverse explosivamente
      rentables — o colapsar — dependiendo del tamaño de la posición.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">⚠️</span>
        <span>Piénsalo como una bola de nieve: a veces rueda cada vez más rápido y se
        hace enorme (crecimiento acelerado), pero a veces la pendiente termina en un
        precipicio (singularidad — la bola desaparece en tiempo finito). Este módulo
        detecta cuándo ocurre cada caso.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Coeficiente α (alpha)</span>
          <span class="exp-param-desc">Qué tan fuerte es el efecto de escala. Un número
          pequeño (0.00001) modela un fondo con leve mejora de tasa. Valores grandes
          modelan apalancamiento agresivo.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Exponente n</span>
          <span class="exp-param-desc">La "forma" de la no linealidad. n=2 es el caso
          más común (rendimiento proporcional al cuadrado del capital).</span>
        </div>
      </div>

      <div class="exp-alerta">
        <span>🚨</span>
        <span>Si el software detecta una <strong>singularidad</strong> (punto donde el
        modelo matemáticamente "explota"), te mostrará en qué año ocurre y una alerta
        de burbuja financiera. Esto no significa que perderás todo — significa que el
        modelo deja de ser válido y deberías cambiar de estrategia.</span>
      </div>`,
  },
  "4": {
    titulo: "Módulo 4 — Amortiguación Financiera",
    ecuacion: "S'' + c·S' − r²·S = k\nS(0)=S₀,  S'(0)=S₁",
    tpl: "tpl-4",
    metodo: "E.D. Lineal 2° orden — Ecuación característica",
    color: "#234E52",
    emoji: "🔧",
    tagline: "Costos e impuestos frenan el crecimiento — ¿cuánto importa eso?",
    explicacion: `
      <p>Ninguna inversión es gratis: hay comisiones de gestión, impuestos sobre
      rendimientos, spreads de compra-venta. Todos esos costos <strong>frenan</strong>
      el crecimiento del capital. Este módulo los modela como una "resistencia" que
      se opone al cambio del saldo.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🏊</span>
        <span>Nadar en agua es más lento que correr en tierra: el agua ejerce resistencia
        proporcional a la velocidad. Aquí, los costos financieros ejercen resistencia
        proporcional a qué tan rápido está creciendo tu capital. A mayor fricción,
        más lento crece — o incluso puede volverse negativo.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Coef. amortiguación (c)</span>
          <span class="exp-param-desc">Resume todos los costos que frenan el crecimiento.
          Un fondo con 2% anual de comisión más impuestos podría tener c ≈ 0.03.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Velocidad inicial (S₁)</span>
          <span class="exp-param-desc">Qué tan rápido estaba creciendo tu capital
          justo al inicio. Si empiezas de cero crecimiento, usa 0.</span>
        </div>
      </div>

      <div class="exp-resultado-esperado">
        <strong>Concepto clave — el umbral:</strong> el software calcula el capital
        mínimo necesario para que el rendimiento supere los costos y el patrimonio
        crezca. <em>Por debajo de ese umbral, los costos ganan y el capital se
        deteriora aunque la tasa sea positiva.</em>
      </div>`,
  },
  "5": {
    titulo: "Módulo 5 — Ciclos de Mercado",
    ecuacion: "S'' + c·S' + ω₀²·S = F·cos(ω·t)\nS(0)=S₀,  S'(0)=0",
    tpl: "tpl-5",
    metodo: "Coeficientes indeterminados — Forzamiento armónico",
    color: "#742A2A",
    emoji: "📊",
    tagline: "El mercado sube y baja en ciclos — ¿cuándo te afecta más?",
    explicacion: `
      <p>La economía tiene ciclos: expansión, enfriamiento, recesión, recuperación —
      y se repiten. Los rendimientos de un portafolio oscilan con esos ciclos.
      Este módulo calcula cómo esas oscilaciones del mercado afectan tu capital,
      y en particular detecta el fenómeno más peligroso: la <strong>resonancia</strong>.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🎸</span>
        <span>Una guitarra tiene cuerdas que vibran en frecuencias propias. Si alguien
        canta exactamente esa nota cerca de la guitarra, la cuerda vibra sola —
        se amplifica. Lo mismo pasa con tu portafolio: si el ciclo económico tiene
        la misma "frecuencia" que tu portafolio, las ganancias y pérdidas se amplifican
        muchísimo. A eso se le llama resonancia financiera.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Frecuencia natural (ω₀)</span>
          <span class="exp-param-desc">La "velocidad propia" de reacción de tu portafolio.
          Un portafolio concentrado en renta variable tiene ω₀ alto; uno conservador, bajo.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Frecuencia del ciclo (ω)</span>
          <span class="exp-param-desc">Qué tan rápido oscila el mercado. Prueba poner
          ω muy cercano a ω₀ y verás la resonancia en acción.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Amplitud del ciclo (F)</span>
          <span class="exp-param-desc">Qué tan grandes son las oscilaciones del mercado.
          En un año normal podría ser pequeño; en una crisis, grande.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Amortiguación (c)</span>
          <span class="exp-param-desc">La diversificación del portafolio. Más diversificado
          = c más alto = menor riesgo de resonancia.</span>
        </div>
      </div>

      <div class="exp-resultado-esperado">
        <strong>¿Qué te dice el resultado?</strong> La gráfica muestra tres curvas:
        el capital total, la parte que se extingue con el tiempo (transitorio) y
        la parte que persiste para siempre (estado estacionario). El software
        también calcula la frecuencia exacta de resonancia y te avisa si tu ω
        está peligrosamente cerca.
      </div>`,
  },
  "6": {
    titulo: "Módulo 6 — Horizonte Temporal (Cauchy-Euler)",
    ecuacion: "t²·S'' + a·t·S' + b·S = 0\nSustitución: t = e^x → coef. constantes",
    tpl: "tpl-6",
    metodo: "Ecuación de Cauchy-Euler",
    color: "#7B341E",
    emoji: "⏱",
    tagline: "Para inversiones de largo plazo donde el tiempo mismo cambia las reglas.",
    explicacion: `
      <p>Algunos instrumentos financieros <strong>no tienen una tasa fija</strong>: el
      rendimiento que ofrecen depende de cuánto tiempo llevas invertido o de cuánto
      tiempo falta para que venzan. Un bono de 20 años no se comporta igual en el año 1
      que en el año 18. Este módulo captura eso.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🏔️</span>
        <span>Imagina escalar una montaña: al principio la pendiente es suave y subes
        lento (pocos intereses acumulados), pero a medida que subes, cada paso recorre
        más altura (el tiempo acumulado amplifica el rendimiento). El modelo matemático
        de esto se llama Cauchy-Euler, y es lo que usa este módulo.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Coeficiente a</span>
          <span class="exp-param-desc">Controla la prima de plazo: cómo aumenta el
          rendimiento con el tiempo. Valores cercanos a 1 dan crecimiento moderado;
          valores altos, crecimiento acelerado.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Coeficiente b</span>
          <span class="exp-param-desc">Captura el costo de oportunidad temporal —
          qué tanto "pesa" el tiempo en contra del rendimiento.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Tiempo inicial (t₀)</span>
          <span class="exp-param-desc">Debe ser mayor que cero. Ej: si la inversión
          ya tiene 1 año, t₀ = 1.</span>
        </div>
      </div>

      <div class="exp-resultado-esperado">
        <strong>¿Qué te dice el resultado?</strong> Dependiendo de los parámetros,
        el capital crece como potencia del tiempo (más lento o más rápido que
        el interés compuesto normal), o bien oscila con amplitud que cambia con
        los años. Útil para bonos soberanos, CDTs de largo plazo y fondos de pensiones.
      </div>`,
  },
  "7": {
    titulo: "Módulo 7 — Sistema Capital-Deuda",
    ecuacion: "dS/dt = r·S − α·D + k\ndD/dt = β·S − λ·D",
    tpl: "tpl-7",
    metodo: "Sistema de E.D. + Criterio de estabilidad",
    color: "#1A2F5E",
    emoji: "⚖",
    tagline: "¿Tu deuda crece más rápido que tu capital? El modelo te lo dice con exactitud.",
    explicacion: `
      <p>En la vida real, el capital y la deuda no evolucionan de forma independiente:
      los intereses de la deuda reducen tu capacidad de ahorro, y tu capital puede
      usarse como garantía para acceder a más crédito. Este módulo modela esa
      <strong>interacción</strong> entre lo que tienes y lo que debes, y determina
      si tu situación financiera es estable o si está en una trayectoria de deterioro.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">⚖️</span>
        <span>Imagina una balanza: en un platillo está tu capital creciendo, en el otro
        está tu deuda también creciendo. El módulo calcula cuál platillo "gana" con
        el tiempo y si en algún momento la balanza se estabiliza, o si uno de los dos
        lados se dispara sin control.</span>
      </div>

      <div class="exp-params">
        <div class="exp-param-item">
          <span class="exp-param-nombre">Tasa de rendimiento (r)</span>
          <span class="exp-param-desc">Qué tan rápido crece tu capital por sus propios intereses.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Tasa de amortización (λ)</span>
          <span class="exp-param-desc">Qué tan rápido pagas tu deuda. Si pagas un crédito
          de 10 años, λ ≈ 0.10 (10% del saldo cada año).</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Carga de la deuda (α)</span>
          <span class="exp-param-desc">Cuánto consume la deuda de tu flujo de capital.
          Una deuda hipotecaria con cuota mensual alta tiene α elevado.</span>
        </div>
        <div class="exp-param-item">
          <span class="exp-param-nombre">Efecto del capital (β)</span>
          <span class="exp-param-desc">Si tu capital sirve como aval para obtener más
          crédito (apalancamiento), β > 0. Si no, β = 0.</span>
        </div>
      </div>

      <div class="exp-alerta">
        <span>🔴</span>
        <span><strong>El veredicto de estabilidad:</strong> el software calcula
        matemáticamente si tu sistema es <em>estable</em> (la deuda se paga y el
        capital prospera) o <em>inestable</em> (la deuda crece más rápido que el
        capital y el patrimonio neto se deteriora). También muestra la gráfica
        del patrimonio neto (capital menos deuda) a lo largo del tiempo.</span>
      </div>`,
  },
  "comparar": {
    titulo: "Módulo 8 — Comparador de Escenarios",
    ecuacion: "Superpone hasta 8 escenarios en una misma gráfica\npara comparar estrategias financieras.",
    tpl: null,
    metodo: "Integración de todos los módulos",
    color: "#2C5282",
    emoji: "🔀",
    tagline: "¿Qué pasa si cambio mi estrategia? Compara y decide.",
    explicacion: `
      <p>Este módulo no calcula un modelo nuevo: toma cualquiera de los módulos
      anteriores, los ejecuta con parámetros distintos y los <strong>superpone
      en una misma gráfica</strong> para que puedas comparar estrategias financieras
      de un vistazo.</p>

      <div class="exp-analogia">
        <span class="exp-analogia-icon">🗺️</span>
        <span>Es como comparar rutas en un mapa: no te dice cuál tomar, pero te muestra
        todas las opciones a la vez con sus tiempos y distancias, para que puedas
        elegir informado.</span>
      </div>

      <div class="exp-resultado-esperado">
        <strong>Ejemplos de uso:</strong>
        <ul style="margin:.5rem 0 0 1rem;line-height:1.9">
          <li>¿Vale la pena ahorrar $500 más al mes? Agrega dos escenarios del Módulo 2
          con k diferente.</li>
          <li>¿Conviene un fondo al 6% o uno al 9% con más riesgo? Compara dos
          Módulos 1 con r diferente.</li>
          <li>¿Cuánto importa empezar a ahorrar hoy vs. en 5 años? Compara
          un Módulo 2 con un Módulo 2d.</li>
          <li>¿Qué pasa si pago mi deuda rápido vs. lento? Compara dos
          Módulos 7 con λ diferente.</li>
        </ul>
      </div>`,
  },
  "comparar": {
    titulo: "Módulo 8 — Comparador de Escenarios",
    ecuacion: "Superpone hasta 8 escenarios en una misma gráfica\npara comparar estrategias financieras.",
    tpl: null,
    metodo: "Integración de todos los módulos",
    color: "#2C5282",
  },
};

// ─── Referencias DOM ───────────────────────────────────────────────────────
const formTitulo   = document.getElementById("form-titulo");
const formEcuacion = document.getElementById("form-ecuacion");
const formCampos   = document.getElementById("form-campos");
const btnCalc      = document.getElementById("btn-calcular");
const formError    = document.getElementById("form-error");
const panelRes     = document.getElementById("panel-resultados");

let moduloActivo = null;

// ─── Sidebar: selección de módulo ─────────────────────────────────────────
document.querySelectorAll(".mod-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mod-btn").forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    activarModulo(btn.dataset.mod);
  });
});

function activarModulo(id) {
  moduloActivo = id;
  const cfg = MODULOS[id];
  if (!cfg) return;

  formTitulo.textContent   = cfg.titulo;
  formEcuacion.textContent = cfg.ecuacion;
  ocultarError();

  if (id === "comparar") {
    construirComparador();
    btnCalc.style.display = "none";
  } else {
    const tpl = document.getElementById(cfg.tpl);
    formCampos.innerHTML = tpl ? tpl.innerHTML : "";
    btnCalc.style.display = "block";
  }

  // Mostrar panel de explicación
  mostrarExplicacion(cfg);
}

function mostrarExplicacion(cfg) {
  panelRes.innerHTML = `
    <div class="exp-panel">
      <div class="exp-header" style="border-left-color:${cfg.color}">
        <span class="exp-emoji">${cfg.emoji || "📊"}</span>
        <div>
          <div class="exp-titulo">${cfg.titulo}</div>
          <div class="exp-tagline">${cfg.tagline || ""}</div>
        </div>
      </div>
      <div class="exp-cuerpo">${cfg.explicacion || ""}</div>
      <div class="exp-footer">
        <span>👆 Completa los parámetros a la izquierda y presiona</span>
        <strong style="color:${cfg.color}"> Calcular</strong>
        <span> para ver la gráfica y los resultados.</span>
      </div>
    </div>`;
}

// ─── Botón calcular ────────────────────────────────────────────────────────
btnCalc.addEventListener("click", async () => {
  ocultarError();
  btnCalc.classList.add("cargando");
  btnCalc.innerHTML = "Calculando… <span class='spinner'></span>";

  try {
    const params = leerFormulario(formCampos);
    const res    = await despacharModulo(moduloActivo, params);
    mostrarResultados(moduloActivo, res);
  } catch (err) {
    mostrarError(err.message);
  } finally {
    btnCalc.classList.remove("cargando");
    btnCalc.innerHTML = "Calcular";
  }
});

// ─── Despachar llamada al módulo correcto ─────────────────────────────────
async function despacharModulo(id, p) {
  switch (id) {
    case "1":  return apiModulo1(p.S0, p.r, p.T);
    case "2":  return apiModulo2(p.S0, p.r, p.k, p.T);
    case "2d": return apiModulo2d(p.S0, p.r, p.k, p.a, p.T);
    case "3":  return apiModulo3(p.S0, p.r, p.alpha, p.n, p.T);
    case "4":  return apiModulo4(p.S0, p.S1, p.c, p.r, p.k, p.T);
    case "5":  return apiModulo5(p.S0, p.c, p.w0, p.F, p.w, p.T);
    case "6":  return apiModulo6(p.S0, p.S1, p.a, p.b, p.t0, p.T);
    case "7":  return apiModulo7(p.S0, p.D0, p.r, p.lam, p.alpha, p.beta, p.k, p.T);
    default:   throw new Error("Módulo no reconocido.");
  }
}

// ─── Renderizar resultados ─────────────────────────────────────────────────
function mostrarResultados(id, res) {
  panelRes.innerHTML = "";

  const cfg = MODULOS[id] || {};

  // Badge de método
  const badge = crearElemento("div", "badge-metodo", res.metodo || cfg.metodo || "");
  panelRes.appendChild(badge);

  // Fórmula analítica
  if (res.formula) {
    const divF = crearElemento("div", "resultado-formula");
    divF.innerHTML = `<div class="etiqueta-formula">Solución analítica</div>${res.formula}`;
    panelRes.appendChild(divF);
  }

  // Gráfica
  if (id === "7") {
    panelRes.appendChild(construirGraficaDoble());
    renderizarCapitalDeuda(res.t, res.S, res.D, res.patrimonio_neto);
  } else if (id === "5") {
    const wrap = crearElemento("div", "grafica-wrapper");
    wrap.innerHTML = '<canvas id="grafica"></canvas>';
    panelRes.appendChild(wrap);
    renderizarCiclos(res.t, res.S, res.S_transitorio, res.S_estacionario);
  } else if (id === "2d") {
    const wrap = crearElemento("div", "grafica-wrapper");
    wrap.innerHTML = '<canvas id="grafica"></canvas>';
    panelRes.appendChild(wrap);
    renderizarDoble(res.t, [
      { label: "Con aportes diferidos", data: res.S, color: cfg.color },
      { label: "Solo crecimiento base", data: res.S_sin_aportes, color: "#CBD5E0", dash: [5,3] },
    ]);
  } else {
    const wrap = crearElemento("div", "grafica-wrapper");
    wrap.innerHTML = '<canvas id="grafica"></canvas>';
    panelRes.appendChild(wrap);
    renderizarSimple("grafica", res.t, res.S, `S(t) — ${cfg.titulo || "Capital"}`, cfg.color || "#2C5282");
  }

  // Métricas
  if (res.metricas) {
    const grid = crearElemento("div", "resultado-metricas");
    for (const [clave, valor] of Object.entries(res.metricas)) {
      if (valor === null || valor === undefined) continue;
      grid.appendChild(crearTarjeta(clave, valor));
    }
    panelRes.appendChild(grid);
  }

  // Interpretación
  if (res.interpretacion) {
    const clase = determinarClaseInterp(res.interpretacion, res.metricas);
    const divI = crearElemento("div", `resultado-interpretacion ${clase}`);
    divI.innerHTML = `<div class="interp-titulo">Interpretación</div>${res.interpretacion}`;
    panelRes.appendChild(divI);
  }
}

// ─── Helpers de UI ────────────────────────────────────────────────────────
function crearElemento(tag, clases = "", texto = "") {
  const el = document.createElement(tag);
  if (clases) el.className = clases;
  if (texto)  el.textContent = texto;
  return el;
}

function crearTarjeta(clave, valor) {
  const tarjeta = crearElemento("div", "metrica-tarjeta");

  // Color de borde según clave
  if (clave.includes("estable") || clave.includes("verde") || clave.includes("duplicacion")) {
    tarjeta.classList.add("verde");
  } else if (clave.includes("alerta") || clave.includes("resonancia") || clave.includes("burbuja")) {
    tarjeta.classList.add("naranja");
  } else if (clave.includes("inest") || clave.includes("error")) {
    tarjeta.classList.add("rojo");
  }

  const label = crearElemento("div", "metrica-label", formatearClave(clave));
  tarjeta.appendChild(label);

  const valEl = crearElemento("div", "metrica-valor");
  valEl.textContent = formatearValorMetrica(valor);
  if (String(valEl.textContent).length > 12) valEl.classList.add("pequeño");
  tarjeta.appendChild(valEl);

  return tarjeta;
}

function formatearClave(clave) {
  return clave
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();
}

function formatearValorMetrica(v) {
  if (typeof v === "boolean") return v ? "✓ Sí" : "✗ No";
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  if (typeof v === "number") {
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(2) + " M";
    if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + " k";
    return parseFloat(v.toFixed(4)).toString();
  }
  return String(v);
}

function determinarClaseInterp(texto, metricas) {
  if (!texto) return "";
  const t = texto.toLowerCase();
  if (t.includes("inestable") || t.includes("diverge")) return "inestable";
  if (t.includes("⚠") || t.includes("resonancia") || t.includes("burbuja")) return "alerta";
  if (t.includes("estable") || t.includes("✓") || t.includes("crece")) return "estable";
  return "";
}

function construirGraficaDoble() {
  const wrapper = crearElemento("div", "graficas-doble");
  wrapper.innerHTML = `
    <div class="grafica-wrapper">
      <div style="font-size:.75rem;font-weight:700;color:var(--gris-med);margin-bottom:.4rem">Capital y Deuda</div>
      <canvas id="grafica"></canvas>
    </div>
    <div class="grafica-wrapper">
      <div style="font-size:.75rem;font-weight:700;color:var(--gris-med);margin-bottom:.4rem">Patrimonio Neto</div>
      <canvas id="grafica-deuda"></canvas>
    </div>`;
  return wrapper;
}

// ─── Errores ───────────────────────────────────────────────────────────────
function mostrarError(msg) {
  formError.textContent = "⚠ " + msg;
  formError.classList.add("visible");
}

function ocultarError() {
  formError.textContent = "";
  formError.classList.remove("visible");
}

// ─── Comparador de escenarios ─────────────────────────────────────────────
const PARAMS_MODULO = {
  "1":  [["S0","10000"],["r","0.08"],["T","20"]],
  "2":  [["S0","5000"],["r","0.06"],["k","1200"],["T","25"]],
  "2d": [["S0","3000"],["r","0.07"],["k","1500"],["a","3"],["T","20"]],
  "3":  [["S0","1000"],["r","0.05"],["alpha","0.00001"],["n","2"],["T","30"]],
  "4":  [["S0","10000"],["S1","0"],["c","0.1"],["r","0.08"],["k","500"],["T","20"]],
  "5":  [["S0","10000"],["c","0.2"],["w0","1.0"],["F","500"],["w","0.8"],["T","30"]],
  "6":  [["S0","10000"],["S1","500"],["a","1.5"],["b","0.5"],["t0","1"],["T","20"]],
  "7":  [["S0","20000"],["D0","15000"],["r","0.07"],["lam","0.10"],["alpha","0.05"],["beta","0.02"],["k","2000"],["T","15"]],
};

let escenarios = [];

function construirComparador() {
  escenarios = [];
  formCampos.innerHTML = "";

  const btnAdd = crearElemento("button", "btn-add-escenario", "+ Agregar escenario");
  btnAdd.addEventListener("click", agregarEscenario);
  formCampos.appendChild(btnAdd);

  const btnCalcComp = crearElemento("button", "btn-calcular-comp", "Comparar");
  btnCalcComp.style.marginTop = ".8rem";
  btnCalcComp.addEventListener("click", calcularComparador);
  formCampos.appendChild(btnCalcComp);

  // Dos escenarios por defecto
  agregarEscenario();
  agregarEscenario();
}

function agregarEscenario() {
  if (escenarios.length >= 8) return;
  const idx = escenarios.length;
  const colores = ["#2C5282","#1B4332","#744210","#742A2A","#44337A","#234E52","#7B341E","#2D3748"];

  const div = crearElemento("div", "comp-escenario");
  div.dataset.idx = idx;

  const paramsDefecto = PARAMS_MODULO["2"];
  div.innerHTML = `
    <div class="comp-escenario-header">
      <div class="comp-color-dot" style="background:${colores[idx]}"></div>
      <input type="text" class="comp-etiqueta" placeholder="Etiqueta del escenario" value="Escenario ${idx+1}">
    </div>
    <select class="comp-select-modulo">
      ${Object.entries(MODULOS).filter(([k])=>k!=="comparar")
        .map(([k,v])=>`<option value="${k}">${v.titulo}</option>`).join("")}
    </select>
    <div class="comp-params-grid">
      ${paramsDefecto.map(([n,v])=>`
        <div class="campo-grupo">
          <label>${n}</label>
          <input type="number" name="${n}" value="${v}" step="any">
        </div>`).join("")}
    </div>`;

  // Cambiar módulo reconstruye los campos
  div.querySelector(".comp-select-modulo").addEventListener("change", (e) => {
    const params = PARAMS_MODULO[e.target.value] || [];
    div.querySelector(".comp-params-grid").innerHTML = params.map(([n,v])=>`
      <div class="campo-grupo">
        <label>${n}</label>
        <input type="number" name="${n}" value="${v}" step="any">
      </div>`).join("");
  });

  const btnAdd = formCampos.querySelector(".btn-add-escenario");
  formCampos.insertBefore(div, btnAdd);
  escenarios.push(div);
}

async function calcularComparador() {
  ocultarError();
  const payload = [];

  for (const div of escenarios) {
    const modulo   = div.querySelector(".comp-select-modulo").value;
    const etiqueta = div.querySelector(".comp-etiqueta").value || `Escenario`;
    const params   = {};
    div.querySelectorAll("input[name]").forEach((inp) => {
      params[inp.name] = parseFloat(inp.value);
    });
    payload.push({ modulo, etiqueta, params });
  }

  try {
    const res = await apiComparar(payload);
    if (res.errores?.length) mostrarError(res.errores.join(" | "));
    if (res.resultados?.length) mostrarResultadosComparador(res.resultados);
  } catch (err) {
    mostrarError(err.message);
  }
}

function mostrarResultadosComparador(resultados) {
  panelRes.innerHTML = "";
  const wrap = crearElemento("div", "grafica-wrapper");
  wrap.innerHTML = '<canvas id="grafica"></canvas>';
  panelRes.appendChild(wrap);
  renderizarComparador("grafica", resultados);

  // Tabla de fórmulas
  const tabla = crearElemento("div", "resultado-metricas");
  resultados.forEach((r, i) => {
    const tarjeta = crearElemento("div", "metrica-tarjeta");
    tarjeta.style.borderTopColor = r.color;
    tarjeta.innerHTML = `
      <div class="metrica-label">${r.etiqueta}</div>
      <div class="metrica-valor pequeño" style="font-family:monospace">${r.formula || ""}</div>`;
    tabla.appendChild(tarjeta);
  });
  panelRes.appendChild(tabla);
}

// ─── Activar módulo 1 al cargar ───────────────────────────────────────────
document.querySelector('[data-mod="1"]').click();
