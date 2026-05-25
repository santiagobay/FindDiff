# FindDiff — Modelación Financiera con Ecuaciones Diferenciales

Software web interactivo desarrollado como Proyecto Integrador de la
asignatura Ecuaciones Diferenciales, Fundación Universitaria Compensar.

## Estructura del proyecto

```
findiff/
├── app.py                    # API Flask — punto de entrada
├── requirements.txt          # Dependencias Python
├── motor/
│   ├── modelos_fase1.py      # E.D. de 1.er orden (Módulos 1-3)
│   ├── modelos_fase2.py      # E.D. de 2.° orden (Módulos 4-7)
│   └── comparador.py         # Módulo 8 — comparador de escenarios
├── static/
│   ├── css/estilos.css       # Hoja de estilos responsive
│   └── js/
│       ├── api.js            # Comunicación frontend ↔ backend
│       ├── graficas.js       # Renderizado con Chart.js
│       └── main.js           # Lógica principal del frontend
└── templates/
    └── index.html            # Interfaz HTML principal
```

## Instalación y ejecución

### 1. Requisitos previos
- Python 3.9 o superior
- pip

### 2. Instalar dependencias

```bash
cd findiff
pip install -r requirements.txt
```

### 3. Ejecutar el servidor

```bash
python app.py
```

### 4. Abrir en el navegador

```
http://localhost:5000
```

## Módulos disponibles

| Módulo | Ecuación | Método |
|--------|----------|--------|
| 1 | dS/dt = rS | Variables separables / Laplace |
| 2 | dS/dt = rS + k | E.D. Lineal / Factor integrante |
| 2d | dS/dt = rS + k·u(t−a) | Laplace + 2do Teorema Traslación |
| 3 | dS/dt = rS + αS^n | Ecuación de Bernoulli |
| 4 | S'' + cS' − r²S = k | Coef. constantes 2° orden |
| 5 | S'' + cS' + ω₀²S = F·cos(ωt) | Coeficientes indeterminados |
| 6 | t²S'' + atS' + bS = 0 | Ecuación de Cauchy-Euler |
| 7 | Sistema S-D acoplado | Reducción + Routh-Hurwitz |
| 8 | Comparador | Integración de todos los módulos |

## Tecnologías

- **Backend**: Python 3, Flask, NumPy, SciPy
- **Frontend**: HTML5, CSS3, JavaScript (vanilla), Chart.js
- **Arquitectura**: API REST (JSON) — separación motor / interfaz
