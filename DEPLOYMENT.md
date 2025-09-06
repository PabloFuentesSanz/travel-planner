# Configuración de Deployment

## ✅ Pasos completados:

1. **Archivo `vercel.json`** creado para manejar rutas SPA
2. **Variables de entorno** configuradas
3. **Archivo `_redirects`** creado como respaldo
4. **URLs de redirección** actualizadas en el código

## Variables de Entorno en Vercel

Ve a tu proyecto en Vercel Dashboard > Settings > Environment Variables y añade:

```
VITE_SUPABASE_URL=https://lweskjeohexrlrmfwipf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZXNramVvaGV4cmxybWZ3aXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzgzNTEsImV4cCI6MjA3Mjc1NDM1MX0.f61NM9yr7GEVtKkWVANceLM0oOqwj5H5gW4DGiVFr-I
VITE_APP_URL=https://ryokoplanner.vercel.app
```

**Nota**: La aplicación detecta automáticamente si está en desarrollo (localhost:3000) o producción (usando VITE_APP_URL).

## Configuración en Supabase

Ve a tu Dashboard de Supabase > Authentication > URL Configuration:

1. **Site URL**: `https://ryokoplanner.vercel.app`
2. **Redirect URLs**: 
   - `https://ryokoplanner.vercel.app/dashboard`
   - `http://localhost:3000/dashboard`

## Pasos para Deployment

1. ✅ Configurar variables de entorno en Vercel
2. ✅ Configurar URLs en Supabase
3. ✅ Crear `vercel.json` para manejo de rutas SPA
4. 🔄 Hacer redeploy de la aplicación en Vercel
5. 🔄 Probar el login en producción

## Problema del Error 404

El error 404 en `/dashboard` se debe a que Vercel no sabía cómo manejar las rutas de cliente de React Router. El archivo `vercel.json` que creamos soluciona esto redirigiendo todas las rutas a `index.html` para que React Router las maneje.