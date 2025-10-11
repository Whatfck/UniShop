# ⚙️ Decisiones Técnicas de Unishop

Este documento registra y justifica las decisiones tecnológicas clave tomadas durante el desarrollo del proyecto. El objetivo es mantener un registro histórico del "porqué" detrás de nuestro stack tecnológico.

---

## 1. Backend: NestJS (TypeScript)

-   **Decisión**: Usar NestJS en lugar de Spring Boot (Java).
-   **Justificación**:
    -   **Unificación del Lenguaje**: Utilizar TypeScript tanto en el backend como en el frontend (React) reduce la carga cognitiva y simplifica el desarrollo. Permite compartir código, especialmente tipos y DTOs, garantizando la consistencia entre ambas capas.
    -   **Arquitectura Robusta**: NestJS promueve una arquitectura modular y en capas (Controllers, Services, Modules) muy similar a la de Spring, lo que facilita la organización y escalabilidad del código desde el principio.
    -   **Ecosistema Moderno**: Se integra de forma nativa con herramientas modernas del ecosistema de Node.js como TypeORM/Prisma, Jest para testing y Swagger para la documentación de APIs.

## 2. Base de Datos: PostgreSQL

-   **Decisión**: Utilizar una base de datos relacional (PostgreSQL) en lugar de una NoSQL (como MongoDB).
-   **Justificación**:
    -   **Naturaleza de los Datos**: Los datos de un e-commerce (usuarios, productos, pedidos) son inherentemente relacionales. Un esquema relacional garantiza la integridad y consistencia de los datos (ACID).
    -   **Fiabilidad y Madurez**: PostgreSQL es una base de datos extremadamente robusta, probada y con un gran respaldo de la comunidad.
    -   **Flexibilidad**: Aunque es relacional, PostgreSQL tiene un excelente soporte para tipos de datos semi-estructurados como JSONB, ofreciendo lo mejor de ambos mundos si fuera necesario en el futuro.

## 3. Contenerización: Docker y Docker Compose

-   **Decisión**: Utilizar Docker para cada servicio (frontend, backend, DB) y Docker Compose para orquestarlos en desarrollo.
-   **Justificación**:
    -   **Portabilidad y Consistencia**: Garantiza que el entorno de desarrollo sea idéntico para todos los desarrolladores y muy similar al de producción, eliminando el clásico "en mi máquina funciona".
    -   **Facilidad de Despliegue**: Simplifica el proceso de configuración y ejecución de todo el stack con un solo comando (`docker-compose up`).
    -   **Preparado para la Nube (Cloud-Ready)**: Esta decisión nos prepara para desplegar la aplicación fácilmente en cualquier proveedor de la nube utilizando tecnologías como Kubernetes.

## 4. Frontend: React con TypeScript

-   **Decisión**: Usar React con TypeScript.
-   **Justificación**:
    -   **Componentización**: La arquitectura basada en componentes de React facilita la creación de UIs complejas y reutilizables.
    -   **Seguridad de Tipos**: TypeScript añade un sistema de tipado estático que previene una gran cantidad de errores comunes en tiempo de desarrollo, mejorando la calidad y mantenibilidad del código.
    -   **Ecosistema y Comunidad**: React tiene uno de los ecosistemas más grandes y una comunidad muy activa, lo que asegura soporte y una gran cantidad de librerías disponibles.