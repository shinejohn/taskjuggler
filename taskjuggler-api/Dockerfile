# Dockerfile for Task Juggler API
# Use ECR Public Gallery to avoid Docker Hub rate limits
FROM public.ecr.aws/docker/library/php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    postgresql-client \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd \
    && docker-php-ext-enable pdo_mysql pdo_pgsql

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer directly (avoid Docker Hub rate limits)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
# Update lock file if needed, then install
# Skip post-autoload-dump scripts to avoid route loading errors during build
RUN composer update --no-dev --no-interaction --prefer-stable --no-scripts || composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Install Node dependencies and build (if needed)
# Note: Skip if package.json doesn't exist or has no build script
RUN if [ -f "package.json" ] && grep -q "\"build\"" package.json; then npm install && npm run build || echo "NPM build skipped"; else echo "Skipping npm build - no package.json or build script"; fi

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure PHP-FPM
# For php:8.3-fpm image, config is at /usr/local/etc/php-fpm.d/www.conf
# Ensure it listens on TCP port 9000 instead of socket
RUN if [ -f "/usr/local/etc/php-fpm.d/www.conf" ]; then \
        sed -i 's/listen = .*/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf; \
    elif [ -f "/usr/local/etc/php-fpm.conf" ]; then \
        sed -i 's/listen = .*/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.conf; \
    else \
        echo "PHP-FPM config not found, creating default config"; \
        mkdir -p /usr/local/etc/php-fpm.d && \
        echo '[www]' > /usr/local/etc/php-fpm.d/www.conf && \
        echo 'listen = 127.0.0.1:9000' >> /usr/local/etc/php-fpm.d/www.conf; \
    fi

# Configure Nginx
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /var/www/html/public; \
    index index.php; \
    \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
    \
    location ~ /\.(?!well-known).* { \
        deny all; \
    } \
}' > /etc/nginx/sites-available/default

# Configure Supervisor
RUN echo '[supervisord] \
nodaemon=true \
\
[program:nginx] \
command=/usr/sbin/nginx -g "daemon off;" \
autostart=true \
autorestart=true \
\
[program:php-fpm] \
command=/usr/sbin/php-fpm8.3 -F \
autostart=true \
autorestart=true \
' > /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 8080

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
