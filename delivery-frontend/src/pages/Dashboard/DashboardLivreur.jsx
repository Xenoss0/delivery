import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DashboardLivreur.css';

const DashboardLivreur = () => {
  return (
    <>
      <Sidebar role="livreur" />
      <section className="home-section">
        <div className="text">Dashboard Livreur</div>
        <div className="content">
          <p>Bienvenue dans votre espace livreur</p>
          {/* Contenu spécifique au livreur */}
        </div>
      </section>
    </>
  );
};

export default DashboardLivreur;