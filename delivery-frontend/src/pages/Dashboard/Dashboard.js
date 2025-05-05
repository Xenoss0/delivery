import React from 'react';

export default function Dashboard({ user }) {
  return (
    <section className="home-section">
      <div className="text">Dashboard</div>
      {/* TODO: insert your charts, tables, stats here */}
      {user ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Welcome to the Dashboard!</h1>
      )}
      {/* Your dashboard content here */}
    </section>
  );
}