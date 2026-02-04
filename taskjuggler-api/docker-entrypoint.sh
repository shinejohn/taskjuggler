#!/bin/bash

# Run database migrations
php artisan migrate --force

# Start queue worker in the background
php artisan queue:work --daemon --tries=3 &

# Start scheduler (runs every minute to check for scheduled tasks)
while true; do
    php artisan schedule:run >> /dev/null 2>&1
    sleep 60
done &

# Start PHP-FPM
php-fpm
