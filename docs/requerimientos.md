# 📄 Requerimientos de Unishop

Este documento detalla los requerimientos funcionales y no funcionales para la plataforma de marketplace Unishop.

---

## 1. Requerimientos Funcionales (RF)

Los requerimientos funcionales describen las funcionalidades específicas que el sistema debe ofrecer a los usuarios.

### RF-01: Gestión de Usuarios
-   **RF-01.1:** El registro estará limitado a correos institucionales(ej: `...@campusucc.edu.co`). El proceso solicitará nombre, correo y contraseña. Opcionalmente, el usuario podrá añadir una foto de perfil durante el registro o más tarde.
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
-   **RF-02.7:** La descripción de un producto no debe contener información personal de contacto como números de teléfono, direcciones, correos electrónicos o enlaces a redes sociales. El sistema debe hacer cumplir esta regla tanto a través de la moderación manual como, en el futuro, de la automática (ver **RF-05.2**).

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
-   **RF-05.2:** Se implementará un sistema de moderación automática que analice las nuevas publicaciones (imágenes y texto). En lugar de censurar automáticamente, el sistema detectará contenido inapropiado (como información de contacto) y bloqueará la publicación, informando al usuario del motivo específico para que pueda corregirlo. Los casos ambiguos se enviarán a revisión manual.
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
    -   **Header:**
        -   Barra de búsqueda prominente (cubre **RF-02.4**).
        -   **Si no está autenticado:** Botones "Iniciar Sesión" y "Registrarse".
        -   **Si está autenticado:** Botón "Vender", foto de perfil del usuario (clicable) y, si tiene el rol, un botón "Moderar".
            -   Al hacer clic en la foto de perfil se despliega un menú con: "Ver Perfil Público", "Panel de Usuario" y "Cerrar Sesión".
    -   **Cuerpo Principal (layout de dos columnas):**
        -   **Columna Izquierda (Panel de Filtros):** Una sección para refinar la vista de productos. Incluirá:
            -   **Categorías:** Una lista de las principales categorías de productos (ej: Libros, Tecnología, Ropa, etc.).
            -   **Rango de Precios:** Un control deslizante (slider) o campos de entrada para definir un precio mínimo y máximo.
            -   **Condición:** Opciones para filtrar por productos "Nuevos" o "Usados".
            -   **Fecha de Publicación:** Opciones para ver productos publicados "Hoy", "Esta semana" o "Este mes".
        -   **Columna Derecha (Cuadrícula de Productos):**
            -   Cada producto se muestra en una tarjeta con su foto, nombre y precio.
            -   **Efecto Hover:** Al pasar el cursor sobre la tarjeta de un producto, aparece un icono de corazón en una esquina. El icono será una silueta si el producto no es favorito, y un corazón relleno si ya lo es, permitiendo al usuario cambiar su estado con un clic (cubre **RF-03.4**).

### Vista 02: Página de Resultados de Búsqueda
-   **Acceso:** Se llega a esta vista tras usar la barra de búsqueda o al aplicar filtros en la Home.
-   **Estructura:** Utiliza la misma estructura de dos columnas que la Página Principal para mantener la consistencia.
-   **Contenido:**
    -   **Columna Izquierda (Panel de Filtros):** Mantiene los filtros de categoría, precio, etc., permitiendo refinar aún más la búsqueda.
    -   **Columna Derecha (Resultados):**
        -   Muestra una cuadrícula con los productos que coinciden con los criterios de búsqueda y filtros. Las tarjetas de producto tienen el mismo efecto `hover` con el icono de corazón.
        -   Incluye opciones para ordenar los resultados (ej: por precio ascendente/descendente, fecha de publicación).
        -   Debajo de los resultados principales, se mostrará una sección de "productos recomendados" para mejorar el descubrimiento (cubre **RF-02.4** y prepara para **RF-05.1**).

### Vista 03: Página de Detalles del Producto
-   **Contenido:**
    -   Galería de fotos del producto.
    -   Nombre, precio, descripción detallada y categoría (cubre **RF-02.5**).
    -   Información del vendedor: nombre y enlace a su perfil público (cubre **RF-01.6** y **RF-02.5**).
    -   **Botón "Contactar":** Un botón verde con el icono de WhatsApp y el texto "Contactar". Al hacer clic, activa el flujo de contacto a través de WhatsApp (cubre **RF-03.1**).
    -   **Botón de Favoritos:** Un icono de corazón que permite añadir/quitar la publicación de la lista de favoritos del usuario.
        -   **Estado Visual:** El icono será una **silueta de corazón** si el producto no es favorito, y un **corazón relleno** (ej: color rojo) si ya lo es.
        -   **Interacción:** Al hacer clic, el icono cambia de estado inmediatamente para dar feedback visual al usuario mientras la petición se procesa en segundo plano.

### Vista 04: Formulario de Publicación/Edición de Producto
-   **Acceso:** A través del botón "Vender" para usuarios autenticados.
-   **Contenido:**
    -   Formulario para ingresar nombre, descripción, precio y categoría.
    -   Componente para subir una o varias fotos (obligatorio al menos una, según **RF-02.1**).
    -   Si el usuario no ha verificado su teléfono, se le pedirá hacerlo aquí para poder publicar (cubre **RF-03.2**).

### Vista 05: Perfil Público de Vendedor
-   **Acceso:** Al hacer clic en el nombre de un vendedor en la página de producto.
-   **Contenido:**
    -   Nombre y foto del vendedor.
    -   Cuadrícula con todas las publicaciones activas del vendedor (cubre **RF-01.6**).
    -   Esta es la vista que otros usuarios ven de un vendedor.

### Vista 06: Panel de Usuario (Dashboard)
-   **Acceso:** A través del menú desplegable de la foto de perfil. Es el centro de control privado del usuario.
-   **Contenido (organizado con un menú de navegación lateral):**
    -   **Panel Lateral:** Menú con accesos a las diferentes secciones.
    -   **Secciones:**
        -   **Perfil:** Formulario para editar nombre, foto de perfil, gestionar contraseña y actualizar/verificar número de teléfono (cubre **RF-01.3**, **RF-01.4**, **RF-03.2**).
        -   **Mis Publicaciones:** Lista de productos publicados por el usuario, con opciones para editar, marcar como vendido o eliminar. Incluye estadísticas por publicación (vistas, clics en "Contactar") (cubre **RF-02.2**, **RF-04.2**, **RF-04.3**).
        -   **Mis Favoritos:** Lista de las publicaciones que el usuario ha guardado (cubre **RF-03.4** y **RF-03.5**).
        -   **Historial de Ventas:** Productos marcados como `VENDIDO` (cubre **RF-02.2** y **RF-04.3**).

### Vista 07: Flujo de Autenticación (Modal)
-   **Funcionamiento:** En lugar de redirigir a páginas separadas, al hacer clic en "Iniciar Sesión" o "Registrarse", se abrirá un componente modal sobre la vista actual.
-   **Contenido del Modal:**
    -   **Formulario de Registro:** Solicita nombre, correo institucional y contraseña (cubre **RF-01.1**).
    -   **Formulario de Inicio de Sesión:** Solicita correo y contraseña (cubre **RF-01.2**).
    -   **Flujo de Recuperación de Contraseña:** Enlace que inicia el proceso para restablecer la contraseña (cubre **RF-01.3**).

### Vista 08: Página de Moderación (Exclusiva para rol `MODERADOR`)
-   **Acceso:** Exclusivo a través del botón "Moderar" en el header, visible únicamente para usuarios con el rol de `MODERADOR`.
-   **Contenido:**
    -   **Layout de dos paneles:**
        -   **Panel Izquierdo (Cola de Tareas):** Una lista de todas las publicaciones que están pendientes de revisión. Cada elemento de la lista mostrará información clave como el título del producto y el nombre del vendedor.
        -   **Panel Derecho (Detalle de Revisión):** Al seleccionar una publicación de la cola, este panel mostrará todos sus detalles: galería de fotos, descripción completa, precio, etc., para que el moderador pueda evaluarla a fondo.
    -   **Acciones de Moderación (en el panel de detalle):**
        -   **Botón "Aprobar":** La publicación se hace visible para todos los usuarios en la plataforma.
        -   **Botón "Rechazar":** Al hacer clic, se abre un modal o sección que permite al moderador:
            1.  **Seleccionar un motivo principal** de una lista predefinida (ej: "Producto no permitido", "Fotos de baja calidad", "Descripción incompleta", "Información de contacto en la descripción").
            2.  **(Opcional) Añadir un comentario personalizado** para dar más detalles al vendedor.
            Esta combinación asegura consistencia y permite dar feedback específico. La acción notifica al vendedor con el motivo y el comentario, y mantiene la publicación como no visible (cubre **RF-02.6**).