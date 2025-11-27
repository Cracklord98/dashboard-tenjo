# 🚀 Instrucciones para Desarrollo Local y Producción

## 📁 Archivos de Variables de Entorno Creados

### Frontend:
- `.env` - Archivo base (local por defecto)
- `.env.local` - Desarrollo local (http://localhost:3002)
- `.env.production` - Producción (https://dashboard-tenjo.onrender.com)

### Backend:
- `.env` - Desarrollo local
- `.env.example` - Plantilla de ejemplo

## 🛠️ Cómo usar

### Para DESARROLLO LOCAL:

**1. Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
✅ Usa el archivo `backend/.env` con configuración local
✅ Puerto: 3002
✅ CORS configurado para localhost:3000

**2. Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
✅ Vite lee automáticamente `.env.local` en modo desarrollo
✅ Se conecta a: http://localhost:3002
✅ Abre en: http://localhost:3000 o http://localhost:5173

### Para PRODUCCIÓN:

**Frontend:**
```bash
cd frontend
npm run build
```
✅ Vite lee automáticamente `.env.production` al hacer build
✅ Se conecta a: https://dashboard-tenjo.onrender.com

**Backend:**
Render usa las variables de entorno configuradas en su panel:
- `PORT` - Lo asigna automáticamente Render
- `NODE_ENV=production`
- `FRONTEND_URL` - URL de tu frontend en Vercel/Netlify

## 📋 Orden de Prioridad de Variables (Vite)

1. `.env.local` - Usado en desarrollo (`npm run dev`)
2. `.env.production` - Usado en build (`npm run build`)
3. `.env` - Fallback general

## ✅ Verificación

**Local:**
- Backend health check: http://localhost:3002/health
- Frontend: http://localhost:3000

**Producción:**
- Backend health check: https://dashboard-tenjo.onrender.com/health
- Frontend: Tu URL de Vercel/Netlify

## 🔒 Seguridad

Los archivos `.env` están en `.gitignore` y NO se suben a GitHub.
Configura las variables de entorno directamente en:
- **Render**: Dashboard → Environment → Environment Variables
- **Vercel**: Project Settings → Environment Variables

## 📝 Notas

- Los cambios en `.env.local` NO afectan producción
- Vite requiere que las variables empiecen con `VITE_`
- No necesitas reiniciar el servidor para cambios en el código (nodemon y HMR)
- SÍ necesitas reiniciar si cambias archivos `.env`
