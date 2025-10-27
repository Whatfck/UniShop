# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install all deps (including dev) for the build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove dev dependencies to keep image small (produce production node_modules)
RUN npm prune --production || true

FROM node:18-alpine AS production

WORKDIR /app

# Copy only what we need from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY healthcheck.js ./

# Create non-root user and set ownership
RUN addgroup -g 1001 -S nodejs || true
RUN adduser -S nestjs -u 1001 || true
RUN chown -R 1001:1001 /app
USER 1001

# Expose port
EXPOSE 8080

# Health check (uses the bundled script)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application (production build)
CMD ["node", "dist/main"]