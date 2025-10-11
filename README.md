# 🛍️ Unishop

**Unishop** es una plataforma de e-commerce diseñada para el entorno **universitario**. Su propósito es ofrecer un espacio centralizado donde los estudiantes puedan comprar y vender artículos esenciales para sus carreras, como libros, materiales de laboratorio, implementos de arquitectura y accesorios de informática.

En esta primera fase, la plataforma está diseñada para ser utilizada **dentro de un solo campus universitario**, pero su arquitectura está preparada para escalar a nivel institucional o incluso multi-campus.

---

## 📚 Documentación del Proyecto

Toda la documentación funcional, arquitectónica y de decisiones técnicas se encuentra centralizada en la carpeta `docs`. Para una comprensión completa del proyecto, se recomienda empezar por el índice de documentación.

➡️ [**Ir al Índice de Documentación**](/docs/README.md)

---

## ✨ Estado Actual del Proyecto

El proyecto ha completado su fase inicial de **planificación y diseño arquitectónico**. Se han definido los requerimientos, la arquitectura de software y los patrones de diseño que guiarán el desarrollo.

-   ✅ **Requerimientos Funcionales y No Funcionales** definidos.
-   ✅ **Arquitectura de 3 Capas** y **Monolito Modular** establecida.
-   ✅ **Patrones de Software** (Inyección de Dependencias, Controller-Service, etc.) documentados.
-   ✅ **Stack Tecnológico** seleccionado y justificado.

La siguiente fase es el desarrollo del **backend**, comenzando por la definición de las entidades de la base de datos y la implementación de los módulos de negocio.

---

## 🚀 Stack Tecnológico

| Capa      | Tecnología Principal | Detalles                                           |
| :-------- | :------------------- | :------------------------------------------------- |
| **Backend** | **NestJS**           | API REST modular, TypeScript, Inyección de Dependencias. |
| **Frontend**  | **React**            | UI reactiva con TypeScript y Vite.                 |
| **Base de Datos** | **PostgreSQL**       | Base de datos relacional robusta.                  |
| **ORM**       | **TypeORM**          | Mapeo Objeto-Relacional para la interacción con la BD. |
| **Estilos**     | **Tailwind CSS**     | Framework CSS Utility-First para un diseño rápido. |
| **Contenedores** | **Docker**           | Contenerización de servicios para portabilidad.    |

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
    -   **Documentación de la API (Swagger):** http://localhost:8080/api
    -   **Frontend:** http://localhost:3000
    -   **Base de Datos (PostgreSQL):** `localhost:5432`

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
-   **Inteligencia Artificial:** Se planea integrar IA para recomendaciones de productos, moderación de contenido y un chatbot de asistencia.

---

## 👨‍💻 Autor

**[@Whatfck](https://github.com/Whatfck)** — Desarrollador del proyecto.
