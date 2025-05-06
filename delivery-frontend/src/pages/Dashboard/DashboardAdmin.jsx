import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  return (
    <>
      <Sidebar role="admin" />
      <section className="home-section">
        <div className="text">Dashboard Admin</div>
        
        <div className="dashboard-container">
          <div className="dashboard-cards">
            <Link to="/users" className="dashboard-card">
              <div className="card-icon">
                <i className='bx bx-user'></i>
              </div>
              <div className="card-info">
                <h3>Gestion des Utilisateurs</h3>
                <p>Ajouter, modifier ou supprimer des utilisateurs</p>
              </div>
            </Link>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <i className='bx bx-package'></i>
              </div>
              <div className="card-info">
                <h3>Commandes</h3>
                <p>Gérer les commandes en cours</p>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <i className='bx bx-bar-chart-alt-2'></i>
              </div>
              <div className="card-info">
                <h3>Statistiques</h3>
                <p>Consulter les statistiques de livraison</p>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">
                <i className='bx bx-cog'></i>
              </div>
              <div className="card-info">
                <h3>Paramètres</h3>
                <p>Configurer l'application</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardAdmin;