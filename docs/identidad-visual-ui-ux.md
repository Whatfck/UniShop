# 🎨 UniShop – Declaración de Identidad Visual y Filosofía de Diseño UI/UX

## Contexto
**UniShop** es un marketplace independiente, creado por y para estudiantes del campus Pasto de la **Universidad Cooperativa de Colombia**, pero no pertenece institucionalmente a la universidad.
Su propósito es ofrecer un entorno moderno, confiable y fluido donde la comunidad universitaria pueda comprar, vender y descubrir productos sin fricciones.

---

## Filosofía de Diseño

El diseño de UniShop adopta una filosofía **experimental, limpia y humanizada**, centrada en tres valores esenciales:

1. **Claridad:** Cada vista debe comunicar su propósito sin necesidad de explicaciones.
2. **Fluidez:** Las interacciones deben sentirse naturales, con transiciones suaves y feedback inmediato.
3. **Identidad propia:** Aunque se inspira en la seriedad y el profesionalismo de la UCC, UniShop proyecta una personalidad más fresca, dinámica y digital.

---

## Sistema de Identidad Visual

### 1. Naming y Concepto
**UniShop** = "Uni" (comunidad universitaria, conexión, identidad compartida)
**Shop** (acción, dinamismo, mercado digital)

La dualidad del nombre comunica equilibrio entre **comunidad + comercio**, **estudio + acción**, **seriedad + energía**.
Esa dualidad puede reflejarse directamente en el color y composición visual.

---

### 2. Colores Principales

#### Paleta Base (Modo Claro)
| Uso | Color | HEX | RGB | HSL |
|-----|-------|-----|-----|-----|
| Primario (Uni – azul) | Azul intenso, limpio y digital | `#1E63D0` | `30, 99, 208` | `213°, 75%, 45%` |
| Secundario (Shop – naranja) | Naranja moderno, energético pero cálido | `#FF7A33` | `255, 122, 51` | `20°, 100%, 60%` |
| Fondo base | Gris muy suave, casi blanco | `#F8F9FB` | `248, 249, 251` | `210°, 20%, 98%` |
| Texto principal | Gris oscuro, no negro puro | `#1A1A1A` | `26, 26, 26` | `0°, 0%, 10%` |
| Texto secundario | Gris medio | `#707070` | `112, 112, 112` | `0°, 0%, 44%` |
| Bordes / divisores | Discreto, mantiene limpieza visual | `#E0E0E0` | `224, 224, 224` | `0°, 0%, 88%` |
| Éxito | Verde accesible | `#10B981` | `16, 185, 129` | `160°, 84%, 40%` |
| Advertencia | Amarillo cálido | `#F59E0B` | `245, 158, 11` | `43°, 89%, 50%` |
| Error | Rojo claro | `#EF4444` | `239, 68, 68` | `0°, 84%, 60%` |

#### Paleta Base (Modo Oscuro)
| Uso | Color | HEX | RGB | HSL |
|-----|-------|-----|-----|-----|
| Fondo oscuro base | Gris azulado profundo | `#0E1116` | `14, 17, 22` | `214°, 22%, 7%` |
| Superficie secundaria | Ligeramente más clara que el fondo | `#171C22` | `23, 28, 34` | `214°, 19%, 14%` |
| Texto principal | Blanco cálido | `#F3F4F6` | `243, 244, 246` | `210°, 20%, 96%` |
| Texto secundario | Gris medio | `#9CA3AF` | `156, 163, 175` | `215°, 14%, 65%` |
| Primario (Uni – azul) | Azul brillante que resalta sobre oscuro | `#4D8EFF` | `77, 142, 255` | `217°, 100%, 65%` |
| Secundario (Shop – naranja) | Más cálido para contraste | `#FF9C4A` | `255, 156, 74` | `29°, 100%, 65%` |
| Éxito | Verde brillante | `#34D399` | `52, 211, 153` | `160°, 70%, 55%` |
| Advertencia | Amarillo brillante | `#FCD34D` | `252, 211, 77` | `48°, 94%, 68%` |
| Error | Rojo brillante | `#F87171` | `248, 113, 113` | `0°, 93%, 68%` |

**Tip visual:**
Usa el azul (Uni) como color funcional —en botones, links, estados activos— y el naranja (Shop) como color emocional —para acentos, microinteracciones y branding— para mantener equilibrio sin saturar.

---

### 3. Tipografía
- **Principal:** `Inter` (limpia, moderna, excelente legibilidad en web)
- **Alternativas:** `DM Sans`, `Satoshi`, `Urbanist`
- **Jerarquía recomendada:**
  - Títulos grandes, audaces, tracking ligeramente cerrado
  - Cuerpo mediano con buen interlineado
  - Peso semibold o bold solo para acciones o elementos interactivos

---

### 4. Logo e Identidad Gráfica
- Inspirado en FedEx: dualidad de color para reforzar concepto.
- Ejemplo:
  - "**Uni**" en azul (`#1E63D0`)
  - "**Shop**" en naranja (`#FF7A33`)
- Tipografía sans-serif geométrica (p. ej. *Poppins*, *Outfit*, *Urbanist*)
- Opcional: ícono simple (bolsa minimalista o flechas formando "U")

---

### 5. Sensación General
- Espacio generoso, márgenes amplios
- Líneas suaves y sin contornos innecesarios
- Sombras sutiles, casi invisibles (solo en hover o elevación de tarjetas)
- Animaciones naturales y ligeras (150–250ms)
- Skeletons suaves con movimiento de shimmer azul-grisáceo

La UI debe sentirse **transparente, tranquila y confiable**, pero con pequeños destellos de energía (el naranja) que recuerdan que esto es un mercado *vivo*.

---

### 6. Diseño Responsivo y Cross-Device

#### Breakpoints Principales
| Dispositivo | Ancho Mínimo | Ancho Máximo | Columnas | Márgenes |
|-------------|--------------|--------------|----------|----------|
| Móvil pequeño | 320px | 639px | 4 | 16px |
| Móvil grande | 640px | 767px | 6 | 24px |
| Tablet | 768px | 1023px | 8 | 32px |
| Desktop pequeño | 1024px | 1279px | 12 | 48px |
| Desktop grande | 1280px | 1535px | 12 | 64px |
| Desktop extra grande | 1536px+ | 12 | 80px |

#### Adaptaciones por Dispositivo
- **Móvil (320px-767px):** Layout de una sola columna, navegación bottom-tab, botones touch-friendly (44px mínimo), formularios optimizados para teclado virtual.
- **Tablet (768px-1023px):** Layout de dos columnas en home, navegación lateral colapsable, elementos interactivos de 40px mínimo.
- **Desktop (1024px+):** Layout completo de dos columnas, navegación top-bar, hover states completos, soporte para mouse y teclado.

#### Consideraciones de Usabilidad Cross-Device
- **Touch Targets:** Mínimo 44px en móvil, 40px en tablet, 32px en desktop para elementos interactivos.
- **Gestos:** Swipe para navegación en móvil, drag-and-drop en tablet/desktop.
- **Input Methods:** Optimización para teclado virtual en móvil, soporte completo de teclado en desktop.
- **Performance:** Imágenes responsivas, lazy loading, service workers para offline.

---

### 7. Accesibilidad (WCAG 2.1 AA)

#### Principios de Accesibilidad
- **Perceptible:** Alto contraste (mínimo 4.5:1), texto alternativo en imágenes, soporte para lectores de pantalla.
- **Operable:** Navegación por teclado completa, tiempo suficiente para interacciones, sin contenido que cause convulsiones.
- **Comprensible:** Lenguaje claro, navegación consistente, ayuda para prevenir errores.
- **Robusto:** Compatible con tecnologías asistivas actuales y futuras.

#### Implementación Técnica
- **Contraste de Color:** Verificado con herramientas como Contrast Checker.
- **Navegación por Teclado:** Focus visible, orden lógico de tabulación.
- **Lectores de Pantalla:** Etiquetas ARIA apropiadas, landmarks semánticos.
- **Tamaño de Texto:** Escalado automático, soporte para zoom hasta 200%.
- **Modo de Alto Contraste:** Respaldo para usuarios con necesidades visuales especiales.

---

### 8. Componentes de Diseño

#### Botones
- **Primario:** Azul (#1E63D0), texto blanco, bordes redondeados (8px), padding 12px 24px.
- **Secundario:** Transparente con borde azul, texto azul.
- **Acción:** Naranja (#FF7A33) para acciones importantes.
- **Estados:** Hover (+10% luminosidad), active (-10% luminosidad), disabled (50% opacidad).

#### Formularios
- **Campos:** Bordes sutiles (#E0E0E0), focus azul (#1E63D0), padding interno 12px.
- **Etiquetas:** Siempre visibles, asociadas correctamente con campos.
- **Validación:** Mensajes de error en rojo (#EF4444), éxito en verde (#10B981).
- **Estados de Carga:** Spinners o skeletons durante envío.

#### Tarjetas de Producto
- **Estructura:** Imagen 1:1 aspect ratio, título, precio, badge de condición.
- **Estados:** Hover con elevación sutil, focus con outline azul.
- **Acciones:** Botón favorito (corazón), overlay en hover para acciones rápidas.

---

### 9. Animaciones y Microinteracciones

#### Principios de Animación
- **Propósito:** Mejorar UX sin distraer, proporcionar feedback, guiar atención.
- **Duración:** 150-300ms para transiciones suaves.
- **Easing:** Ease-out para entradas, ease-in para salidas.
- **Reducción de Movimiento:** Respetar preferencias del sistema (prefers-reduced-motion).

#### Microinteracciones Clave
- **Botones:** Ripple effect en click, scale +5% en hover.
- **Formularios:** Shake sutil en error, checkmark en éxito.
- **Navegación:** Slide transitions entre secciones.
- **Carga:** Shimmer effect en skeletons, progress bars para uploads.

---

### 10. Mensaje Visual
> "Hecho por estudiantes. Pensado para la comunidad."

El diseño refleja cercanía, colaboración y autonomía: no pretende parecer institucional, pero sí profesional y con propósito.

---

### 11. Iconografía y Assets Visuales

#### Sistema de Iconos
- **Librería Principal:** Lucide React (consistente, accesible, gratuita)
- **Tamaños Estándar:**
  - Navegación: 24px
  - Acciones principales: 20px
  - Estados y badges: 16px
  - Microacciones: 14px
- **Colores:** Heredar del contexto de texto, usar colores semánticos para estados específicos

#### Principios de Iconografía
- **Consistencia:** Un icono = una acción (ej: corazón siempre para favoritos)
- **Claridad:** Iconos reconocibles sin texto explicativo
- **Accesibilidad:** Combinar con texto cuando sea crítico
- **Escalabilidad:** Iconos vectoriales que funcionen en todas las densidades

#### Assets Adicionales
- **Ilustraciones:** Minimalistas, relacionadas con educación/tecnología
- **Fotos de Producto:** Guidelines específicos para vendedores
- **Avatares:** Sistema de iniciales con colores aleatorios pero consistentes

---

### 12. Espaciado y Layout System

#### Scale de Espaciado
- **Unidad Base:** 4px (para consistencia matemática)
- **Escala Completa:** 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128px
- **Uso Recomendado:**
  - `2-4px`: Bordes, divisores sutiles
  - `8-16px`: Padding interno de componentes
  - `20-32px`: Márgenes entre secciones
  - `48-64px`: Espaciado de layout principal

#### Reglas de Espaciado
- **Componentes:** Padding interno consistente (16px estándar, 24px grande)
- **Layout:** Márgenes externos que sigan la escala
- **Texto:** Line-height = 1.5 para párrafos, 1.25 para títulos
- **Toque:** Mínimo 44px en móvil, 40px en tablet, 32px en desktop

---

### 13. Patrones de Interacción

#### Estados de Componentes
- **Hover:** Cambio sutil de color/luminosidad (+10% en claro, +20% en oscuro)
- **Active/Pressed:** Reducción de luminosidad (-10%)
- **Focus:** Outline azul (#1E63D0) de 2px, border-radius consistente
- **Disabled:** Opacidad 50%, cursor not-allowed
- **Loading:** Spinner o skeleton con movimiento shimmer

#### Microinteracciones Clave
- **Botones:** Ripple effect circular en click, scale +2% en hover
- **Formularios:** Validación en tiempo real, mensajes contextuales
- **Navegación:** Indicador activo, transiciones suaves entre secciones
- **Feedback:** Toast notifications para acciones completadas

#### Flujos de Usuario Principales
1. **Registro/Login:** Modal con validación progresiva
2. **Publicación:** Wizard de 3 pasos con progreso visual
3. **Búsqueda:** Autocomplete con resultados instantáneos
4. **Contacto:** Deep linking a WhatsApp con mensaje predefinido

---

### 14. Componentes Especializados de E-commerce

#### ProductCard
- **Estructura:** Imagen 280x280px (1:1), título, precio, condición, ubicación
- **Estados:** Hover con elevación, focus accesible, loading skeleton
- **Acciones:** Favorito (corazón), contacto rápido, compartir
- **Responsive:** 1 columna móvil, 2 tablet, 3+ desktop

#### FilterPanel
- **Categorías:** Chips removibles con contador de resultados
- **Rango de Precio:** Slider doble con valores numéricos
- **Condición:** Toggle buttons (Nuevo/Usado)
- **Ordenamiento:** Dropdown con opciones contextuales

#### SearchBar
- **Autocomplete:** Resultados instantáneos con categorías
- **Filtros Rápidos:** Chips debajo de la barra
- **Historial:** Sugerencias basadas en búsquedas previas
- **Estados:** Loading con spinner, empty state ilustrado

---

### 15. Dark Mode y Temas

#### Implementación Técnica
- **Toggle Global:** Interruptor en header con icono luna/sol
- **Detección Automática:** Respetar prefers-color-scheme del sistema
- **Persistencia:** Guardar preferencia en localStorage
- **Transiciones:** Animación suave de 300ms entre modos

#### Consideraciones de Diseño
- **Contraste:** Verificar ratios en ambos modos
- **Colores Adaptativos:** Sombras más pronunciadas en modo claro
- **Iconos:** Cambiar automáticamente según el contexto
- **Performance:** CSS variables para cambios instantáneos

---

## Referencias y Recursos

- **Herramientas de Diseño:** Figma para prototipado, Storybook para componentes.
- **Guías de Estilo:** Mantener este documento actualizado con cambios.
- **Testing de UX:** User testing con estudiantes, análisis de heatmaps.
- **Iteración:** Diseño basado en datos de uso real y feedback de usuarios.
- **Recursos Adicionales:**
  - [Material Design Guidelines](https://material.io/design)
  - [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
  - [WCAG 2.1 Checklist](https://www.w3.org/WAI/WCAG21/quickref/)