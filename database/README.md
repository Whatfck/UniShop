# 💾 Unishop - Base de Datos

Esta carpeta contiene la configuración y futura documentación relacionada con la capa de datos del proyecto.

---

## 🚀 Tecnología

El proyecto utiliza **PostgreSQL** como sistema de gestión de bases de datos relacional.

### ¿Por qué PostgreSQL?

- **Robustez y Fiabilidad**: Es una de las bases de datos de código abierto más avanzadas y confiables.
- **Escalabilidad**: Soporta grandes volúmenes de datos y concurrencia de usuarios, lo que se alinea con el futuro crecimiento de Unishop.
- **Ecosistema**: Cuenta con un amplio soporte en la comunidad y es el estándar de facto para muchas aplicaciones modernas.
- **Soporte de Tipos de Datos Avanzados**: Ofrece soporte para JSON, datos geoespaciales y más, lo que da flexibilidad para futuras funcionalidades.

---

## 🔧 Conexión

La base de datos se levanta como un servicio dentro de `docker-compose.yml`. Las credenciales y la configuración de conexión se gestionan a través de variables de entorno.

- **Host**: `db` (dentro de la red de Docker) o `localhost` (desde tu máquina).
- **Puerto**: `5432`
- **Credenciales**: Ver el archivo `docker-compose.yml` para los valores por defecto (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).

El backend se conecta a la base de datos utilizando estas variables de entorno.