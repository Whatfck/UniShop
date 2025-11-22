# 🚀 Despliegue: Frontend en Vercel + Backend Local

## Resumen del Cambio

Se ha modificado la arquitectura de despliegue para separar las responsabilidades:

- **Frontend:** Desplegado en Vercel (CDN global, escalable)
- **Backend + IA + Base de Datos:** Ejecutándose localmente en Docker, expuesto vía Tailscale Funnel

## Beneficios

- ✅ **Rendimiento:** Frontend servido desde CDN de Vercel
- ✅ **Costo:** Vercel gratuito para proyectos personales
- ✅ **Seguridad:** Backend local, datos no en la nube
- ✅ **Desarrollo:** Frontend independiente, builds rápidos
- ✅ **Escalabilidad:** Frontend escala automáticamente

## Configuración Paso a Paso

### 1. Servicios Locales

```bash
# Levantar backend, DB e IA service
docker-compose up --build
```

Verifica que estén corriendo:
- Backend: http://localhost:8080
- IA Service: http://localhost:8000
- DB: localhost:5432

### 2. Exponer Servicios con Tailscale Funnel

```bash
# Instalar Tailscale (si no lo tienes)
# https://tailscale.com/download

# Iniciar sesión
tailscale login

# Exponer backend (puerto 8080)
tailscale funnel --bg --yes --https=443 localhost:8080

# Exponer IA service (puerto 8000) con subdominio diferente
tailscale funnel --bg --yes --https=443 localhost:8000 --subdomain=unishop-ia
```

**URLs públicas:**
- **Backend:** `https://unishop.tailbb818c.ts.net`
- **IA Service:** `https://unishop-ia.tailbb818c.ts.net`

### 3. Desplegar Frontend en Vercel

#### Opción A: Desde Vercel Dashboard
1. Ve a [vercel.com](https://vercel.com) y crea cuenta
2. Click "Import Project"
3. Conecta tu repositorio GitHub/GitLab
4. Selecciona la carpeta `frontend/`
5. Configura variables de entorno:
   - `VITE_API_URL`: `https://unishop.tailbb818c.ts.net`

#### Opción B: Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde carpeta frontend
cd frontend
vercel --prod

# Configurar VITE_API_URL cuando pregunte
```

### 4. Verificar Integración

1. Accede al frontend desplegado en Vercel
2. Verifica que las llamadas API funcionen (abre DevTools > Network)
3. Prueba funcionalidades que requieran backend

## Desarrollo Local

### Frontend Independiente
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env: VITE_API_URL=http://localhost:8080
npm run dev
```

### Backend Local
```bash
docker-compose up
# Backend en localhost:8080
```

## Solución de Problemas

### CORS Errors
- Verifica que `WebConfig.java` permita el origen de Vercel
- Agrega el dominio específico si es necesario

### Tailscale Funnel no funciona
```bash
# Ver estado
tailscale status

# Reiniciar funnel
tailscale funnel --https=443 off
tailscale funnel --bg --yes --https=443 localhost:8080
```

### Variables de Entorno en Vercel
- En dashboard de Vercel: Project Settings > Environment Variables
- Para preview deployments, configura en "Preview" environment

## URLs de Producción

- **Frontend:** https://uni-shop-frontend.vercel.app
- **Backend:** https://unishop.tailbb818c.ts.net
- **IA Service:** https://unishop-ia.tailbb818c.ts.net
- **Documentación API:** https://unishop.tailbb818c.ts.net/swagger-ui.html

## Costos

- **Vercel:** Gratuito (hobby plan)
- **Tailscale:** Gratuito para uso personal
- **Servidor local:** Solo costos de electricidad/internet

## Próximos Pasos

1. Configurar CI/CD para auto-deploy en Vercel
2. Agregar monitoreo básico
3. Considerar migrar backend a VPS si necesitas 24/7 uptime