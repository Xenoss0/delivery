import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { redirectToDashboard } from '../../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1) Configuration d'axios pour utiliser les cookies
    axios.defaults.withCredentials = true;

    // 2) Récupération du cookie CSRF
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      console.log('✅ Cookie CSRF obtenu');
    } catch (csrfError) {
      console.error('❌ Erreur lors de l\'obtention du cookie CSRF :', csrfError);
      setError('Erreur de connexion au serveur (CSRF). Veuillez réessayer plus tard.');
      return;
    }

    // 3) Requête de connexion
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password }
      );
      console.log('✅ Connexion réussie :', response.data);

      // Redirection vers le dashboard approprié en fonction du rôle
      if (response.data.user) {
        redirectToDashboard(response.data.user, navigate);
      } else {
        // Si le rôle n'est pas disponible, rediriger vers le dashboard client par défaut
        navigate('/dashboard/client');
      }
    } catch (loginError) {
      console.error('❌ Erreur pendant la requête de login :', loginError);
      const serverMessage = loginError.response?.data?.message;
      setError(
        serverMessage ||
        (loginError.response
          ? `Échec de la connexion (${loginError.response.status}).`
          : 'Échec de la connexion. Veuillez réessayer.')
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg border-2 border-gray-300 p-8 mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
            Connexion à Livraison
          </h1>
          <div className="w-full flex-1 mt-8">
            {error && (
              <div className="text-center text-red-500 mb-4">
                {error}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                </svg>
                <span className="ml-3">Se connecter</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
