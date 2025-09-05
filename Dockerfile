# Multi-stage build for Newsletter App
FROM node:20-alpine AS base

# Install pnpm and curl in one layer
RUN npm install -g pnpm@6.32.25 && \
    apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build everything in parallel
RUN pnpm db:generate:prod && \
    pnpm build:client && \
    pnpm build:server

# Production stage
FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Set working directory
WORKDIR /app

# Copy only what's needed for production
COPY --from=builder --chown=appuser:nodejs /app/client/build ./client/build
COPY --from=builder --chown=appuser:nodejs /app/server/dist ./server/dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/server/prisma ./server/prisma

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Start the application
WORKDIR /app/server
CMD ["node", "dist/index.js"]
