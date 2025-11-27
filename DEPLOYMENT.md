# 🚀 Guía de Despliegue - Dashboard Tenjo

Este documento describe cómo desplegar el proyecto Dashboard Tenjo en Render (backend) y Vercel (frontend).

---

## 📋 Requisitos Previos

- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Repositorio de GitHub sincronizado
- Archivo Excel `PLAN INDICATIVO TENJO.xlsx` en `backend/data/`

---

## 🔧 Parte 1: Desplegar Backend en Render

### Paso 1: Crear el Web Service

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub `dashboard-tenjo`

### Paso 2: Configurar el Servicio

Usa la siguiente configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `dashboard-tenjo-backend` |
| **Region** | Oregon (Free) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Paso 3: Variables de Entorno

Agrega estas variables de entorno en Render:

```env
NODE_ENV=production
FRONTEND_URL=https://dashboard-tenjo.vercel.app
```

**Nota:** La variable `PORT` es automática en Render, no la configures manualmente.

### Paso 4: Verificar el Despliegue

1. Espera a que el build termine (puede tomar 2-5 minutos)
2. Verifica el estado en los logs
3. Prueba el endpoint: `https://dashboard-tenjo-backend.onrender.com/health`
4. Debería responder: `{"status": "ok", "message": "API funcionando correctamente"}`

### Paso 5: Guardar la URL del Backend

Tu backend estará disponible en: `https://dashboard-tenjo-backend.onrender.com`

**⚠️ Importante:** Los servicios gratuitos de Render se duermen después de 15 minutos de inactividad. La primera carga puede tardar 30-60 segundos.

---

## 🌐 Parte 2: Desplegar Frontend en Vercel

### Paso 1: Importar el Proyecto

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub `dashboard-tenjo`

### Paso 2: Configurar el Proyecto

Usa la siguiente configuración:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Paso 3: Variables de Entorno

Agrega esta variable de entorno en Vercel:

```env
VITE_API_URL=https://dashboard-tenjo-backend.onrender.com
```

**Pasos:**
1. En la configuración del proyecto, ve a **"Settings"** → **"Environment Variables"**
2. Agrega la variable `VITE_API_URL` con el valor de tu backend de Render
3. Selecciona **"Production"**, **"Preview"**, y **"Development"**
4. Haz clic en **"Save"**

### Paso 4: Deploy

1. Haz clic en **"Deploy"**
2. Espera a que el build termine (1-3 minutos)
3. Vercel te dará una URL de producción

### Paso 5: Verificar el Despliegue

1. Abre la URL de tu proyecto: `https://dashboard-tenjo.vercel.app`
2. Verifica que el dashboard cargue correctamente
3. Prueba la navegación entre páginas (Dashboard, Metas, Finanzas)

---

## 🔄 Actualizar el Backend con la URL de Vercel

Una vez que tengas la URL de Vercel, actualiza la variable de entorno en Render:

1. Ve a tu servicio en Render
2. **"Environment"** → Edita `FRONTEND_URL`
3. Cambia el valor a tu URL de Vercel: `https://dashboard-tenjo.vercel.app`
4. Guarda y espera a que se redeploy automáticamente

---

## 🔁 Despliegues Automáticos

### Ambos servicios están configurados para despliegue automático:

- **Render**: Se redesplega automáticamente al hacer push a `main`
- **Vercel**: Se redesplega automáticamente al hacer push a `main`

Para desplegar cambios:
```bash
git add .
git commit -m "descripción de cambios"
git push origin main
```

---

## 🐛 Solución de Problemas

### Backend no responde (Error 500/502)

**Problema:** El backend en Render se durmió (free tier)  
**Solución:** Espera 30-60 segundos y recarga. El servicio se activará automáticamente.

**Problema:** Error en logs: "Cannot find module"  
**Solución:** Verifica que `backend/data/PLAN INDICATIVO TENJO.xlsx` esté en el repositorio.

### Frontend muestra error de CORS

**Problema:** `Access-Control-Allow-Origin` error  
**Solución:** 
1. Verifica que `FRONTEND_URL` en Render tenga la URL correcta de Vercel
2. Asegúrate de que no tenga `/` al final
3. Redeploy el backend después de cambiar

### Frontend no conecta con Backend

**Problema:** Error 404 en llamadas API  
**Solución:**
1. Verifica que `VITE_API_URL` en Vercel apunte a tu backend de Render
2. Asegúrate de que no tenga `/api` al final (se agrega automáticamente)
3. Redeploy el frontend en Vercel

### Datos no se cargan

**Problema:** Backend responde pero sin datos  
**Solución:**
1. Verifica los logs de Render: `Dashboard → Logs`
2. Busca errores al leer el archivo Excel
3. Confirma que el archivo `PLAN INDICATIVO TENJO.xlsx` está presente

---

## 📊 Monitoreo

### Render (Backend)
- **Logs:** Dashboard → Tu servicio → Logs
- **Métricas:** Dashboard → Tu servicio → Metrics
- **Health Check:** Render verifica `/health` automáticamente

### Vercel (Frontend)
- **Deployments:** Project → Deployments
- **Analytics:** Project → Analytics (si está habilitado)
- **Logs:** Cada deployment tiene logs individuales

---

## 🔐 Seguridad

### Variables de Entorno Sensibles

✅ **Correcto:**
- Variables en Render/Vercel (no en código)
- `.env` en `.gitignore`
- `.env.example` para documentación

❌ **Evitar:**
- Subir archivos `.env` al repositorio
- Hardcodear URLs en el código
- Compartir variables de entorno públicamente

---

## 📝 URLs de Producción

Una vez desplegado, actualiza estos valores:

- **Backend API:** `https://dashboard-tenjo-backend.onrender.com`
- **Frontend Web:** `https://dashboard-tenjo.vercel.app`

---

## 🆘 Soporte

Si encuentras problemas:

1. **Render Logs:** Revisa los logs del backend para errores específicos
2. **Vercel Logs:** Revisa los logs del deployment del frontend
3. **Console del Navegador:** Abre DevTools (F12) para ver errores de red
4. **GitHub Issues:** Reporta problemas en el repositorio

---

## ✅ Checklist de Despliegue

### Backend (Render)
- [ ] Servicio creado con root directory `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Variable `NODE_ENV=production`
- [ ] Variable `FRONTEND_URL` configurada
- [ ] Health check responde OK
- [ ] Excel file presente en `backend/data/`

### Frontend (Vercel)
- [ ] Proyecto importado con root directory `frontend`
- [ ] Framework preset: Vite
- [ ] Variable `VITE_API_URL` configurada
- [ ] Build exitoso
- [ ] Dashboard carga correctamente
- [ ] Navegación funciona entre páginas
- [ ] Datos se cargan desde el backend

### Post-Despliegue
- [ ] Actualizar `FRONTEND_URL` en Render con URL de Vercel
- [ ] Probar todas las páginas (Dashboard, Metas, Finanzas)
- [ ] Verificar que los filtros funcionen
- [ ] Confirmar que los gráficos se renderizan
- [ ] Probar en diferentes navegadores

---

¡Tu proyecto ahora está en producción! 🎉
