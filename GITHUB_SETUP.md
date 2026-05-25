# Instrucciones para subir FindDiff a GitHub

## Paso 1: Crear un repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `FindDiff`
3. **Description:** `Financial Modeling with Differential Equations - Interactive web application for differential equation modeling in personal finance`
4. Selecciona **Public** si quieres que sea visible para todos, o **Private** si prefieres que sea privado
5. **NO** inicialices el repositorio con README, .gitignore o licencia (ya los tenemos)
6. Haz clic en **Create repository**

## Paso 2: Conectar tu repositorio local con GitHub

Una vez creado el repositorio en GitHub, verás una pantalla con instrucciones. 
Necesitarás elegir entre:

### Opción A: HTTPS (más fácil, pero menos segura)
```powershell
cd "c:\Users\santi\Downloads\FinDiff_Aplicativo (2)\findiff"
git remote add origin https://github.com/TU_USUARIO/FindDiff.git
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.
Cuando te pida autenticación, usa tu **Personal Access Token** en lugar de contraseña.

### Opción B: SSH (más segura, requiere configuración)
```powershell
cd "c:\Users\santi\Downloads\FinDiff_Aplicativo (2)\findiff"
git remote add origin git@github.com:TU_USUARIO/FindDiff.git
git branch -M main
git push -u origin main
```

**Nota:** Primero debes configurar SSH keys en tu cuenta de GitHub.

## Paso 3: Generar un Personal Access Token (si usas HTTPS)

1. Ve a https://github.com/settings/tokens
2. Haz clic en **Generate new token** → **Generate new token (classic)**
3. Dale un nombre descriptivo (ej: "FindDiff Push")
4. Selecciona los scopes:
   - ✅ `repo` (acceso completo a repositorios privados y públicos)
5. Haz clic en **Generate token**
6. **Copia el token** (no podrás verlo de nuevo)

Cuando Git te pida la contraseña, pega el token.

## Comandos rápidos para hacer push en el futuro

```powershell
# Ver cambios sin enviar
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Enviar a GitHub
git push origin main
```

## Solución de problemas

### Error: "fatal: not a git repository"
Asegúrate de estar en el directorio del proyecto:
```powershell
cd "c:\Users\santi\Downloads\FinDiff_Aplicativo (2)\findiff"
```

### Error: "fatal: 'origin' does not appear to be a 'git' repository"
Ejecuta:
```powershell
git remote -v
```
Si no muestra nada, ejecuta el Paso 2 (Opción A o B).

### Error de autenticación con HTTPS
- Verifica que estés usando un **Personal Access Token**, no tu contraseña
- Si cambió tu contraseña de GitHub, el token también podría ser inválido

---

¿Necesitas ayuda con alguno de estos pasos?
