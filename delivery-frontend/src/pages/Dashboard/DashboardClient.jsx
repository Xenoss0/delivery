import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DashboardClient.css';

const DashboardClient = () => {
  return (
    <>
      <Sidebar role="client" />
      <section className="home-section">
        <div className="text">Dashboard Client</div>
        <div className="content">
          <p>Bienvenue dans votre espace client</p>
          {/* Contenu spécifique au client */}
        </div>
      </section>
    </>
  );
};

export default DashboardClient;