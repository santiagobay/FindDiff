/**
 * tutorial.js — Tutorial interactivo paso a paso y glosario de términos.
 *
 * El tutorial guía al usuario a través de 9 pasos con capturas visuales,
 * descripciones en lenguaje cotidiano y resaltado de elementos reales
 * de la interfaz.
 *
 * El glosario es una lista de términos financieros y matemáticos con
 * explicaciones accesibles, con buscador en tiempo real.
 */

// ─── PASOS DEL TUTORIAL ───────────────────────────────────────────────────
const PASOS_TUTORIAL = [
  {
    titulo: "¡Bienvenido a FinDiff! 👋",
    icono: "🎓",
    resaltar: null,
    contenido: `
      <p>FinDiff es una herramienta que te ayuda a <strong>entender y proyectar
      tus finanzas personales</strong> usando matemáticas reales — las mismas que
      usan los economistas y analistas financieros.</p>

      <p>No necesitas saber de ecuaciones para usarla. Solo necesitas conocer
      <strong>tres datos de tu situación financiera</strong> (cuánto tienes, a qué
      tasa crece y cuánto aportas), y la herramienta hace el resto.</p>

      <div class="tut-highlight-box tut-azul">
        <strong>En este tutorial aprenderás:</strong>
        <ul>
          <li>Cómo está organizada la pantalla</li>
          <li>Cómo elegir el módulo correcto para tu situación</li>
          <li>Cómo ingresar tus datos</li>
          <li>Cómo leer la gráfica y los resultados</li>
          <li>Cómo comparar escenarios financieros</li>
        </ul>
      </div>
      <p style="text-align:center;color:var(--gris-med);font-size:.85rem">
        Presiona <strong>Siguiente →</strong> para comenzar.
      </p>`,
  },
  {
    titulo: "La pantalla tiene tres zonas 🗂",
    icono: "🖥",
    resaltar: "#app",
    contenido: `
      <p>La interfaz está dividida en <strong>tres zonas</strong> que trabajan juntas:</p>

      <div class="tut-zonas">
        <div class="tut-zona" style="border-color:#1A2F5E">
          <div class="tut-zona-titulo" style="background:#1A2F5E">① Menú lateral</div>
          <div class="tut-zona-desc">A la izquierda. Aquí eliges <em>qué quieres calcular</em>.
          Cada botón es un modelo financiero distinto.</div>
        </div>
        <div class="tut-zona" style="border-color:#2C5282">
          <div class="tut-zona-titulo" style="background:#2C5282">② Panel de parámetros</div>
          <div class="tut-zona-desc">En el centro. Aquí introduces <em>tus datos</em>:
          cuánto dinero tienes, la tasa de rendimiento, el plazo, etc.</div>
        </div>
        <div class="tut-zona" style="border-color:#1B4332">
          <div class="tut-zona-titulo" style="background:#1B4332">③ Panel de resultados</div>
          <div class="tut-zona-desc">A la derecha. Aquí aparece la <em>gráfica</em>,
          la solución matemática y el análisis de tu situación.</div>
        </div>
      </div>

      <p>El flujo siempre es de izquierda a derecha:
      <strong>elegir módulo → ingresar datos → ver resultados.</strong></p>`,
  },
  {
    titulo: "El menú lateral: elige tu escenario 📋",
    icono: "📋",
    resaltar: "#sidebar",
    contenido: `
      <p>El menú está organizado en <strong>tres grupos</strong>:</p>

      <div class="tut-menu-grupos">
        <div class="tut-menu-grupo">
          <div class="tut-menu-grupo-titulo">📗 Fase 1 — Modelos simples</div>
          <p>Para la mayoría de personas. Si quieres saber cuánto crecerá
          tu ahorro, cuánto necesitas depositar mensualmente o cuánto tardas
          en llegar a una meta, empieza aquí.</p>
          <div class="tut-chips">
            <span class="tut-chip">📈 Crecimiento puro</span>
            <span class="tut-chip">💰 Aportes constantes</span>
            <span class="tut-chip">⏳ Aportes diferidos</span>
            <span class="tut-chip">🌀 Rendimiento no lineal</span>
          </div>
        </div>
        <div class="tut-menu-grupo">
          <div class="tut-menu-grupo-titulo">📘 Fase 2 — Modelos avanzados</div>
          <p>Para análisis más detallados: el efecto de los costos e impuestos,
          cómo te afectan los ciclos económicos, inversiones de largo plazo
          o el balance entre capital y deuda.</p>
          <div class="tut-chips">
            <span class="tut-chip">🔧 Amortiguación</span>
            <span class="tut-chip">📊 Ciclos de mercado</span>
            <span class="tut-chip">⏱ Horizonte temporal</span>
            <span class="tut-chip">⚖ Capital-Deuda</span>
          </div>
        </div>
        <div class="tut-menu-grupo">
          <div class="tut-menu-grupo-titulo">🔀 Herramientas</div>
          <p>El <strong>Comparador de escenarios</strong> te permite poner
          dos o más situaciones en la misma gráfica y ver cuál es mejor.</p>
        </div>
      </div>`,
  },
  {
    titulo: "El panel de parámetros: tus datos 📝",
    icono: "📝",
    resaltar: "#panel-form",
    contenido: `
      <p>Cuando seleccionas un módulo, el panel central cambia y muestra
      los campos de datos que ese módulo necesita. Antes de los campos,
      verás siempre <strong>dos elementos importantes</strong>:</p>

      <div class="tut-elementos">
        <div class="tut-elemento">
          <div class="tut-elemento-icono">📌</div>
          <div>
            <strong>Nombre del módulo</strong><br>
            <span>El título grande en la parte superior del panel.</span>
          </div>
        </div>
        <div class="tut-elemento">
          <div class="tut-elemento-icono">🔢</div>
          <div>
            <strong>La ecuación diferencial</strong><br>
            <span>Una caja azul con la fórmula matemática del modelo.
            No necesitas entenderla para usar la herramienta — está ahí
            para quienes quieren ver el modelo de fondo.</span>
          </div>
        </div>
      </div>

      <div class="tut-highlight-box tut-verde">
        <strong>💡 Consejo:</strong> Cada campo tiene un rótulo que explica
        qué representa y en qué unidades va. Por ejemplo, la tasa de interés
        siempre va en <em>decimal anual</em>: 8% anual = 0.08. Los valores
        por defecto son ejemplos realistas para que veas cómo funciona
        antes de ingresar tus propios datos.
      </div>`,
  },
  {
    titulo: "El botón Calcular ⚡",
    icono: "⚡",
    resaltar: "#btn-calcular",
    contenido: `
      <p>Cuando hayas ingresado tus datos, presiona el botón
      <strong style="color:#2C5282">Calcular</strong>. En ese momento ocurre lo siguiente:</p>

      <div class="tut-pasos-calc">
        <div class="tut-paso-calc">
          <div class="tut-paso-num">1</div>
          <div>Tu navegador envía los datos al <strong>motor matemático</strong>
          que corre en Python.</div>
        </div>
        <div class="tut-paso-calc">
          <div class="tut-paso-num">2</div>
          <div>El motor <strong>resuelve la ecuación diferencial</strong>
          correspondiente de forma analítica (exacta) usando SymPy.</div>
        </div>
        <div class="tut-paso-calc">
          <div class="tut-paso-num">3</div>
          <div>Evalúa la solución en 600 puntos de tiempo con NumPy
          para construir la <strong>curva de evolución del capital</strong>.</div>
        </div>
        <div class="tut-paso-calc">
          <div class="tut-paso-num">4</div>
          <div>Envía los resultados de vuelta y la interfaz
          <strong>dibuja la gráfica</strong> y muestra las métricas.</div>
        </div>
      </div>

      <p style="font-size:.84rem;color:var(--gris-med)">
        Todo este proceso toma menos de un segundo. Si hay algún error en
        los datos (por ejemplo, una tasa de 0 donde no corresponde),
        aparecerá un mensaje en rojo explicando qué corregir.
      </p>`,
  },
  {
    titulo: "El panel de resultados: la gráfica 📈",
    icono: "📈",
    resaltar: "#panel-resultados",
    contenido: `
      <p>Después de calcular, el panel derecho muestra cuatro elementos:</p>

      <div class="tut-resultados-guia">
        <div class="tut-res-item">
          <div class="tut-res-badge" style="background:#2C5282">①</div>
          <div>
            <strong>Solución analítica</strong> — La fórmula matemática exacta
            con tus números ya sustituidos. Ej: S(t) = 12000·e^(0.08t) − 8000.
          </div>
        </div>
        <div class="tut-res-item">
          <div class="tut-res-badge" style="background:#1B4332">②</div>
          <div>
            <strong>Gráfica interactiva</strong> — Muestra S(t): el valor de
            tu capital en cada año. Puedes pasar el cursor sobre cualquier punto
            para ver el valor exacto. El eje horizontal es el tiempo (años),
            el vertical es el capital.
          </div>
        </div>
        <div class="tut-res-item">
          <div class="tut-res-badge" style="background:#744210">③</div>
          <div>
            <strong>Métricas clave</strong> — Tarjetas con los indicadores más
            importantes: tiempo de duplicación, capital al final del horizonte,
            punto de equilibrio, etc. Los bordes de colores indican el estado:
            <span style="color:#1B4332">verde = positivo</span>,
            <span style="color:#744210">naranja = precaución</span>,
            <span style="color:#742A2A">rojo = alerta</span>.
          </div>
        </div>
        <div class="tut-res-item">
          <div class="tut-res-badge" style="background:#44337A">④</div>
          <div>
            <strong>Interpretación</strong> — Un párrafo en español que traduce
            los resultados matemáticos a lenguaje cotidiano y te dice qué
            significa para tu situación financiera.
          </div>
        </div>
      </div>`,
  },
  {
    titulo: "Ejemplo completo: paso a paso 🧪",
    icono: "🧪",
    resaltar: null,
    contenido: `
      <p>Pongamos un ejemplo real. Supón que tienes <strong>$5.000.000 ahorrados</strong>,
      los inviertes en un CDT al <strong>9% anual</strong>, y depositas
      <strong>$500.000 adicionales cada mes</strong> ($6.000.000/año).
      ¿Cuánto tendrás en 10 años?</p>

      <div class="tut-ejemplo-pasos">
        <div class="tut-ej-paso">
          <div class="tut-ej-num">①</div>
          <div>Haz clic en <strong>💰 Aportes constantes</strong> en el menú lateral.</div>
        </div>
        <div class="tut-ej-paso">
          <div class="tut-ej-num">②</div>
          <div>En el formulario, escribe:<br>
            <code>S₀ = 5000000</code><br>
            <code>r = 0.09</code> (9% como decimal)<br>
            <code>k = 6000000</code> (aportes anuales)<br>
            <code>T = 10</code> (años)
          </div>
        </div>
        <div class="tut-ej-paso">
          <div class="tut-ej-num">③</div>
          <div>Presiona <strong>Calcular</strong>.</div>
        </div>
        <div class="tut-ej-paso">
          <div class="tut-ej-num">④</div>
          <div>La gráfica mostrará la curva de crecimiento. Las métricas
          te dirán el capital final y el punto de equilibrio
          (cuándo los intereses cubren solos los retiros futuros).</div>
        </div>
      </div>

      <div class="tut-highlight-box tut-verde">
        <strong>Prueba cambiando los números:</strong> ¿Qué pasa si subes el aporte
        a $800.000/mes? ¿Y si la tasa baja al 6%? Cada cálculo es instantáneo.
      </div>`,
  },
  {
    titulo: "El Comparador de Escenarios 🔀",
    icono: "🔀",
    resaltar: null,
    contenido: `
      <p>El módulo más poderoso para tomar decisiones: permite ver <strong>varias
      estrategias al mismo tiempo</strong> en una sola gráfica.</p>

      <p>Al hacer clic en <strong>🔀 Comparar escenarios</strong>, aparece un
      constructor de escenarios donde puedes:</p>

      <div class="tut-comp-guia">
        <div class="tut-comp-paso">
          <span class="tut-comp-dot" style="background:#2C5282">●</span>
          Elegir el tipo de modelo para cada escenario (menú desplegable).
        </div>
        <div class="tut-comp-paso">
          <span class="tut-comp-dot" style="background:#1B4332">●</span>
          Escribir una etiqueta para identificarlo (ej: "Con CDT 9%").
        </div>
        <div class="tut-comp-paso">
          <span class="tut-comp-dot" style="background:#744210">●</span>
          Ingresar los parámetros de ese escenario.
        </div>
        <div class="tut-comp-paso">
          <span class="tut-comp-dot" style="background:#742A2A">●</span>
          Agregar hasta 8 escenarios con el botón <strong>+ Agregar escenario</strong>.
        </div>
        <div class="tut-comp-paso">
          <span class="tut-comp-dot" style="background:#44337A">●</span>
          Presionar <strong>Comparar</strong> para ver todas las curvas juntas.
        </div>
      </div>

      <div class="tut-highlight-box tut-azul">
        <strong>Ideas para comparar:</strong>
        <ul>
          <li>¿Ahorro $300k o $600k al mes? → Dos Módulo 2 con k diferente.</li>
          <li>¿Empiezo ya o en 5 años? → Módulo 2 vs. Módulo 2d con a=5.</li>
          <li>¿Pago la deuda rápido o invierto? → Dos Módulo 7 con λ diferente.</li>
        </ul>
      </div>`,
  },
  {
    titulo: "¡Ya estás listo para usar FinDiff! 🚀",
    icono: "🚀",
    resaltar: null,
    contenido: `
      <p>Recapitulemos lo que aprendiste:</p>

      <div class="tut-resumen">
        <div class="tut-resumen-item">✅ La pantalla tiene <strong>tres zonas</strong>: menú, parámetros y resultados.</div>
        <div class="tut-resumen-item">✅ Elige el módulo según tu <strong>situación financiera</strong>.</div>
        <div class="tut-resumen-item">✅ Los campos vienen con <strong>valores de ejemplo</strong> para orientarte.</div>
        <div class="tut-resumen-item">✅ Después de calcular, la <strong>interpretación</strong> te explica el resultado en español.</div>
        <div class="tut-resumen-item">✅ Usa el <strong>Comparador</strong> para poner varias estrategias en la misma gráfica.</div>
        <div class="tut-resumen-item">✅ El <strong>Glosario</strong> (botón en el menú) explica cualquier término que no conozcas.</div>
      </div>

      <div class="tut-highlight-box tut-verde">
        <strong>¿Necesitas ayuda con algún módulo específico?</strong><br>
        Cuando selecciones cualquier módulo, el panel derecho te mostrará
        su explicación detallada antes de que calcules nada.
        También puedes volver a este tutorial cuando quieras desde el menú lateral.
      </div>

      <p style="text-align:center;margin-top:1rem">
        <button class="btn-empezar-tutorial" onclick="cerrarTutorial()">
          ¡Empezar a usar FinDiff! 🎉
        </button>
      </p>`,
  },
];

// ─── TÉRMINOS DEL GLOSARIO ────────────────────────────────────────────────
const GLOSARIO = [
  {
    termino: "Capital inicial (S₀)",
    categoria: "Finanzas",
    definicion: "El dinero con el que empiezas. Es el punto de partida de tu inversión o cuenta de ahorros en el momento en que comienzas a calcular (t = 0).",
    ejemplo: "Si hoy tienes $10.000.000 en tu cuenta de ahorros, S₀ = 10000000.",
  },
  {
    termino: "Tasa de rendimiento (r)",
    categoria: "Finanzas",
    definicion: "El porcentaje anual que gana tu dinero, expresado como número decimal. En FinDiff se usa la tasa continua, que es ligeramente diferente a la tasa efectiva anual que usan los bancos.",
    ejemplo: "Un CDT al 9% anual efectivo equivale a r ≈ 0.0861 en tasa continua. Para simplificar, muchos usuarios usan directamente 0.09.",
  },
  {
    termino: "Aporte neto (k)",
    categoria: "Finanzas",
    definicion: "El dinero que agregas (o retiras) de la inversión por año. Si es positivo, estás ahorrando más. Si es negativo, estás retirando dinero (como al jubilarte y vivir de tus ahorros).",
    ejemplo: "Si ahorras $500.000 al mes, k = 500.000 × 12 = 6.000.000 al año.",
  },
  {
    termino: "Horizonte T",
    categoria: "Finanzas",
    definicion: "Cuántos años hacia adelante quieres proyectar. La gráfica mostrará la evolución de tu capital desde t = 0 hasta t = T años.",
    ejemplo: "Si planeas retirarte en 20 años, T = 20.",
  },
  {
    termino: "Punto de equilibrio",
    categoria: "Finanzas",
    definicion: "El saldo en el que los intereses que genera tu capital son exactamente iguales a los retiros que haces. Por encima de ese punto, el capital crece; por debajo, se consume.",
    ejemplo: "Si retiras $600.000/año y tu tasa es 5%, el equilibrio es $600.000 / 0.05 = $12.000.000.",
  },
  {
    termino: "Tiempo de duplicación",
    categoria: "Finanzas",
    definicion: "Cuántos años tarda tu capital en doblarse, si no haces aportes ni retiros y la tasa es constante. Se calcula como ln(2) / r.",
    ejemplo: "Con una tasa del 8% anual, el capital se duplica en ln(2)/0.08 ≈ 8.66 años.",
  },
  {
    termino: "Patrimonio neto",
    categoria: "Finanzas",
    definicion: "Lo que realmente te pertenece: el total de tus activos (capital) menos el total de tus pasivos (deudas). En el Módulo 7, la gráfica muestra esta diferencia a lo largo del tiempo.",
    ejemplo: "Si tienes $30M en capital y debes $18M, tu patrimonio neto es $12M.",
  },
  {
    termino: "Ecuación diferencial",
    categoria: "Matemáticas",
    definicion: "Una ecuación que describe cómo algo cambia con el tiempo. En FinDiff, describe cómo cambia tu capital en cada instante. La clave es que el cambio depende del estado actual del sistema.",
    ejemplo: "dS/dt = 0.08·S dice que tu capital crece en cada instante a una tasa proporcional a su valor actual — eso es el interés compuesto.",
  },
  {
    termino: "dS/dt",
    categoria: "Matemáticas",
    definicion: "La tasa de cambio instantánea del capital. Significa 'cuánto cambia S en un instante infinitamente pequeño de tiempo'. Si dS/dt > 0, el capital está creciendo; si < 0, está decreciendo.",
    ejemplo: "Si dS/dt = 500.000, significa que en ese momento tu capital está creciendo a una velocidad de $500.000 por año.",
  },
  {
    termino: "Problema de valor inicial",
    categoria: "Matemáticas",
    definicion: "Una ecuación diferencial acompañada de una condición de inicio (tu capital en t=0). Sin esa condición inicial, la ecuación tiene infinitas soluciones posibles. Con ella, tiene exactamente una.",
    ejemplo: "dS/dt = rS con S(0) = 10.000.000 tiene una única solución: S(t) = 10.000.000·e^(rt).",
  },
  {
    termino: "Solución analítica",
    categoria: "Matemáticas",
    definicion: "La fórmula matemática exacta que resuelve la ecuación diferencial. Es más precisa que una aproximación numérica porque no tiene error de redondeo. FinDiff la calcula con SymPy y te la muestra.",
    ejemplo: "S(t) = (S₀ + k/r)·e^(rt) − k/r es la solución analítica del modelo de aportes constantes.",
  },
  {
    termino: "Amortiguación (c)",
    categoria: "Matemáticas",
    definicion: "Un coeficiente que captura cuánto 'frena' el sistema. En finanzas, representa los costos que desaceleran el crecimiento del capital: comisiones, impuestos, spreads. A mayor c, más lento crece el capital.",
    ejemplo: "Un fondo con comisión del 2% anual y retención de impuestos del 1% podría modelarse con c ≈ 0.03.",
  },
  {
    termino: "Resonancia financiera",
    categoria: "Matemáticas",
    definicion: "Fenómeno que ocurre cuando la frecuencia de los ciclos económicos coincide con la frecuencia natural del portafolio. Produce oscilaciones amplificadas — el capital sube y baja mucho más de lo normal.",
    ejemplo: "Si tu portafolio tiene ω₀ = 1.0 y el ciclo económico también tiene frecuencia ≈ 1.0, estás en resonancia.",
  },
  {
    termino: "Frecuencia natural (ω₀)",
    categoria: "Matemáticas",
    definicion: "La velocidad propia a la que un portafolio tiende a oscilar si se le perturba. Depende de la composición del portafolio. Un fondo agresivo tiene ω₀ alto; uno conservador, bajo.",
    ejemplo: "ω₀ = 1.0 significa que el portafolio haría un ciclo completo por año si se dejara oscilar libremente.",
  },
  {
    termino: "Función de Heaviside / Escalón unitario",
    categoria: "Matemáticas",
    definicion: "Una función matemática que vale 0 antes de un tiempo a, y 1 después. Se usa para modelar eventos que 'se activan' en un momento específico, como empezar a hacer aportes a partir de cierto año.",
    ejemplo: "u(t−3) vale 0 para t<3 años y 1 para t≥3 años. Multiplicar por k activa el aporte en t=3.",
  },
  {
    termino: "Transformada de Laplace",
    categoria: "Matemáticas",
    definicion: "Una técnica matemática que convierte ecuaciones diferenciales en ecuaciones algebraicas más fáciles de resolver. Es especialmente útil cuando hay aportes que empiezan en momentos distintos de t=0.",
    ejemplo: "La transformada convierte dS/dt = rS+k (ecuación diferencial) en sS̃−S₀ = rS̃+k/s (ecuación algebraica), que se resuelve despejando S̃.",
  },
  {
    termino: "Ecuación de Bernoulli",
    categoria: "Matemáticas",
    definicion: "Un tipo de ecuación diferencial no lineal donde la tasa de crecimiento depende del capital elevado a una potencia n. Aparece cuando los rendimientos cambian de forma no proporcional al capital.",
    ejemplo: "dS/dt = 0.05·S + 0.00001·S² es una ecuación de Bernoulli con n=2.",
  },
  {
    termino: "Estabilidad del sistema",
    categoria: "Matemáticas",
    definicion: "Un sistema es estable si, con el tiempo, converge a un valor finito o equilibrio. Es inestable si crece o decrece sin límite. En el Módulo 7 (Capital-Deuda), la estabilidad determina si el patrimonio neto eventualmente se estabiliza o se deteriora sin freno.",
    ejemplo: "Si el capital crece al 7% pero la deuda crece al 10%, el sistema es inestable: la deuda termina superando al capital.",
  },
  {
    termino: "Criterio de Routh-Hurwitz",
    categoria: "Matemáticas",
    definicion: "Una prueba matemática que determina si un sistema dinámico es estable sin necesidad de resolver toda la ecuación. Analiza los coeficientes del polinomio característico del sistema.",
    ejemplo: "Para el sistema capital-deuda, el criterio dice que debes pagar la deuda más rápido de lo que crece tu capital para que el sistema sea estable.",
  },
  {
    termino: "Interés compuesto continuo",
    categoria: "Finanzas",
    definicion: "Una forma de calcular intereses donde se reinvierten de forma instantánea y continua, en lugar de hacerlo una vez al año o al mes. Es la base matemática del Módulo 1. En la práctica, es la aproximación más precisa para inversiones de largo plazo.",
    ejemplo: "$1.000.000 al 8% continuo durante 10 años = 1.000.000 × e^(0.8) ≈ $2.225.541.",
  },
  {
    termino: "Singularidad (Módulo 3)",
    categoria: "Matemáticas",
    definicion: "Un punto en el tiempo donde la solución matemática se 'dispara' hacia infinito. En finanzas con el modelo de Bernoulli, indica que el capital crece tan rápido que el modelo deja de ser válido — una señal de alerta sobre estrategias de alto riesgo.",
    ejemplo: "Si el software detecta una singularidad en t = 15 años, significa que la estrategia modelada no es sostenible más allá de ese punto.",
  },
  {
    termino: "Cauchy-Euler",
    categoria: "Matemáticas",
    definicion: "Un tipo de ecuación diferencial donde los coeficientes son proporcionales a las potencias del tiempo (t², t, constante). Aparece en finanzas cuando el rendimiento depende de cuánto tiempo llevas invertido.",
    ejemplo: "t²·S'' + 1.5t·S' + 0.5·S = 0 es una ecuación de Cauchy-Euler. Útil para bonos o fondos de pensiones con prima de plazo.",
  },
  {
    termino: "Tasa continua vs. tasa efectiva anual",
    categoria: "Finanzas",
    definicion: "La tasa continua r y la tasa efectiva anual i están relacionadas por: i = e^r − 1 (o r = ln(1+i)). La tasa continua es la que usa FinDiff porque es la forma natural de los modelos de ecuaciones diferenciales.",
    ejemplo: "Tasa efectiva del 8% → r = ln(1.08) ≈ 0.0770. Para la mayoría de usos, usar directamente 0.08 da resultados muy similares.",
  },
];

// ─── ESTADO DEL TUTORIAL ──────────────────────────────────────────────────
let pasoActual = 0;

// ─── FUNCIONES DEL TUTORIAL ──────────────────────────────────────────────
function abrirTutorial() {
  pasoActual = 0;
  document.getElementById("overlay-tutorial").style.display = "flex";
  renderizarPaso(pasoActual);
}

function cerrarTutorial() {
  document.getElementById("overlay-tutorial").style.display = "none";
  limpiarResaltado();
}

function renderizarPaso(idx) {
  const paso     = PASOS_TUTORIAL[idx];
  const total    = PASOS_TUTORIAL.length;
  const pct      = Math.round(((idx + 1) / total) * 100);

  // Barra de progreso
  document.getElementById("tut-barra").style.width = pct + "%";
  document.getElementById("tut-step-label").textContent = `Paso ${idx + 1} de ${total}`;

  // Contenido
  document.getElementById("tut-contenido").innerHTML = `
    <div class="tut-paso-header">
      <span class="tut-paso-icono">${paso.icono}</span>
      <h2 class="tut-paso-titulo">${paso.titulo}</h2>
    </div>
    <div class="tut-paso-cuerpo">${paso.contenido}</div>`;

  // Dots de navegación
  const dots = document.getElementById("tut-dots");
  dots.innerHTML = "";
  PASOS_TUTORIAL.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "tut-dot" + (i === idx ? " activo" : "");
    dot.addEventListener("click", () => irAPaso(i));
    dots.appendChild(dot);
  });

  // Botones prev/next
  document.getElementById("tut-prev").style.visibility = idx === 0 ? "hidden" : "visible";
  document.getElementById("tut-next").textContent = idx === total - 1 ? "Cerrar ✕" : "Siguiente →";

  // Resaltado de elemento
  limpiarResaltado();
  if (paso.resaltar) {
    const el = document.querySelector(paso.resaltar);
    if (el) el.classList.add("tut-resaltado");
  }
}

function irAPaso(idx) {
  pasoActual = idx;
  renderizarPaso(pasoActual);
}

document.getElementById("tut-next").addEventListener("click", () => {
  if (pasoActual < PASOS_TUTORIAL.length - 1) {
    irAPaso(pasoActual + 1);
  } else {
    cerrarTutorial();
  }
});

document.getElementById("tut-prev").addEventListener("click", () => {
  if (pasoActual > 0) irAPaso(pasoActual - 1);
});

document.getElementById("cerrar-tutorial").addEventListener("click", cerrarTutorial);
document.getElementById("btn-tutorial").addEventListener("click", abrirTutorial);

// Cerrar al clic en el overlay (fuera del modal)
document.getElementById("overlay-tutorial").addEventListener("click", (e) => {
  if (e.target === document.getElementById("overlay-tutorial")) cerrarTutorial();
});

function limpiarResaltado() {
  document.querySelectorAll(".tut-resaltado").forEach(el => el.classList.remove("tut-resaltado"));
}

// ─── FUNCIONES DEL GLOSARIO ───────────────────────────────────────────────
function abrirGlosario() {
  document.getElementById("overlay-glosario").style.display = "flex";
  renderizarGlosario("");
}

function cerrarGlosario() {
  document.getElementById("overlay-glosario").style.display = "none";
}

function renderizarGlosario(filtro) {
  const lista = document.getElementById("glos-lista");
  const termsFiltrados = GLOSARIO.filter(t =>
    t.termino.toLowerCase().includes(filtro.toLowerCase()) ||
    t.definicion.toLowerCase().includes(filtro.toLowerCase()) ||
    t.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  if (termsFiltrados.length === 0) {
    lista.innerHTML = `<div class="glos-vacio">No se encontraron términos para "${filtro}"</div>`;
    return;
  }

  // Agrupar por categoría
  const grupos = {};
  termsFiltrados.forEach(t => {
    if (!grupos[t.categoria]) grupos[t.categoria] = [];
    grupos[t.categoria].push(t);
  });

  lista.innerHTML = Object.entries(grupos).map(([cat, terms]) => `
    <div class="glos-categoria">
      <div class="glos-cat-titulo">${cat === "Finanzas" ? "💵" : "📐"} ${cat}</div>
      ${terms.map(t => `
        <div class="glos-item">
          <div class="glos-term-titulo">${t.termino}</div>
          <div class="glos-term-def">${t.definicion}</div>
          ${t.ejemplo ? `<div class="glos-term-ej"><strong>Ejemplo:</strong> ${t.ejemplo}</div>` : ""}
        </div>`).join("")}
    </div>`).join("");
}

document.getElementById("btn-glosario").addEventListener("click", abrirGlosario);
document.getElementById("cerrar-glosario").addEventListener("click", cerrarGlosario);
document.getElementById("overlay-glosario").addEventListener("click", (e) => {
  if (e.target === document.getElementById("overlay-glosario")) cerrarGlosario();
});
document.getElementById("glos-buscar").addEventListener("input", (e) => {
  renderizarGlosario(e.target.value);
});

// Abrir tutorial automáticamente la primera vez
if (!localStorage.getItem("findiff_tutorial_visto")) {
  setTimeout(() => {
    abrirTutorial();
    localStorage.setItem("findiff_tutorial_visto", "1");
  }, 600);
}
