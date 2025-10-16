# 🏗️ Arquitectura de Unishop

Este documento describe la arquitectura general de la aplicación Unishop, explicando cómo están organizados sus componentes y cómo interactúan entre sí.

---

## 1. Visión General: Arquitectura de 3 Capas (3-Tier)

Unishop sigue un patrón de **arquitectura de 3 capas**, que es un estándar en la industria para aplicaciones web escalables. Esto separa las responsabilidades de manera clara:

1.  **Capa de Presentación (Frontend)**:
    -   **Tecnología**: React con TypeScript.
    -   **Responsabilidad**: Renderizar la interfaz de usuario, gestionar el estado local de la UI y comunicarse con la capa de lógica a través de una API REST. Es un cliente "liviano" que consume los servicios del backend.

2.  **Capa de Lógica de Negocio (Backend)**:
    -   **Tecnología**: NestJS (TypeScript).
    -   **Responsabilidad**: Contiene toda la lógica de negocio de la aplicación. Expone una API REST que el frontend consume. Gestiona la autenticación, validaciones, y orquesta las operaciones con la base de datos.

3.  **Capa de Datos (Base de Datos)**:
    -   **Tecnología**: PostgreSQL.
    -   **Responsabilidad**: Persistir y gestionar los datos de la aplicación de forma segura y eficiente. El backend es el único componente que tiene acceso directo a esta capa.



---

## 2. Arquitectura del Backend: Monolito Modular (DDD-Light)

El backend está diseñado como un **monolito modular**. Aunque se ejecuta como un único servicio, su código está organizado en **módulos de dominio** independientes (ej: `users`, `products`, `orders`).

### Ventajas de este enfoque:
-   **Organización**: El código es más fácil de entender y mantener, ya que las funcionalidades relacionadas están agrupadas.
-   **Escalabilidad**: Si el proyecto crece, estos módulos bien definidos son candidatos perfectos para ser extraídos a **microservicios** con un esfuerzo mínimo.
-   **Desarrollo en Paralelo**: Facilita que diferentes desarrolladores (o equipos) trabajen en distintos módulos sin interferir entre sí.

---

## 3. Arquitectura del Frontend

*(Esta sección se detallará más adelante. Se basará en una arquitectura de componentes reutilizables, posiblemente agrupados por funcionalidad o "features").*

## 4. Arquitectura del Sistema de IA y Chatbot

El sistema de IA está integrado como un módulo adicional dentro del monolito NestJS, manteniendo la coherencia arquitectónica mientras añade capacidades avanzadas de procesamiento de lenguaje natural.

### Componentes del Sistema de IA:
- **Chatbot Service**: Maneja las conversaciones con usuarios, utilizando modelos LLM locales para generar respuestas contextuales.
- **Moderation Service**: Analiza contenido de publicaciones para detectar información de contacto no permitida o contenido inapropiado.
- **Recommendation Service**: Utiliza embeddings vectoriales almacenados en pgvector para sugerir productos relacionados basados en similitud semántica.
- **Training Service**: Gestiona el fine-tuning continuo del chatbot basado en conversaciones reales y feedback de usuarios.

### Integración con LLM Local:
- Los modelos de lenguaje (como Llama 2, Mistral o GPT-J) se ejecutan en contenedores dedicados o instancias locales.
- La comunicación entre NestJS y los LLM se realiza a través de APIs REST locales o bibliotecas de integración (ej: llama.cpp, transformers.js).
- Los datos sensibles nunca salen de la infraestructura local, garantizando privacidad y cumplimiento normativo.

### Beneficios de esta Arquitectura:
- **Privacidad de Datos**: Todo el procesamiento de IA permanece dentro del control de la institución.
- **Bajos Costos Operativos**: No hay costos recurrentes por uso de APIs externas.
- **Escalabilidad Modular**: El sistema de IA puede escalarse independientemente del resto de la aplicación.
- **Mantenibilidad**: Al estar integrado en NestJS, sigue los mismos patrones y estándares del proyecto.