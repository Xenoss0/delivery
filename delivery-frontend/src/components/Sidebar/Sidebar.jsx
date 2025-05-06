import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { logout } from '../../utils/auth';

const Sidebar = ({ role = 'client' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search");

    const handleCloseBtnClick = () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    };

    const handleSearchBtnClick = () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    };

    const menuBtnChange = () => {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };

    closeBtn?.addEventListener("click", handleCloseBtnClick);
    searchBtn?.addEventListener("click", handleSearchBtnClick);

    // Appel initial pour définir l'état correct du bouton
    menuBtnChange();

    // Nettoyage des écouteurs d'événements
    return () => {
      closeBtn?.removeEventListener("click", handleCloseBtnClick);
      searchBtn?.removeEventListener("click", handleSearchBtnClick);
    };
  }, []);

  const handleLogout = async () => {
    console.log('Bouton de déconnexion cliqué'); // Log de débogage
    try {
      // Utilisation de la fonction logout du fichier utils/auth.js
      const success = await logout();
      
      if (success) {
        console.log('✅ Déconnexion réussie');
        // Redirection vers la page de connexion
        navigate('/login');
      } else {
        console.error('❌ Échec de la déconnexion');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  };

  // Déterminer les éléments de menu en fonction du rôle
  const renderMenuItems = () => {
    const commonItems = (
      <>
        <li>
          <i className='bx bx-search'></i>
          <input type="text" placeholder="Rechercher..."/>
          <span className="tooltip">Rechercher</span>
        </li>
      </>
    );

    // Éléments spécifiques à l'administrateur
    if (role === 'admin') {
      return (
        <>
          {commonItems}
          <li>
            <Link to="/dashboard/admin">
              <i className='bx bx-grid-alt'></i>
              <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <Link to="/users">
              <i className='bx bx-user'></i>
              <span className="links_name">Utilisateurs</span>
            </Link>
            <span className="tooltip">Utilisateurs</span>
          </li>
          <li>
            <Link to="/analytics">
              <i className='bx bx-pie-chart-alt-2'></i>
              <span className="links_name">Analytiques</span>
            </Link>
            <span className="tooltip">Analytiques</span>
          </li>
          <li>
            <Link to="/settings">
              <i className='bx bx-cog'></i>
              <span className="links_name">Paramètres</span>
            </Link>
            <span className="tooltip">Paramètres</span>
          </li>
        </>
      );
    }
    
    // Éléments spécifiques au client
    else if (role === 'client') {
      return (
        <>
          {commonItems}
          <li>
            <Link to="/dashboard/client">
              <i className='bx bx-grid-alt'></i>
              <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <Link to="/orders">
              <i className='bx bx-cart-alt'></i>
              <span className="links_name">Commandes</span>
            </Link>
            <span className="tooltip">Commandes</span>
          </li>
          <li>
            <Link to="/favorites">
              <i className='bx bx-heart'></i>
              <span className="links_name">Favoris</span>
            </Link>
            <span className="tooltip">Favoris</span>
          </li>
          <li>
            <Link to="/profile">
              <i className='bx bx-user'></i>
              <span className="links_name">Profil</span>
            </Link>
            <span className="tooltip">Profil</span>
          </li>
        </>
      );
    }
    
    // Éléments spécifiques au livreur
    else if (role === 'livreur') {
      return (
        <>
          {commonItems}
          <li>
            <Link to="/dashboard/livreur">
              <i className='bx bx-grid-alt'></i>
              <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <Link to="/deliveries">
              <i className='bx bx-package'></i>
              <span className="links_name">Livraisons</span>
            </Link>
            <span className="tooltip">Livraisons</span>
          </li>
          <li>
            <Link to="/history">
              <i className='bx bx-history'></i>
              <span className="links_name">Historique</span>
            </Link>
            <span className="tooltip">Historique</span>
          </li>
          <li>
            <Link to="/profile">
              <i className='bx bx-user'></i>
              <span className="links_name">Profil</span>
            </Link>
            <span className="tooltip">Profil</span>
          </li>
        </>
      );
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="logo-details">
          <div className="logo_name">Livraison</div>
          <i className='bx bx-menu' id="btn"></i>
        </div>
        <ul className="nav-list">
          {renderMenuItems()}
          <li className="profile">
            <div className="profile-details">
              <img src="/profile.png" alt="profileImg" />
              <div className="name_job">
                <div className="name">Utilisateur</div>
                <div className="job">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
              </div>
            </div>
            <i className='bx bx-log-out' id="log_out" onClick={handleLogout}></i>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;