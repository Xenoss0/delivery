import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import profile from '../assets/images/profile.png';

function Sidebar({ user, onLogout }) {
  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);
  const searchBtnRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const closeBtn = closeBtnRef.current;
    const searchBtn = searchBtnRef.current;

    const menuBtnChange = () => {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };

    const handleCloseBtnClick = () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    };

    const handleSearchBtnClick = () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    };

    closeBtn.addEventListener("click", handleCloseBtnClick);
    searchBtn.addEventListener("click", handleSearchBtnClick);

    // Initial state
    menuBtnChange();

    // Cleanup
    return () => {
      closeBtn.removeEventListener("click", handleCloseBtnClick);
      searchBtn.removeEventListener("click", handleSearchBtnClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('apiToken');
    onLogout();
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="logo-details">
        <div className="logo_name">Delivery App</div>
        <i className='bx bx-menu' id="btn" ref={closeBtnRef}></i>
      </div>
      <ul className="nav-list">
        <li>
          <i className='bx bx-search' ref={searchBtnRef}></i>
          <input type="text" placeholder="Search..." />
          <span className="tooltip">Search</span>
        </li>
        <li>
          <Link to="/dashboard">
            <i className='bx bx-grid-alt'></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/profile">
            <i className='bx bx-user'></i>
            <span className="links_name">Profile</span>
          </Link>
          <span className="tooltip">Profile</span>
        </li>
        <li>
          <Link to="/orders">
            <i className='bx bx-cart-alt'></i>
            <span className="links_name">Orders</span>
          </Link>
          <span className="tooltip">Orders</span>
        </li>
        <li>
          <Link to="/messages">
            <i className='bx bx-chat'></i>
            <span className="links_name">Messages</span>
          </Link>
          <span className="tooltip">Messages</span>
        </li>
        <li>
          <Link to="/analytics">
            <i className='bx bx-pie-chart-alt-2'></i>
            <span className="links_name">Analytics</span>
          </Link>
          <span className="tooltip">Analytics</span>
        </li>
        <li>
          <Link to="/settings">
            <i className='bx bx-cog'></i>
            <span className="links_name">Settings</span>
          </Link>
          <span className="tooltip">Settings</span>
        </li>
        <li className="profile">
          <div className="profile-details">
            <img src={profile} alt="profileImg" />
            <div className="name_job">
              <div className="name">{user ? user.name : 'User'}</div>
              <div className="job">Delivery App</div>
            </div>
          </div>
          <i className='bx bx-log-out' id="log_out" onClick={handleLogout}></i>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
