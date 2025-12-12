<?php

use Illuminate\Support\Facades\Route;

// Serve frontend SPA - catch all routes except API
Route::get('/{any}', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
})->where('any', '^(?!api).*$');
