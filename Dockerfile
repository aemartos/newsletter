# Multi-stage build for Newsletter App
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Generate Prisma client
WORKDIR /app/server
RUN pnpm db:generate

# Build client
WORKDIR /app/client
RUN pnpm build

# Build server
WORKDIR /app/server
RUN pnpm build


# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8.15.0


# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built applications
COPY --from=builder --chown=appuser:nodejs /app/client/build ./client/build
COPY --from=builder --chown=appuser:nodejs /app/server/dist ./server/dist

# Copy source files needed for runtime
COPY --chown=appuser:nodejs server/prisma ./server/prisma

# Copy environment file template
COPY server/.env.example ./server/.env

# Create logs directory
RUN mkdir -p /app/logs && chown appuser:nodejs /app/logs

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
WORKDIR /app/server
CMD ["node", "dist/index.js"]
