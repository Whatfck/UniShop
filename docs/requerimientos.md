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
-   **RF-01.5:** El sistema gestiona un solo rol de usuario: `USER`, que puede comprar y vender productos.
-   **RF-01.6:** Cualquier usuario debe poder ver el perfil público de un vendedor, donde se listarán todas sus publicaciones activas.

### RF-02: Gestión de Publicaciones
-   **RF-02.1:** Cualquier usuario con un número de teléfono verificado puede publicar un nuevo producto. Es **obligatorio** especificar nombre, descripción, precio, categoría y al menos una foto del producto.
    -   **RF-02.1.1:** Las imágenes deben tener un tamaño máximo de 5MB por archivo y formatos soportados: JPG, PNG, WebP.
    -   **RF-02.1.2:** Se permiten hasta 10 imágenes por producto, siendo la primera la imagen principal.
-   **RF-02.2:** Un usuario puede gestionar sus publicaciones, lo que incluye:
    -   Editar la información de una publicación activa.
    -   Marcar una publicación como `VENDIDO`, lo que la desactivará de la vista pública pero la mantendrá en su historial.
    -   Eliminar permanentemente una publicación.
-   **RF-02.3:** Cualquier usuario (registrado o no) debe poder ver la lista de productos disponibles.
-   **RF-02.4:** Cualquier usuario debe poder buscar productos por nombre o categoría. Los resultados deben mostrar los productos más relevantes y una sección de "productos relacionados".
-   **RF-02.5:** Cualquier usuario debe poder ver los detalles de un producto específico (fotos, descripción, precio, información del vendedor).
-   **RF-02.6:** La descripción de un producto no debe contener información personal de contacto como números de teléfono, direcciones, correos electrónicos o enlaces a redes sociales. Los usuarios serán responsables de seguir esta regla.

### RF-03: Interacción y Contacto
-   **RF-03.1:** El método de contacto principal será WhatsApp. Al hacer clic en "Contactar", se generará un mensaje predefinido para enviar al vendedor (ej: "Hola, me interesa tu producto '[Nombre del Producto]' que vi en Unishop.").
    -   **RF-03.1.1:** Se utilizará WhatsApp Business API o deep linking para integración nativa.
-   **RF-03.2:** Para poder publicar un producto, un usuario debe primero verificar su número de teléfono. El sistema debe tener un mecanismo para esta verificación (ej: envío de código por SMS/WhatsApp).
    -   **RF-03.2.1:** Los códigos de verificación tendrán expiración de 10 minutos y máximo 3 intentos por hora.
-   **RF-03.3:** Un usuario no está obligado a verificar su número de teléfono para contactar a un vendedor.
-   **RF-03.4:** Un usuario debe poder guardar publicaciones en una lista de "Favoritos".
-   **RF-03.5:** Un usuario debe poder ver su lista de favoritos. Si una publicación en esta lista es marcada como `VENDIDO` o eliminada, debe aparecer como "Publicación inactiva" en la lista de favoritos del usuario.

### RF-04: Historial y Estado de Productos
-   **RF-04.1:** Un vendedor debe poder ver un historial de los productos que ha vendido.
-   **RF-04.2:** El sistema debe mantener el estado de cada producto (activo, vendido, eliminado) y permitir que los vendedores marquen productos como vendidos.

### RF-05: Funcionalidades de IA Básicas
-   **RF-05.1:** El sistema deberá tener un motor de recomendación simple para sugerir "productos relacionados" en las búsquedas y en las páginas de producto, basado en categoría y popularidad.
-   **RF-05.2:** Se implementará un chatbot básico para asistir a los usuarios con preguntas frecuentes sobre el uso de la plataforma, utilizando respuestas predefinidas basadas en reglas.
-   **RF-05.3:** Los modelos de IA utilizados serán ligeros y ejecutados localmente para garantizar privacidad, sin requerir hardware especializado avanzado.

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
-   **RNF-02.5:** Se implementará rate limiting para prevenir abuso de la API (máximo 100 requests/minuto por IP).
-   **RNF-02.6:** Los datos del chatbot y análisis de IA deben estar encriptados y con acceso restringido.

### RNF-03: Usabilidad
-   **RNF-03.1:** La interfaz debe ser intuitiva y fácil de usar para un estudiante universitario promedio sin necesidad de un manual.
-   **RNF-03.2:** El diseño debe ser responsivo, adaptándose correctamente a dispositivos móviles y de escritorio.
-   **RNF-03.3:** La aplicación debe tener un diseño moderno con tema claro por defecto, optimizado para estudiantes universitarios.

### RNF-04: Escalabilidad
-   **RNF-04.1:** La arquitectura debe permitir la adición de nuevos módulos de negocio (ej: subastas, intercambios) sin requerir una reescritura completa del sistema.
-   **RNF-04.2:** El sistema debe ser capaz de manejar un aumento del 50% en el número de usuarios y transacciones durante los primeros 6 meses sin degradación del rendimiento.
-   **RNF-04.3:** El sistema debe manejar hasta 1000 usuarios concurrentes con tiempos de respuesta <500ms para operaciones críticas.
-   **RNF-04.4:** La base de datos debe soportar hasta 1 millón de productos y 100 mil usuarios sin degradación significativa del rendimiento.

### RNF-05: Mantenibilidad
-   **RNF-05.1:** El código debe seguir las guías de estilo definidas y estar debidamente documentado para facilitar la incorporación de nuevos desarrolladores.
-   **RNF-05.2:** El sistema debe mantener logs básicos de operaciones críticas y errores para debugging.

### RNF-06: Testing
-   **RNF-06.1:** Se deben implementar pruebas básicas unitarias para funcionalidades críticas.
-   **RNF-06.2:** Las pruebas deben cubrir las funcionalidades principales para asegurar estabilidad básica.

---

## 3. Vistas Principales del Frontend (Descripción Funcional)

Esta sección describe, a alto nivel, las páginas o vistas principales de la aplicación y qué funcionalidades contendrán.

### Vista 01: Página Principal (Home)
-   **Contenido:**
    -   **Header:**
        -   Barra de búsqueda prominente con **búsqueda predictiva/autocomplete** (cubre **RF-02.4**).
        -   **Si no está autenticado:** Botones "Iniciar Sesión" y "Registrarse".
        -   **Si está autenticado:** Botón "Vender" y foto de perfil del usuario (clicable).
            -   Al hacer clic en la foto de perfil se despliega un menú con: "Ver Perfil Público", "Panel de Usuario" y "Cerrar Sesión".
    -   **Cuerpo Principal (layout de dos columnas):**
        -   **Columna Izquierda (Panel de Filtros):** Una sección para refinar la vista de productos con **Skeleton Loading** durante carga. Incluirá:
            -   **Categorías:** Una lista de las principales categorías de productos (ej: Libros, Tecnología, Ropa, etc.) con **chips removibles** para filtros activos.
            -   **Rango de Precios:** Un control deslizante (slider) o campos de entrada para definir un precio mínimo y máximo.
            -   **Condición:** Opciones para filtrar por productos "Nuevos" o "Usados" con **chips removibles**.
            -   **Fecha de Publicación:** Opciones para ver productos publicados "Hoy", "Esta semana" o "Este mes" con **chips removibles**.
        -   **Columna Derecha (Cuadrícula de Productos):** Con **Skeleton Loading** durante carga inicial.
            -   Cada producto se muestra en una tarjeta con su foto, nombre y precio.
            -   **Efecto Hover:** Al pasar el cursor sobre la tarjeta de un producto, aparece un icono de corazón en una esquina. El icono será una silueta si el producto no es favorito, y un corazón relleno si ya lo es, permitiendo al usuario cambiar su estado con un clic (cubre **RF-03.4**).

### Vista 02: Página de Resultados de Búsqueda
-   **Acceso:** Se llega a esta vista tras usar la barra de búsqueda o al aplicar filtros en la Home.
-   **Estructura:** Utiliza la misma estructura de dos columnas que la Página Principal para mantener la consistencia.
-   **Contenido:**
    -   **Resumen de Filtros Aplicados:** Barra superior que muestra todos los filtros activos como **chips removibles** con opción de "Limpiar todos".
    -   **Columna Izquierda (Panel de Filtros):** Mantiene los filtros de categoría, precio, etc., con **Skeleton Loading** y **chips removibles** para filtros activos, permitiendo refinar aún más la búsqueda.
    -   **Columna Derecha (Resultados):** Con **Skeleton Loading** durante carga.
        -   Muestra una cuadrícula con los productos que coinciden con los criterios de búsqueda y filtros. Las tarjetas de producto tienen el mismo efecto `hover` con el icono de corazón.
        -   Incluye opciones para ordenar los resultados (ej: por precio ascendente/descendente, fecha de publicación).
        -   Debajo de los resultados principales, se mostrará una sección de "productos recomendados" para mejorar el descubrimiento (cubre **RF-02.4** y prepara para **RF-05.1**).

### Vista 03: Página de Detalles del Producto
-   **Contenido:**
    -   Galería de fotos del producto con **Skeleton Loading** durante carga.
    -   Nombre, precio, descripción detallada y categoría (cubre **RF-02.5**).
    -   Información del vendedor: nombre y enlace a su perfil público (cubre **RF-01.6** y **RF-02.5**).
    -   **Botón "Contactar":** Un botón verde con el icono de WhatsApp y el texto "Contactar". Al hacer clic, activa el flujo de contacto a través de WhatsApp (cubre **RF-03.1**).
    -   **Botón de Favoritos:** Un icono de corazón que permite añadir/quitar la publicación de la lista de favoritos del usuario.
        -   **Estado Visual:** El icono será una **silueta de corazón** si el producto no es favorito, y un **corazón relleno** (ej: color rojo) si ya lo es.
        -   **Interacción:** Al hacer clic, el icono cambia de estado inmediatamente para dar feedback visual al usuario mientras la petición se procesa en segundo plano.

### Vista 04: Formulario de Publicación/Edición de Producto
-   **Acceso:** A través del botón "Vender" para usuarios autenticados.
-   **Contenido:**
    -   Formulario que simula la vista de detalle del producto, con placeholders indicativos donde irá cada elemento (ej: "Aquí irá el nombre del producto" en lugar de campo vacío).
    -   **Gestión de Imágenes:** Carrusel de fotos similar al de la vista de detalle.
        -   **Imagen Principal:** Área grande con placeholder "Haz clic para subir imagen principal" cuando no hay imagen.
        -   **Carrusel Adicional:** Al final del carrusel, un botón "+" para agregar más imágenes.
        -   **Eliminación Individual:** Cada imagen (incluyendo la principal) tendrá un botón de cubo de basura rojo para eliminarla individualmente.
    -   Campos para nombre, descripción, precio y categoría con placeholders descriptivos.
    -   Si el usuario no ha verificado su teléfono, se le pedirá hacerlo aquí para poder publicar (cubre **RF-03.2**).

### Vista 05: Perfil Público de Vendedor
-   **Acceso:** Al hacer clic en el nombre de un vendedor en la página de producto.
-   **Contenido:**
    -   Nombre y foto del vendedor.
    -   Cuadrícula con todas las publicaciones activas del vendedor (cubre **RF-01.6**).
    -   Esta es la vista que otros usuarios ven de un vendedor.
    -   **Nota:** No se incluye contacto directo desde el perfil para mantener la privacidad. Todo contacto se realiza exclusivamente a través de WhatsApp desde las publicaciones individuales.

### Vista 06: Panel de Usuario (Dashboard)
-   **Acceso:** A través del menú desplegable de la foto de perfil. Es el centro de control privado del usuario.
-   **Contenido (organizado con un menú de navegación lateral):**
    -   **Panel Lateral:** Menú con accesos a las diferentes secciones.
    -   **Secciones:**
        -   **Perfil:** Formulario para editar nombre, foto de perfil, gestionar contraseña y actualizar/verificar número de teléfono (cubre **RF-01.3**, **RF-01.4**, **RF-03.2**).
        -   **Mis Publicaciones:** Lista de productos publicados por el usuario, con opciones para editar, marcar como vendido o eliminar (cubre **RF-02.2**, **RF-04.2**).
        -   **Mis Favoritos:** Lista de las publicaciones que el usuario ha guardado (cubre **RF-03.4** y **RF-03.5**).
        -   **Historial de Ventas:** Productos marcados como `VENDIDO` (cubre **RF-02.2** y **RF-04.1**).
        -   **Nota:** No se incluye gestión de mensajes/conversaciones, ya que toda la comunicación se maneja exclusivamente a través de WhatsApp para mantener simplicidad y privacidad.

### Vista 07: Flujo de Autenticación (Modal)
-   **Funcionamiento:** En lugar de redirigir a páginas separadas, al hacer clic en "Iniciar Sesión" o "Registrarse", se abrirá un componente modal sobre la vista actual.
-   **Modal de Registro:**
    -   **Campos:** Nombre completo, correo institucional (@campusucc.edu.co), contraseña (mínimo 8 caracteres), confirmar contraseña.
    -   **Validaciones:** Correo institucional obligatorio, contraseña segura, términos de uso.
    -   **Funcionalidad:** Validación en tiempo real, mensajes de error específicos, enlace a "Iniciar Sesión".
    -   **Cubre:** **RF-01.1** (registro con validación de dominio UCC).
-   **Modal de Inicio de Sesión:**
    -   **Campos:** Correo institucional, contraseña, checkbox "Recordar dispositivo".
    -   **Funcionalidad:** Opción "¿Olvidaste tu contraseña?", enlace a "Crear cuenta".
    -   **Cubre:** **RF-01.2** (autenticación por correo institucional).
-   **Flujo de Recuperación de Contraseña:** Enlace que inicia el proceso para restablecer la contraseña (cubre **RF-01.3**).


### Vista 09: Página de Error 404
-   **Acceso:** Automático cuando se intenta acceder a una URL que no existe.
-   **Contenido:**
    -   **Mensaje Claro:** "Página no encontrada" con ilustración moderna.
    -   **Botón de Regreso:** Opción para volver a la página anterior o ir al Home.
    -   **Búsqueda Integrada:** Campo de búsqueda para encontrar productos directamente desde la página de error.
    -   **Diseño Consistente:** Mantiene la estética general de la aplicación con elementos de branding.