<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone_number' => 'required|string|max:20',
                'address' => 'nullable|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Set default role to 'client' for new registrations
            $validated['role'] = 'client';
            
            $user = User::register($validated);
            
            // Create token for the newly registered user
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'message' => 'Utilisateur enregistré avec succès',
                'user' => $user,
                'token' => $token
            ], 201);
        } catch (ValidationException $e) {
            Log::error('Validation error during registration: ' . json_encode($e->errors()));
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error during registration: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de l\'enregistrement'], 500);
        }
    }

    /**
     * Login user and create token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);
            
            $user = User::login($validated['email'], $validated['password']);
            
            if (!$user) {
                return response()->json([
                    'message' => 'Identifiants invalides'
                ], 401);
            }
            
            // Revoke previous tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'message' => 'Connexion réussie',
                'user' => $user,
                'token' => $token
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation error during login: ' . json_encode($e->errors()));
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error during login: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la connexion'], 500);
        }
    }

    /**
     * Get the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        try {
            return response()->json($request->user());
        } catch (\Exception $e) {
            Log::error('Error fetching authenticated user: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération de l\'utilisateur'], 500);
        }
    }

    /**
     * Logout user (revoke the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);
        } catch (\Exception $e) {
            Log::error('Error during logout: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la déconnexion'], 500);
        }
    }

    /**
     * Change user password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);
            
            $user = $request->user();
            
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Le mot de passe actuel est incorrect'
                ], 401);
            }
            
            $user->password = Hash::make($validated['password']);
            $user->save();
            
            return response()->json([
                'message' => 'Mot de passe modifié avec succès'
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation error during password change: ' . json_encode($e->errors()));
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error during password change: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors du changement de mot de passe'], 500);
        }
    }
}