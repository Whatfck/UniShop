# 🎨 Patrones de Software y Buenas Prácticas en Unishop

Este documento describe los patrones de diseño y las buenas prácticas de ingeniería de software que se aplican en el backend de Unishop, construido con Spring Boot. La elección de estos patrones busca garantizar un código mantenible, escalable y robusto.

---

## 1. Patrones de Diseño Principales

Spring Boot, al ser un framework "opinionado", nos guía en la aplicación de varios patrones de diseño estándar en la industria.

### Inyección de Dependencias (Dependency Injection - DI)
-   **Descripción**: Es el patrón central del framework. Las clases declaran sus dependencias (ej. un servicio que necesita un repositorio) en su constructor, y el contenedor de DI de Spring Boot se encarga de crear y "proveer" (inyectar) las instancias necesarias.
-   **Beneficios**:
    -   **Desacoplamiento**: Reduce la dependencia directa entre componentes.
    -   **Testabilidad**: Facilita enormemente las pruebas unitarias, ya que las dependencias pueden ser reemplazadas por *mocks* (objetos simulados).
    -   **Reusabilidad**: Fomenta la creación de servicios reutilizables.

### Arquitectura Modular (Module Pattern)
-   **Descripción**: La aplicación se organiza en módulos cohesivos por dominio (`UserModule`, `ProductModule`, `AuthModule`). Cada módulo encapsula sus `controllers`, `services` y `providers` relacionados.
-   **Beneficios**:
    -   **Organización**: Mantiene el código estructurado y fácil de navegar.
    -   **Límites Claros**: Define fronteras claras entre las distintas partes de la aplicación.
    -   **Preparación para Microservicios**: Una buena modularización es el primer paso para poder extraer un módulo a un servicio independiente en el futuro.

### Capas de Responsabilidad (Controller-Service-Repository)
-   **Descripción**: Separamos la lógica en tres capas distintas:
    1.  **Controllers**: Responsables de manejar las peticiones HTTP, validar la entrada (con DTOs) y devolver las respuestas. No contienen lógica de negocio.
    2.  **Services**: Contienen la lógica de negocio principal. Orquestan las operaciones y desacoplan los controladores de la capa de acceso a datos.
    3.  **Repositories**: Abstraen el acceso a la base de datos. TypeORM nos provee esta capa de forma muy eficiente.
-   **Beneficios**:
    -   **Separación de Conceptos (SoC)**: Cada parte del código tiene una responsabilidad única.
    -   **Mantenibilidad**: Es más fácil modificar la lógica de negocio sin tocar el código de la API, o cambiar la base de datos sin afectar la lógica de negocio.

### Data Transfer Object (DTO)
-   **Descripción**: Utilizamos clases DTO para definir la "forma" de los datos que viajan entre el cliente y el servidor. Combinado con las anotaciones de validación de Spring Boot (Bean Validation), nos permite validar automáticamente los datos de entrada.
-   **Beneficios**:
    -   **Contrato de API Claro**: Sirven como una fuente única de verdad para la estructura de los datos de la API.
    -   **Seguridad**: Protegen la aplicación de datos malformados o maliciosos.

### Patrón Decorador
-   **Descripción**: Java y Spring Boot utilizan anotaciones (`@Controller`, `@Service`, `@GetMapping`, etc.) para añadir metadatos y funcionalidades a las clases y sus miembros de una manera declarativa.
-   **Beneficios**:
    -   **Código Limpio**: Separa la lógica transversal (como el enrutamiento o la autenticación) de la lógica de negocio principal.
    -   **Legibilidad**: Hace que la intención del código sea más explícita.

### Patrón Repository (Spring Data JPA)
-   **Descripción**: Abstrae el acceso a datos mediante repositorios que encapsulan las consultas a la base de datos. Spring Data JPA genera automáticamente los repositorios basados en las entidades.
-   **Beneficios**:
    -   **Desacoplamiento**: La lógica de negocio no conoce los detalles de la base de datos.
    -   **Testabilidad**: Los repositorios pueden ser fácilmente mockeados en tests.
    -   **Mantenibilidad**: Cambios en la base de datos no afectan la lógica de negocio.

### Patrón Observer (Eventos)
-   **Descripción**: Implementado a través del sistema de logging personalizado que observa y registra eventos importantes del sistema (autenticación, errores).
-   **Beneficios**:
    -   **Auditoría**: Registro completo de acciones para debugging y compliance.
    -   **Monitoreo**: Métricas en tiempo real del comportamiento del sistema.
    -   **Reactividad**: Permite implementar acciones automáticas basadas en eventos.

### Patrón Strategy (Múltiples Algoritmos)
-   **Descripción**: Aplicado en el sistema de recomendaciones que puede usar diferentes estrategias (por categoría, popularidad, similitud) según el contexto.
-   **Beneficios**:
    -   **Flexibilidad**: Fácil añadir nuevas estrategias de recomendación.
    -   **Mantenibilidad**: Cada estrategia es independiente y testeable.
    -   **Escalabilidad**: Nuevos algoritmos no afectan los existentes.

### Patrón Factory (Creación de Objetos)
-   **Descripción**: Spring Data JPA utiliza este patrón para crear instancias de entidades y repositorios. También aplicado en la creación de respuestas DTO.
-   **Beneficios**:
    -   **Consistencia**: Garantiza que los objetos se creen correctamente.
    -   **Centralización**: Lógica de creación en un solo lugar.
    -   **Flexibilidad**: Fácil cambiar la lógica de creación sin afectar el código cliente.

### Patrón Singleton (Instancias Únicas)
-   **Descripción**: Aplicado en servicios como el CustomLogger y el pool de conexiones de base de datos.
-   **Beneficios**:
    -   **Eficiencia**: Una sola instancia compartida reduce el uso de recursos.
    -   **Consistencia**: Estado global consistente across la aplicación.
    -   **Control**: Instancia centralizada facilita el management.

### Patrón Command (Operaciones Complejas)
-   **Descripción**: Implementado en operaciones complejas como el procesamiento de productos y el fine-tuning del chatbot, donde cada operación es encapsulada.
-   **Beneficios**:
    -   **Reversibilidad**: Operaciones pueden ser deshechas si es necesario.
    -   **Logging**: Cada comando puede ser auditado independientemente.
    -   **Reutilización**: Comandos pueden ser ejecutados desde diferentes contextos.

---