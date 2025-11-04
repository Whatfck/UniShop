# ⚙️ Decisiones Técnicas de Unishop

Este documento registra y justifica las decisiones tecnológicas clave tomadas durante el desarrollo del proyecto. El objetivo es mantener un registro histórico del "porqué" detrás de nuestro stack tecnológico.

---

## 1. Backend: Spring Boot (Java)

-   **Decisión**: Cambiar de NestJS a Spring Boot (Java) para alinearse con requerimientos del proyecto.
-   **Justificación**:
    -   **Requisito Específico**: El backend debe ser desarrollado en Java según especificaciones del proyecto.
    -   **Madurez Empresarial**: Spring Boot es el framework Java más utilizado en la industria, con excelente soporte para APIs REST, seguridad y ORM.
    -   **Arquitectura Robusta**: Proporciona inyección de dependencias, controladores REST, servicios y repositorios de forma nativa.
    -   **Ecosistema Completo**: Integración perfecta con Hibernate (ORM), Spring Security (JWT), Swagger y testing con JUnit.

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

## 5. Sistema de IA: Servicio Separado Python/FastAPI

-   **Decisión**: Implementar IA como servicio separado (Python/FastAPI) con modelos ligeros, manteniendo simplicidad para MVP universitario.
-   **Justificación**:
    -   **Simplicidad para MVP**: Servicio independiente no complica el backend Java principal.
    -   **Modelos Ligeros**: Recomendaciones por reglas simples, chatbot con respuestas predefinidas (sin LLM pesados inicialmente).
    -   **Aislamiento**: Frontend completamente separado de lógica IA; backend actúa como intermediario.
    -   **Escalabilidad**: Fácil agregar modelos más avanzados después sin afectar el core.
    -   **Privacidad**: Todo procesamiento local en VM, sin datos saliendo al exterior.
    -   **Requisitos Mínimos**: Funciona en CPU básica, sin necesidad de GPU especializada para MVP.

## 6. Arquitectura de Testing: JUnit + Spring Boot Test

-   **Decisión**: Implementar testing con JUnit y Spring Boot Test para backend Java, manteniendo enfoque en pruebas unitarias y de integración esenciales.
-   **Justificación**:
    -   **Framework Nativo**: JUnit es el estándar de facto para testing en Java/Spring Boot.
    -   **Integración Completa**: Spring Boot Test permite testing de controladores, servicios y repositorios con contexto real.
    -   **Cobertura Básica**: Enfoque en 70% cobertura de código crítico (servicios, controladores).
    -   **Simplicidad para MVP**: Testing suficiente para validar funcionalidad sin overhead excesivo.
    -   **Mantenibilidad**: Tests documentan comportamiento y previenen regresiones.

## 7. Documentación: Markdown + Swagger + TypeDoc

-   **Decisión**: Mantener documentación técnica en Markdown, APIs documentadas con Swagger, y código con TypeDoc.
-   **Justificación**:
    -   **Accesibilidad**: Documentación en Markdown es fácil de mantener y versionar con Git.
    -   **APIs Auto-Documentadas**: Swagger genera documentación interactiva automáticamente desde el código.
    -   **Consistencia**: TypeDoc mantiene documentación del código sincronizada con los cambios.
    -   **Developer Experience**: Documentación completa acelera la incorporación de nuevos desarrolladores.