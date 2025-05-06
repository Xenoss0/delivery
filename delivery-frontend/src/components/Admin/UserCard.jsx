import React from 'react';
import { Link } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ userCount }) => {
  return (
    <div className="user-card">
      <div className="user-card-content">
        <div className="user-card-icon">
          <i className='bx bx-user'></i>
        </div>
        <div className="user-card-info">
          <h3>Utilisateurs</h3>
          <p className="user-count">{userCount || 0}</p>
        </div>
      </div>
      <Link to="/users" className="user-card-link">
        Gérer les utilisateurs
        <i className='bx bx-right-arrow-alt'></i>
      </Link>
    </div>
  );
};

export default UserCard;