# 🛍️ Unishop

**Unishop** es una plataforma de e-commerce diseñada para el entorno **universitario**. Su propósito es ofrecer un espacio centralizado donde los estudiantes puedan comprar y vender artículos esenciales para sus carreras, como libros, materiales de laboratorio, implementos de arquitectura y accesorios de informática.

En esta primera fase, la plataforma está diseñada para ser utilizada **dentro de un solo campus universitario**, pero su arquitectura está preparada para escalar a nivel institucional o incluso multi-campus.

---

## 📚 Documentación del Proyecto

Toda la documentación funcional, arquitectónica y de decisiones técnicas se encuentra centralizada en la carpeta `docs`. Para una comprensión completa del proyecto, se recomienda empezar por el índice de documentación.

➡️ [**Ir al Índice de Documentación**](/docs/README.md)

---

## ✨ Estado Actual del Proyecto

El proyecto ha completado exitosamente la **fase de desarrollo del backend** (~90% completado). Se ha implementado una API REST completa y robusta siguiendo las mejores prácticas de desarrollo.

### ✅ **Fase de Planificación - COMPLETADA**
-   ✅ **Requerimientos Funcionales y No Funcionales** definidos.
-   ✅ **Arquitectura de 3 Capas** y **Monolito Modular** establecida.
-   ✅ **Patrones de Software** (Inyección de Dependencias, Controller-Service, etc.) documentados.
-   ✅ **Stack Tecnológico** seleccionado y justificado.

### ✅ **Fase de Desarrollo Backend - COMPLETADA**
-   ✅ **API REST completa** con 70+ endpoints documentados en Swagger
-   ✅ **Autenticación JWT** con roles (USER, MODERATOR, ADMIN)
-   ✅ **Gestión completa de productos** con moderación automática
-   ✅ **Sistema de categorías** con control de acceso
-   ✅ **Panel de moderación** para usuarios MODERATOR
-   ✅ **Estadísticas avanzadas** para vendedores
-   ✅ **Búsqueda y filtros** avanzados con ordenamiento
-   ✅ **Sistema de favoritos** y métricas de productos
-   ✅ **Verificación de teléfono** y contacto WhatsApp
-   ✅ **Recomendaciones inteligentes** basadas en popularidad
-   ✅ **Chatbot IA completo** con procesamiento local gratuito
-   ✅ **Sistema de IA avanzado** con 15 tablas especializadas
-   ✅ **Fine-tuning continuo** del chatbot con aprendizaje automático
-   ✅ **Base de conocimientos semántica** preparada para pgvector
-   ✅ **Entrenamiento automático** desde conversaciones reales
-   ✅ **Detección de intents** y extracción de entidades
-   ✅ **Seguridad avanzada** (Helmet, CORS, timeouts, compresión)
-   ✅ **Base de datos optimizada** con PostgreSQL y TypeORM
-   ✅ **Testing completo** con 45 pruebas unitarias pasando
-   ✅ **Logging personalizado** con Winston y auditoría completa
-   ✅ **Documentación técnica** completa y actualizada

### 🚀 **Próximas Fases**
1. **Desarrollo del Frontend** - React con TypeScript y Tailwind CSS
2. **Integración Frontend-Backend** - Conectar APIs implementadas
3. **Funcionalidades IA Avanzadas** - Integración con modelos LLM de código abierto ejecutados localmente
4. **Testing E2E** - Pruebas de integración completas
5. **Despliegue en Producción** - Configuración cloud-ready con Kubernetes
6. **Monitoreo y Analytics** - Dashboards en tiempo real

---

## 🚀 Stack Tecnológico

| Capa      | Tecnología Principal | Detalles                                           |
| :-------- | :------------------- | :------------------------------------------------- |
| **Backend** | **NestJS**           | API REST modular, TypeScript, Inyección de Dependencias. |
| **Frontend**  | **React**            | UI reactiva con TypeScript y Vite.                 |
| **Base de Datos** | **PostgreSQL**       | Base de datos relacional robusta con optimizaciones. |
| **ORM**       | **TypeORM**          | Mapeo Objeto-Relacional con pool de conexiones.    |
| **Autenticación** | **JWT + Passport**   | Tokens JWT con estrategia Passport.                |
| **Validación** | **class-validator**  | Validaciones DTO robustas.                         |
| **Documentación** | **Swagger**          | API documentada automáticamente.                   |
| **Testing** | **Vitest**           | 45+ pruebas unitarias implementadas, más rápido que Jest. |
| **Logging** | **Winston**          | Logging estructurado con niveles configurables.    |
| **Seguridad** | **Helmet + CORS**    | Headers de seguridad y control de origen.          |
| **IA/ML** | **pgvector + NestJS** | Sistema completo de IA con embeddings y fine-tuning. |
| **Estilos**     | **Tailwind CSS**     | Framework CSS Utility-First para un diseño rápido. |
| **Contenedores** | **Docker**           | Contenerización completa para desarrollo y producción. |

---

## 🔧 Puesta en Marcha

### Requisitos Previos

-   Node.js (v18 o superior)
-   Docker y Docker Compose

### Ejecución con Docker (Recomendado)

Este es el método más sencillo para levantar todo el entorno de desarrollo (Backend, Frontend, Base de Datos).

1.  **Configurar variables de entorno del backend:**
    En la carpeta `backend/`, renombra el archivo `.env.example` a `.env`. Los valores por defecto están configurados para funcionar con Docker Compose.

2.  **Construir y levantar los servicios:**
    Desde la raíz del proyecto (`/Unishop`), ejecuta:
    ```bash
    docker-compose up --build
    ```

3.  **Servicios disponibles:**
    -   **Backend API:** http://localhost:8080
    -   **Documentación de la API (Swagger):** http://localhost:8080/api/docs
    -   **Base de Datos (PostgreSQL):** `localhost:5432` (usuario: `unishop_user`, BD: `unishop_db`)

### Acceso Público con Tailscale Funnel

Para acceder a la aplicación desde cualquier lugar de forma segura y gratuita:

1. **Instalar Tailscale** en tu máquina Windows:
   - Descarga desde https://tailscale.com/download
   - Instala y regístrate/inicia sesión en tu cuenta

2. **Configurar Funnel**:
   ```bash
   # Conectar a tu tailnet
   tailscale login

   # Habilitar acceso público (funnel)
   tailscale funnel --bg --yes --https=443 localhost:5174  

   # Detener acceso público (funnel)
   tailscale funnel --https=443 off
   ```

3. **Iniciar la aplicación**:
   ```bash
   make run
   ```

**Tu aplicación estará públicamente accesible en: `https://daniel-pc.tailbb818c.ts.net`**

Para más detalles sobre el deployment con Docker y Tailscale, consulta [README-DOCKER.md](README-DOCKER.md).

### Ejecución Local (Backend)

Si deseas ejecutar solo el backend localmente:

1.  **Instalar dependencias:**
    ```bash
    cd backend
    npm install
    ```

2.  **Configurar base de datos:**
    Asegúrate de tener PostgreSQL corriendo localmente o ajusta las variables de entorno en `.env`.

3.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run start:dev
    ```

4.  **Ver documentación:**
    - API: http://localhost:8080/api/v1
    - Swagger: http://localhost:8080/api/docs

### Testing

```bash
cd backend
npm run test              # Ejecutar todas las pruebas
npm run test:cov          # Ejecutar con cobertura
npm run test:e2e          # Pruebas end-to-end (futuro)
```

---

## 📂 Estructura del Proyecto

```plaintext
Unishop/
├── backend/        # API REST en NestJS (TypeScript)
├── frontend/       # Aplicación en React (TypeScript + Vite)
├── docs/           # Documentación (Requerimientos, Arquitectura, etc.)
└── docker-compose.yml # Orquestador de servicios para desarrollo
```

---

## 🌱 Futuro del Proyecto

-   **Expansión:** Aunque inicialmente se enfoca en un solo campus, la arquitectura está diseñada para escalar a múltiples instituciones.
-   **Nuevas Funcionalidades:** El diseño modular permitirá añadir fácilmente nuevas características como subastas, intercambios o módulos específicos por carrera.
-   **Inteligencia Artificial:** Se implementa IA con modelos LLM de código abierto ejecutados localmente para recomendaciones de productos, moderación de contenido y un chatbot de asistencia, garantizando privacidad y soberanía de datos.

---

## 👨‍💻 Autor

**[@Whatfck](https://github.com/Whatfck)** — Desarrollador del proyecto.
