import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import api, { getCsrfToken } from '../../api/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      // Get CSRF token first
      await getCsrfToken();
      
      // Then attempt login
      const res = await api.post('/api/login', { email, password });
      const { token, user } = res.data;
      
      // Store token for subsequent calls
      localStorage.setItem('apiToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLogin(user);
      
      // Redirect to blank page after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data.message || 'Échec de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="max-w-md w-full m-0 sm:m-10 bg-white shadow sm:rounded-lg p-6 sm:p-12">
        <div className="mt-6 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
            Livraison
          </h1>
          <div className="w-full flex-1 mt-8">
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            
            <form className="mx-auto max-w-xs" onSubmit={handleSubmit}>
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                type="password"
                placeholder="Mot De Passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                <span className="ml-3">
                  Se connecter
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

