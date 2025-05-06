import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // État pour le formulaire d'ajout d'utilisateur
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    role: 'client',
    password: ''
  });
  
  // État pour le mode d'édition
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  
  // Récupération des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError('Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Récupération des utilisateurs par rôle
  const fetchUsersByRole = async (role) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/users/role/${role}`);
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error(`Erreur lors de la récupération des utilisateurs avec le rôle ${role}:`, err);
      setError(`Impossible de récupérer les utilisateurs avec le rôle ${role}. Veuillez réessayer plus tard.`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create a copy of the form data with password_confirmation
      const submitData = {
        ...formData,
        password_confirmation: formData.password // Set password_confirmation equal to password
      };
      
      if (editMode) {
        // Mise à jour d'un utilisateur existant
        await axios.put(`http://localhost:8000/api/users/${editUserId}`, submitData);
        setEditMode(false);
        setEditUserId(null);
      } else {
        // Création d'un nouvel utilisateur
        await axios.post('http://localhost:8000/api/users', submitData);
      }
      
      // Réinitialisation du formulaire
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        role: 'client',
        password: ''
      });
      
      // Actualisation de la liste des utilisateurs
      fetchUsers();
      
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', err);
      if (err.response?.data?.errors) {
        // Afficher les erreurs de validation
        const validationErrors = Object.values(err.response.data.errors).flat().join('\n');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
  
  // Vérification de l'existence d'un email
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/check-email', { email });
      return response.data.exists;
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'email:', err);
      return false;
    }
  };
  
  // Édition d'un utilisateur
  const handleEdit = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      role: user.role || 'client',
      password: ''
    });
  };
  
  // Suppression d'un utilisateur
  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        setError(err.response?.data?.message || 'Impossible de supprimer l\'utilisateur. Veuillez réessayer plus tard.');
      }
    }
  };
  
  // Filtrer les utilisateurs par rôle
  const handleFilterByRole = (role) => {
    if (role === 'all') {
      fetchUsers();
    } else {
      fetchUsersByRole(role);
    }
  };
  
  return (
    <>
      <Sidebar role="admin" />
      <section className="home-section">
        <div className="text">Gestion des Utilisateurs</div>
        
        <div className="user-management-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="user-form-container">
            <h2>{editMode ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h2>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">Prénom</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Nom</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone_number">Numéro de téléphone</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Administrateur</option>
                  <option value="client">Client</option>
                  <option value="livreur">Livreur</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editMode}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editMode ? 'Mettre à jour' : 'Ajouter'}
                </button>
                {editMode && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditMode(false);
                      setEditUserId(null);
                      setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone_number: '',
                        address: '',
                        role: 'client',
                        password: ''
                      });
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="users-list-container">
            <div className="users-filter">
              <h2>Liste des utilisateurs</h2>
              <div className="filter-buttons">
                <button onClick={() => handleFilterByRole('all')} className="filter-btn">Tous</button>
                <button onClick={() => handleFilterByRole('admin')} className="filter-btn">Admins</button>
                <button onClick={() => handleFilterByRole('client')} className="filter-btn">Clients</button>
                <button onClick={() => handleFilterByRole('livreur')} className="filter-btn">Livreurs</button>
              </div>
            </div>
            {loading ? (
              <p>Chargement des utilisateurs...</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.last_name}</td>
                        <td>{user.first_name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone_number}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? 'Admin' : 
                             user.role === 'livreur' ? 'Livreur' : 'Client'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(user)}
                          >
                            <i className='bx bx-edit-alt'></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className='bx bx-trash'></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">Aucun utilisateur trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UserManagement;