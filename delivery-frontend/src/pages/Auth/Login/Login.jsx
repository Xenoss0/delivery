import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { redirectToDashboard } from '../../../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1) Configuration d'axios pour utiliser les cookies
    axios.defaults.withCredentials = true;

    // 2) Récupération du cookie CSRF
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      console.log('✅ Cookie CSRF obtenu');
    } catch (csrfError) {
      console.error('❌ Erreur lors de l\'obtention du cookie CSRF :', csrfError);
      setError('Erreur de connexion au serveur (CSRF). Veuillez réessayer plus tard.');
      setLoading(false);
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
      console.error('Détails de l\'erreur:', loginError.response?.data);
      const serverMessage = loginError.response?.data?.message;
      setError(
        serverMessage ||
        (loginError.response
          ? `Échec de la connexion (${loginError.response.status}). Détails: ${JSON.stringify(loginError.response.data)}`
          : 'Échec de la connexion. Veuillez réessayer.')
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center text-gray-800">
            Connexion à Livraison
          </h1>
          <div className="w-full flex-1 mt-8">
            {error && (
              <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
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
                )}
                <span className="ml-3">{loading ? 'Connexion...' : 'Se connecter'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
