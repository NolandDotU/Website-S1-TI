# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
# Use --frozen-lockfile to ensure reproducible builds
RUN npm ci --frozen-lockfile

# Copy source code and config files
COPY . .

# Build TypeScript
RUN npm run build

# =========================
# Stage 2: Runtime
# =========================
FROM node:20-alpine

WORKDIR /app

# Install dumb-init and wget for proper signal handling and healthcheck
RUN apk add --no-cache dumb-init wget

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# Use --frozen-lockfile to ensure reproducible builds
RUN npm ci --frozen-lockfile --omit=dev && \
    npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create necessary directories dengan ownership yang benar
RUN mkdir -p logs uploads && \
    chown -R node:node /app && \
    chmod -R 755 /app

# Switch to node user (sudah ada di base image)
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]