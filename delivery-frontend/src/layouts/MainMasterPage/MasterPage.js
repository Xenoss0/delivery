import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './MasterPage.css';

/**
 * MasterPage component serves as the main layout template for authenticated pages
 * It includes the sidebar and provides an outlet for the content of each page
 */
function MasterPage({ user, onLogout }) {
  return (
    <div className="master-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default MasterPage;