# Procfile - Web Service
# This is the default process that runs when you deploy
web: cd taskjuggler-api && php artisan migrate --force --no-interaction && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
