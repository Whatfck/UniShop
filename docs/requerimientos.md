# 📄 Requerimientos de Unishop

Este documento detalla los requerimientos funcionales y no funcionales para la plataforma de marketplace Unishop.

---

## 1. Requerimientos Funcionales (RF)

Los requerimientos funcionales describen las funcionalidades específicas que el sistema debe ofrecer a los usuarios.

### RF-01: Gestión de Usuarios
-   **RF-01.1:** El registro estará limitado a correos institucionales(ej: `...@miuniversidad.edu.co`). El proceso solicitará nombre, correo y contraseña. Opcionalmente, el usuario podrá añadir una foto de perfil durante el registro o más tarde.
-   **RF-01.2:** Un usuario registrado debe poder iniciar sesión con su correo y contraseña.
-   **RF-01.3:** Un usuario debe poder gestionar su cuenta, incluyendo la capacidad de cambiar su contraseña y solicitar la recuperación de la cuenta si la olvida.
-   **RF-01.4:** Un usuario debe poder ver y editar su perfil, que consistirá en su nombre y una foto (opcional).
-   **RF-01.5:** El sistema debe gestionar múltiples roles de usuario:
    -   `USER`: Rol estándar para todos. Un usuario puede comprar y vender.
    -   `MODERADOR`: Puede revisar, aprobar, y eliminar publicaciones de otros usuarios.
    -   `ADMIN`: Tiene control total sobre la plataforma, incluyendo la gestión de usuarios y roles.
-   **RF-01.6:** Cualquier usuario debe poder ver el perfil público de un vendedor, donde se listarán todas sus publicaciones activas.

### RF-02: Gestión de Publicaciones
-   **RF-02.1:** Cualquier usuario con un número de teléfono verificado puede publicar un nuevo producto. Es **obligatorio** especificar nombre, descripción, precio, categoría y al menos una foto del producto.
-   **RF-02.2:** Un usuario puede gestionar sus publicaciones, lo que incluye:
    -   Editar la información de una publicación activa.
    -   Marcar una publicación como `VENDIDO`, lo que la desactivará de la vista pública pero la mantendrá en su historial.
    -   Eliminar permanentemente una publicación.
-   **RF-02.3:** Cualquier usuario (registrado o no) debe poder ver la lista de productos disponibles.
-   **RF-02.4:** Cualquier usuario debe poder buscar productos por nombre o categoría. Los resultados deben mostrar los productos más relevantes y una sección de "productos relacionados".
-   **RF-02.5:** Cualquier usuario debe poder ver los detalles de un producto específico (fotos, descripción, precio, información del vendedor).
-   **RF-02.6:** Un `MODERADOR` debe tener un panel para ver las publicaciones pendientes de revisión, aprobarlas o rechazarlas.

### RF-03: Interacción y Contacto
-   **RF-03.1:** El método de contacto principal será WhatsApp. Al hacer clic en "Contactar", se generará un mensaje predefinido para enviar al vendedor (ej: "Hola, me interesa tu producto '[Nombre del Producto]' que vi en Unishop.").
-   **RF-03.2:** Para poder publicar un producto, un usuario debe primero verificar su número de teléfono. El sistema debe tener un mecanismo para esta verificación (ej: envío de código por SMS/WhatsApp).
-   **RF-03.3:** Un usuario no está obligado a verificar su número de teléfono para contactar a un vendedor.
-   **RF-03.4:** Un usuario debe poder guardar publicaciones en una lista de "Favoritos".
-   **RF-03.5:** Un usuario debe poder ver su lista de favoritos. Si una publicación en esta lista es marcada como `VENDIDO` o eliminada, debe aparecer como "Publicación inactiva" en la lista de favoritos del usuario.

### RF-04: Métricas y Estadísticas
-   **RF-04.1:** El sistema debe registrar un historial de los productos que un usuario ha visitado.
-   **RF-04.2:** Para cada publicación, el sistema debe contabilizar métricas de interés como:
    -   Número de vistas.
    -   Número de clics en el botón "Contactar".
-   **RF-04.3:** Un vendedor debe poder ver las estadísticas de sus propias publicaciones, así como un historial de los productos que ha vendido.

### RF-05: (Futuro - Funcionalidades de IA)
-   **RF-05.1:** El sistema deberá tener un motor de recomendación para sugerir "productos relacionados" en las búsquedas y en las páginas de producto, basado en métricas de popularidad y similitud.
-   **RF-05.2:** Se implementará un sistema de moderación automática que analice las nuevas publicaciones (imágenes y texto) para detectar contenido inapropiado y decidir si se publican o se envían a revisión manual por un `MODERADOR`.
-   **RF-05.3:** El sistema de IA deberá analizar la imagen y descripción de un producto para sugerir o asignar automáticamente `tags` (etiquetas) que faciliten su búsqueda y categorización.
-   **RF-05.4:** Se implementará un chatbot para asistir a los usuarios con preguntas frecuentes sobre el uso de la plataforma.

---

## 2. Requerimientos No Funcionales (RNF)

Los requerimientos no funcionales describen las características de calidad y las restricciones del sistema.

### RNF-01: Rendimiento
-   **RNF-01.1:** El tiempo de respuesta de la API para consultas comunes (ej: listar productos) no debe exceder los 500ms.
-   **RNF-01.2:** Las páginas principales de la aplicación web deben cargar completamente en menos de 3 segundos en una conexión de internet promedio.

### RNF-02: Seguridad
-   **RNF-02.1:** Todas las contraseñas de los usuarios deben ser almacenadas de forma segura (hasheadas y salteadas).
-   **RNF-02.2:** Toda la comunicación entre el frontend y el backend debe ser cifrada mediante HTTPS para proteger los datos en tránsito.
-   **RNF-02.3:** El sistema debe protegerse contra ataques comunes como Inyección SQL y Cross-Site Scripting (XSS).
-   **RNF-02.4:** Los números de teléfono y datos personales de los usuarios deben ser tratados como información sensible y estar debidamente protegidos.

### RNF-03: Usabilidad
-   **RNF-03.1:** La interfaz debe ser intuitiva y fácil de usar para un estudiante universitario promedio sin necesidad de un manual.
-   **RNF-03.2:** El diseño debe ser responsivo, adaptándose correctamente a dispositivos móviles y de escritorio.

### RNF-04: Escalabilidad
-   **RNF-04.1:** La arquitectura debe permitir la adición de nuevos módulos de negocio (ej: subastas, intercambios) sin requerir una reescritura completa del sistema.
-   **RNF-04.2:** El sistema debe ser capaz de manejar un aumento del 50% en el número de usuarios y transacciones durante los primeros 6 meses sin degradación del rendimiento.

### RNF-05: Mantenibilidad
-   **RNF-05.1:** El código debe seguir las guías de estilo definidas y estar debidamente documentado para facilitar la incorporación de nuevos desarrolladores.

### RNF-06: Testing
-   **RNF-06.1:** Se deben implementar pruebas unitarias y de integración utilizando Jest para garantizar la calidad y estabilidad del código.
-   **RNF-06.2:** Las pruebas deben cubrir al menos el 70% del código, incluyendo servicios, controladores y utilidades principales.

---

## 3. Vistas Principales del Frontend (Descripción Funcional)

Esta sección describe, a alto nivel, las páginas o vistas principales de la aplicación y qué funcionalidades contendrán.

### Vista 01: Página Principal (Home)
-   **Contenido:**
    -   Una barra de búsqueda prominente.
    -   Una cuadrícula o lista de productos (inicialmente, los más recientes; en el futuro, recomendados por IA).
    -   Acceso visible al perfil de usuario y al botón para publicar un nuevo producto (si el usuario está logueado).

### Vista 02: Página de Detalles del Producto
-   **Contenido:**
    -   Galería de fotos del producto.
    -   Nombre, precio, descripción y categoría.
    -   Información del vendedor (nombre y enlace a su perfil público).
    -   Botón "Contactar" (que activa el flujo de WhatsApp).
    -   Botón para añadir/quitar de "Favoritos".

### Vista 03: Perfil de Usuario
-   **Contenido (organizado en pestañas o secciones):**
    -   **Mis Datos:** Para editar nombre, foto de perfil y gestionar contraseña.
    -   **Mis Publicaciones:** Lista de productos publicados por el usuario, con opciones para editar, marcar como vendido o eliminar. También mostrará estadísticas básicas (vistas, clics en contactar).
    -   **Mis Favoritos:** Lista de las publicaciones que el usuario ha guardado.
    -   **(Para Moderadores/Admins):** Pestañas adicionales para la gestión de publicaciones reportadas y usuarios.