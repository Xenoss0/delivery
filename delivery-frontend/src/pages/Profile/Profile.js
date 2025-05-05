import React from 'react';

export default function Profile({ user }) {
  return (
    <>
      <div className="text">Profile</div>
      <div className="content">
        <h2>User Profile</h2>
        {user && (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            {/* More profile details */}
          </div>
        )}
      </div>
    </>
  );
}