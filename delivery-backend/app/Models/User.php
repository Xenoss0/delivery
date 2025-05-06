<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'role',
        'address',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'string',
    ];

    /**
     * Register a new user.
     *
     * @param array $data
     * @return User
     */
    public static function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return self::create($data);
    }

    /**
     * Authenticate a user.
     *
     * @param string $email
     * @param string $password
     * @return User|bool
     */
    public static function login(string $email, string $password)
    {
        Log::info("Tentative de connexion pour l'email: {$email}");
        $user = self::where('email', $email)->first();
        if ($user && Hash::check($password, $user->password)) {
            Log::info("Authentification réussie pour l'utilisateur: {$email}");
            return $user;
        }
        Log::error("Échec d'authentification pour l'email: {$email}");
        return false;
    }

    /**
     * Check if an email already exists.
     *
     * @param string $email
     * @return bool
     */
    public static function findUserByEmail(string $email): bool
    {
        return self::where('email', $email)->exists();
    }

    /**
     * Get user by ID.
     *
     * @param int $id
     * @return User|null
     */
    public static function getUserById(int $id)
    {
        return self::find($id);
    }

    /**
     * Get all livreurs.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getLivreurs()
    {
        return self::where('role', 'livreur')
                   ->orderBy('last_name')
                   ->orderBy('first_name')
                   ->get();
    }

    /**
     * Update user profile.
     *
     * @param array $data
     * @return bool
     */
    public static function updateProfile(array $data): bool
    {
        $user = self::find($data['id']);
        if (! $user) {
            return false;
        }
        $user->last_name = $data['last_name'] ?? $user->last_name;
        $user->first_name = $data['first_name'] ?? $user->first_name;
        $user->phone_number = $data['phone_number'] ?? $user->phone_number;
        return $user->save();
    }

    /**
     * Get all users.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllUsers()
    {
        return self::orderBy('role')
                   ->orderBy('last_name')
                   ->orderBy('first_name')
                   ->get();
    }

    /**
     * Get users by role.
     *
     * @param string $role
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUsersByRole(string $role)
    {
        return self::where('role', $role)
                   ->orderBy('last_name')
                   ->orderBy('first_name')
                   ->get();
    }

    /**
     * Add a new user (for admin).
     *
     * @param array $data
     * @return int|null
     */
    public static function addUser(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $user = self::create($data);
        return $user->id ?? null;
    }

    /**
     * Update an existing user (for admin).
     *
     * @param array $data
     * @return bool
     */
    public static function updateUser(array $data): bool
    {
        $user = self::find($data['id']);
        if (! $user) {
            return false;
        }
        $user->last_name = $data['last_name'];
        $user->first_name = $data['first_name'];
        $user->email = $data['email'];
        $user->phone_number = $data['phone_number'];
        $user->role = $data['role'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        return $user->save();
    }

    /**
     * Delete a user.
     *
     * @param int $id
     * @return bool
     */
    public static function deleteUser(int $id): bool
    {
        return (bool) self::destroy($id);
    }
}
