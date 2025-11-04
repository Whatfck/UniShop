# 🏗️ Arquitectura de Unishop

Este documento describe la arquitectura general de la aplicación Unishop, explicando cómo están organizados sus componentes y cómo interactúan entre sí.

---

## 1. Visión General: Arquitectura de 3 Capas (3-Tier) + IA

Unishop sigue un patrón de **arquitectura de 3 capas**, que es un estándar en la industria para aplicaciones web escalables. Esto separa las responsabilidades de manera clara:

1.  **Capa de Presentación (Frontend)**:
    -   **Tecnología**: React con TypeScript.
    -   **Responsabilidad**: Renderizar la interfaz de usuario, gestionar el estado local de la UI y comunicarse con la capa de lógica a través de una API REST encriptada (HTTPS). Es un cliente "aislado" que consume servicios del backend sin acceso directo a la base de datos.

2.  **Capa de Lógica de Negocio (Backend)**:
    -   **Tecnología**: Spring Boot (Java).
    -   **Responsabilidad**: Contiene toda la lógica de negocio de la aplicación. Expone una API REST que el frontend consume. Gestiona la autenticación, validaciones, y orquesta las operaciones con la base de datos. Incluye integración básica con IA para recomendaciones y chatbot.

3.  **Capa de Datos (Base de Datos)**:
    -   **Tecnología**: PostgreSQL.
    -   **Responsabilidad**: Persistir y gestionar los datos de la aplicación de forma segura y eficiente. El backend es el único componente que tiene acceso directo a esta capa.

4.  **Capa de IA (Opcional/Separada)**:
    -   **Tecnología**: Servicio Python/FastAPI (ligero, local).
    -   **Responsabilidad**: Proporciona funcionalidades de IA básicas (recomendaciones por reglas, chatbot con respuestas predefinidas). Se comunica con el backend via API REST interna.



---

## 2. Arquitectura del Backend: Monolito Modular (DDD-Light)

El backend está diseñado como un **monolito modular**. Aunque se ejecuta como un único servicio, su código está organizado en **módulos de dominio** independientes (ej: `users`, `products`, `orders`).

### Ventajas de este enfoque:
-   **Organización**: El código es más fácil de entender y mantener, ya que las funcionalidades relacionadas están agrupadas.
-   **Escalabilidad**: Si el proyecto crece, estos módulos bien definidos son candidatos perfectos para ser extraídos a **microservicios** con un esfuerzo mínimo.
-   **Desarrollo en Paralelo**: Facilita que diferentes desarrolladores (o equipos) trabajen en distintos módulos sin interferir entre sí.

### Comunicación con IA:
- El backend se comunica con el servicio de IA via HTTP interno (localhost), manteniendo el frontend completamente aislado de la lógica de IA.

---

## 3. Arquitectura del Frontend

El frontend está diseñado como una **SPA (Single Page Application)** completamente aislada del backend y la base de datos. Se comunica únicamente a través de APIs REST encriptadas (HTTPS), sin conocimiento directo de la lógica de negocio o datos.

### Principios de Diseño:
- **Aislamiento Total**: El frontend no tiene acceso directo a BD ni lógica de IA. Todo pasa por el backend.
- **API-First**: Desarrollado pensando en la API como contrato principal.
- **Encriptación**: Toda comunicación con backend usa HTTPS para seguridad.

## 4. Arquitectura del Sistema de IA

El sistema de IA es un **servicio separado** (Python/FastAPI) que se ejecuta de forma independiente del backend principal. Esto mantiene la simplicidad del MVP mientras permite funcionalidades básicas de IA.

### Componentes del Sistema de IA (MVP):
- **Recommendation Service**: Sugiere productos relacionados basados en reglas simples (categoría, popularidad).
- **Chatbot Service**: Responde preguntas frecuentes con lógica basada en reglas y respuestas predefinidas.

### Comunicación:
- El backend (Spring Boot) se comunica con el servicio IA via HTTP interno (localhost), manteniendo el frontend completamente aislado.
- El servicio IA no expone endpoints públicos; solo el backend puede acceder.

### Beneficios de esta Arquitectura:
- **Simplicidad**: IA separada no complica el backend principal.
- **Aislamiento**: Frontend nunca toca lógica de IA directamente.
- **Escalabilidad**: Fácil agregar más IA después sin afectar el core.