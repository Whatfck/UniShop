# 🎨 Patrones de Software y Buenas Prácticas en Unishop

Este documento describe los patrones de diseño y las buenas prácticas de ingeniería de software que se aplican en el backend de Unishop, construido con NestJS. La elección de estos patrones busca garantizar un código mantenible, escalable y robusto.

---

## 1. Patrones de Diseño Principales

NestJS, al ser un framework "opinionado", nos guía en la aplicación de varios patrones de diseño estándar en la industria.

### Inyección de Dependencias (Dependency Injection - DI)
-   **Descripción**: Es el patrón central del framework. Las clases declaran sus dependencias (ej. un servicio que necesita un repositorio) en su constructor, y el contenedor de DI de NestJS se encarga de crear y "proveer" (inyectar) las instancias necesarias.
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
-   **Descripción**: Utilizamos clases DTO para definir la "forma" de los datos que viajan entre el cliente y el servidor. Combinado con los pipes de validación de NestJS (`ValidationPipe`), nos permite validar automáticamente los datos de entrada.
-   **Beneficios**:
    -   **Contrato de API Claro**: Sirven como una fuente única de verdad para la estructura de los datos de la API.
    -   **Seguridad**: Protegen la aplicación de datos malformados o maliciosos.

### Patrón Decorador
-   **Descripción**: TypeScript y NestJS utilizan decoradores (`@Controller`, `@Injectable`, `@Get`, etc.) para añadir metadatos y funcionalidades a las clases y sus miembros de una manera declarativa.
-   **Beneficios**:
    -   **Código Limpio**: Separa la lógica transversal (como el enrutamiento o la autenticación) de la lógica de negocio principal.
    -   **Legibilidad**: Hace que la intención del código sea más explícita.

---