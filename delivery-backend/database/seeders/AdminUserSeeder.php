<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier si l'utilisateur admin existe déjà
        if (!User::where('email', 'admin@livraison.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'first_name' => 'Admin',
                'last_name' => 'Système',
                'email' => 'admin@livraison.com',
                'phone_number' => '0600000000',
                'role' => 'admin',
                'password' => Hash::make('password123'),
            ]);
        }
    }
}