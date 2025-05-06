import axios from 'axios';

// Configuration globale d'axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Vérifier si l'utilisateur est authentifié
export const checkAuth = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout');
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
    
    // Même en cas d'erreur 500, on considère que l'utilisateur est déconnecté côté frontend
    if (error.response && error.response.status === 500) {
      console.log('Erreur 500 du serveur, mais déconnexion locale effectuée');
      return true; // On retourne true pour que la redirection vers login se fasse quand même
    }
    
    return false;
  }
};

// Rediriger vers le dashboard approprié en fonction du rôle
export const redirectToDashboard = (user, navigate) => {
  if (!user) {
    navigate('/login');
    return;
  }

  switch (user.role) {
    case 'admin':
      navigate('/dashboard/admin');
      break;
    case 'livreur':
      navigate('/dashboard/livreur');
      break;
    case 'client':
    default:
      navigate('/dashboard/client');
      break;
  }
};