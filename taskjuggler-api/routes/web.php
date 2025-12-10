<?php

use Illuminate\Support\Facades\Route;

// Serve frontend SPA - catch all routes except API
Route::get('/{any}', function () {
    return file_exists(public_path('index.html'))
        ? file_get_contents(public_path('index.html'))
        : view('welcome');
})->where('any', '^(?!api).*$');
