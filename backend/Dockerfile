# Use Maven with OpenJDK 21 as base image
FROM maven:3.9.5-eclipse-temurin-21

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/unishop-backend-0.0.1-SNAPSHOT.jar"]