# 🛍️ Unishop - Repositorio Central (Orquestador)

**Unishop** es una plataforma de e-commerce diseñada para el entorno **universitario**. Su propósito es ofrecer un espacio centralizado donde los estudiantes puedan comprar y vender artículos esenciales para sus carreras, como libros, materiales de laboratorio, implementos de arquitectura y accesorios de informática.

Este repositorio es el **orquestador principal** que contiene la configuración Docker Compose para ejecutar todos los servicios juntos en desarrollo local. Los componentes individuales están divididos en repositorios separados para mejor organización.

## ✅ Arquitectura Actual: Setup Híbrido Funcionando

- **Frontend:** https://uni-shop-frontend.vercel.app
- **Backend + IA + Base de Datos:** Servicios locales expuestos vía Tailscale Funnel
- **Backend Público:** https://unishop.tailbb818c.ts.net
- **Documentación API:** https://unishop.tailbb818c.ts.net/swagger-ui.html

---

## 📚 Documentación del Proyecto

Toda la documentación funcional, arquitectónica y de decisiones técnicas se encuentra centralizada en la carpeta `docs`. Para una comprensión completa del proyecto, se recomienda empezar por el índice de documentación.

➡️ [**Ir al Índice de Documentación**](/docs/README.md)

---


## 📂 Estructura del Proyecto

Este repositorio es el **orquestador central** que monta servicios de repositorios separados. Contiene la configuración Docker Compose y documentación general.

### Repositorios del Proyecto:

- [**UniShop Frontend**](https://github.com/Whatfck/UniShop-frontend) - Aplicación web en React con TypeScript y Vite (desplegado en Vercel).
- [**UniShop Backend**](https://github.com/Whatfck/UniShop-backend) - API REST en Spring Boot (Java).
- [**UniShop Database**](https://github.com/Whatfck/UniShop-database) - Configuración de PostgreSQL con pgvector.
- [**UniShop IA Service**](https://github.com/Whatfck/UniShop-ia-service) - Servicio de IA en Python/FastAPI.

### Estructura de Este Repositorio:

```plaintext
UniShop/ (Repositorio Central)
├── docs/                    # Documentación completa del proyecto
├── docker-compose.yml       # Orquestador de todos los servicios
├── backend/                 # Código backend (montado desde repo separado)
├── frontend/                # Código frontend (para desarrollo local)
├── ia-service/              # Código IA service (montado desde repo separado)
├── database/                # Scripts de BD (montado desde repo separado)
└── README.md               # Esta documentación
```

---

## 💻 Stack Tecnológico

| Capa      | Tecnología Principal | Detalles                                           |
| :-------- | :------------------- | :------------------------------------------------- |
| **Backend** | **Spring Boot**      | API REST modular, Java, Inyección de Dependencias. |
| **Frontend**  | **React**            | UI reactiva con TypeScript y Vite.                 |
| **Base de Datos** | **PostgreSQL**       | Base de datos relacional robusta con optimizaciones. |
| **ORM**       | **Hibernate**        | Mapeo Objeto-Relacional con pool de conexiones.    |
| **Autenticación** | **JWT + Spring Security** | Tokens JWT con Spring Security.                |
| **Validación** | **Bean Validation**  | Validaciones DTO robustas.                         |
| **Documentación** | **Swagger**          | API documentada automáticamente.                   |
| **Testing** | **JUnit**            | Pruebas unitarias implementadas.                   |
| **Logging** | **SLF4J + Logback**  | Logging estructurado con niveles configurables.    |
| **Seguridad** | **Spring Security**  | Headers de seguridad y control de origen.          |
| **IA/ML** | **pgvector + Spring Boot** | Sistema completo de IA con embeddings y fine-tuning. |
| **Estilos**     | **Tailwind CSS**     | Framework CSS Utility-First con tema claro fijo. |
| **Contenedores** | **Docker**           | Contenerización completa para desarrollo y producción. |

---

## 🔧 Puesta en Marcha

### Requisitos Previos

-   Node.js (v18 o superior) - Para desarrollo del frontend
-   Docker y Docker Compose - Para servicios backend
-   Tailscale - Para exposición pública del backend

### 🚀 Setup Híbrido: Backend Local + Frontend en Vercel

Este repositorio orquesta todos los servicios para desarrollo. El frontend se despliega por separado en Vercel.

#### 1. Levantar Servicios Locales (Backend + DB + IA)
```bash
# Clonar todos los repositorios o usar submódulos
git clone https://github.com/Whatfck/UniShop-backend backend
git clone https://github.com/Whatfck/UniShop-database database
git clone https://github.com/Whatfck/UniShop-ia-service ia-service

# Levantar todos los servicios
docker-compose up --build
```

#### 2. Exponer Backend al Internet
```bash
# Instalar Tailscale si no lo tienes
# https://tailscale.com/download

# Exponer backend públicamente
tailscale funnel --bg --yes --https=443 localhost:8080
```

**Backend público:** `https://unishop.tailbb818c.ts.net`

#### 3. Desarrollo del Frontend
```bash
# El frontend está en Vercel, pero para desarrollo local:
cd frontend
npm install
echo "VITE_API_URL=https://unishop.tailbb818c.ts.net" > .env
npm run dev
```

#### Servicios Disponibles:
-   **Backend API:** http://localhost:8080
-   **IA Service:** http://localhost:8000
-   **Base de Datos:** localhost:5432
-   **Frontend Local:** http://localhost:5174 (opcional)

### 🎯 Despliegue en Producción

#### Frontend en Vercel
1. Ve a [vercel.com](https://vercel.com) y conecta el repo del frontend
2. Configura `VITE_API_URL=https://unishop.tailbb818c.ts.net`
3. Deploy automático

#### Backend Expuesto con Tailscale Funnel
```bash
# En el servidor de producción
tailscale funnel --bg --yes --https=443 localhost:8080

# Verificar
tailscale funnel status
```

**URLs de Producción:**
- **Frontend:** https://uni-shop-frontend.vercel.app
- **Backend:** https://unishop.tailbb818c.ts.net
- **Documentación API:** https://unishop.tailbb818c.ts.net/swagger-ui.html

Para más detalles sobre el despliegue híbrido, consulta [**Guía de Despliegue**](/docs/despliegue-vercel.md).

### Ejecución Local (Backend)

Si deseas ejecutar solo el backend localmente:

1.  **Instalar dependencias:**
    ```bash
    cd backend
    ./mvnw install
    ```

2.  **Configurar base de datos:**
    Asegúrate de tener PostgreSQL corriendo localmente o ajusta las variables de entorno en `application.properties`.

3.  **Ejecutar en modo desarrollo:**
    ```bash
    ./mvnw spring-boot:run
    ```

4.  **Ver documentación:**
    - API: http://localhost:8080/api/v1
    - Swagger: http://localhost:8081

### Testing

```bash
cd backend
./mvnw test               # Ejecutar todas las pruebas
./mvnw test jacoco:report # Ejecutar con cobertura
# Pruebas end-to-end (futuro)
```

---

## 👨‍💻 Autores
|**Desarrolladores del proyecto**|
|-|
|**[@Whatfck](https://github.com/Whatfck)** — Daniel Pérez.| 
|**[@SebastianBolivar01](https://github.com/SebastianBolivar01)** — Sebastian Bolívar.| 
|**[@Jujuks](https://github.com/Jujuks)** — Julian Mera.|