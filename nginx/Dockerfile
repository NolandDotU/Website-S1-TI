FROM nginx:1.25-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy main nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all server configurations
COPY conf.d/ /etc/nginx/conf.d/

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx

# Expose port 80 for HTTP
EXPOSE 80

# Health check - ensures nginx is responding correctly
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Run nginx in foreground mode (required for Docker signal handling)
CMD ["nginx", "-g", "daemon off;"]