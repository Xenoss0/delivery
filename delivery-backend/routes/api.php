<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/check-email', [UserController::class, 'checkEmail']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Routes d'authentification
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Routes pour le profil utilisateur (tous les utilisateurs authentifiés)
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    // Routes pour les livreurs
    Route::get('/livreurs', [UserController::class, 'getLivreurs']);
    
    // Routes pour la gestion des utilisateurs (admin seulement)
    Route::middleware('admin')->group(function () {
        Route::get('/users/role/{role}', [UserController::class, 'getUsersByRole']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
