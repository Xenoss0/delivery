<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $users = User::getAllUsers();
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération des utilisateurs'], 500);
        }
    }

    /**
     * Display a listing of users by role.
     *
     * @param string $role
     * @return \Illuminate\Http\Response
     */
    public function getUsersByRole($role)
    {
        try {
            if (!in_array($role, ['admin', 'client', 'livreur'])) {
                return response()->json(['message' => 'Rôle invalide'], 400);
            }
            
            $users = User::getUsersByRole($role);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching users by role: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération des utilisateurs'], 500);
        }
    }

    /**
     * Get all livreurs.
     *
     * @return \Illuminate\Http\Response
     */
    public function getLivreurs()
    {
        try {
            $livreurs = User::getLivreurs();
            return response()->json($livreurs);
        } catch (\Exception $e) {
            Log::error('Error fetching livreurs: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération des livreurs'], 500);
        }
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone_number' => 'required|string|max:20',
                'role' => 'required|string|in:admin,client,livreur',
                'address' => 'nullable|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $userId = User::addUser($validated);
            
            if ($userId) {
                return response()->json([
                    'message' => 'Utilisateur créé avec succès',
                    'id' => $userId
                ], 201);
            }
            
            return response()->json(['message' => 'Erreur lors de la création de l\'utilisateur'], 500);
        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::getUserById($id);
            
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
            
            return response()->json($user);
        } catch (\Exception $e) {
            Log::error('Error fetching user: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération de l\'utilisateur'], 500);
        }
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::getUserById($id);
            
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }
            
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($id),
                ],
                'phone_number' => 'required|string|max:20',
                'role' => 'required|string|in:admin,client,livreur',
                'password' => 'nullable|string|min:8|confirmed',
            ]);
            
            $validated['id'] = $id;
            
            $success = User::updateUser($validated);
            
            if ($success) {
                return response()->json(['message' => 'Utilisateur mis à jour avec succès']);
            }
            
            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'utilisateur'], 500);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Update the user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['message' => 'Utilisateur non authentifié'], 401);
            }
            
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'phone_number' => 'required|string|max:20',
            ]);
            
            $validated['id'] = $user->id;
            
            $success = User::updateProfile($validated);
            
            if ($success) {
                return response()->json(['message' => 'Profil mis à jour avec succès']);
            }
            
            return response()->json(['message' => 'Erreur lors de la mise à jour du profil'], 500);
        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $success = User::deleteUser($id);
            
            if ($success) {
                return response()->json(['message' => 'Utilisateur supprimé avec succès']);
            }
            
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la suppression de l\'utilisateur'], 500);
        }
    }

    /**
     * Check if email exists.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkEmail(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email|max:255',
            ]);
            
            $exists = User::findUserByEmail($validated['email']);
            
            return response()->json(['exists' => $exists]);
        } catch (\Exception $e) {
            Log::error('Error checking email: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}