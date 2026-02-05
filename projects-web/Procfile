web: php artisan migrate --force && php artisan storage:link --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
worker: php artisan horizon
scheduler: php artisan schedule:work


