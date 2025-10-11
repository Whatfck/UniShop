# 🛍️ Unishop - Backend (API)

Este es el backend de la aplicación Unishop. Se trata de una API REST construida con **NestJS** que gestiona toda la lógica de negocio, la autenticación de usuarios y la interacción con la base de datos.

---

## 🚀 Tecnologías Principales

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **ORM**: [TypeORM](https://typeorm.io/) para la comunicación con la base de datos.
- **Validación**: `class-validator` y `class-transformer` para DTOs.
- **Documentación de API**: Swagger (OpenAPI) integrado con `@nestjs/swagger`.
- **Testing**: Jest para pruebas unitarias y de integración.
- **Contenedores**: Docker

---

## 📂 Estructura del Proyecto (Arquitectura Modular)

El proyecto sigue una arquitectura modular inspirada en Domain-Driven Design (DDD). Cada módulo de negocio (dominio) se encuentra en su propia carpeta dentro de `src/`.

```plaintext
src/
├── user/
│   ├── user.controller.ts  # Endpoints de la API
│   ├── user.service.ts     # Lógica de negocio
│   ├── user.module.ts      # Módulo de NestJS
│   ├── entities/
│   │   └── user.entity.ts  # Entidad de TypeORM
│   └── dto/
│       └── create-user.dto.ts # DTOs para transferencia de datos
├── product/
│   └── ...
├── shared/                 # Módulos y utilidades compartidas
└── app.module.ts           # Módulo raíz de la aplicación
```

---

## 🔧 Cómo ejecutar el proyecto (Desarrollo)

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `backend/` a partir del ejemplo `backend/.env.example` (que deberás crear) y configúralo con los datos de tu base de datos.

3.  **Ejecutar la aplicación en modo desarrollo:**
    El servidor se reiniciará automáticamente con cada cambio.
    ```bash
    npm run start:dev
    ```

La API estará disponible en `http://localhost:8080` (o el puerto que configures).
La documentación interactiva de la API (Swagger) estará en `http://localhost:8080/api`.

## 🐳 Ejecución con Docker

Desde la raíz del proyecto `Unishop/`, puedes levantar todo el stack (frontend, backend, DB) con un solo comando:

```bash
docker-compose up --build
```