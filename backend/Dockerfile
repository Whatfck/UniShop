# Etapa 1: Build
FROM maven:3.9-eclipse-temurin-11 AS builder
WORKDIR /app

# Copiamos explícitamente todo lo necesario para usar Maven Wrapper
COPY mvnw .
COPY .mvn/ .mvn/
COPY pom.xml .

# Le damos permisos de ejecución al wrapper
RUN chmod +x mvnw

# Descargamos dependencias sin compilar aún
RUN ./mvnw dependency:go-offline -B

# Copiamos el resto del código
COPY src ./src

# Compilamos el proyecto
RUN ./mvnw clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:11-jre
WORKDIR /app

# Copiamos el .jar generado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
