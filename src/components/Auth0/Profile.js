import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={user.picture}
        alt="User Profile"
        style={{ width: '150px', borderRadius: '50%', margin: '20px' }}
      />
      <h1 style={{ fontSize: '32px' }}>{user.name}</h1>
      <p style={{ fontSize: '18px' }}>{user.email}</p>
    </div>
  );
};

export default Profile;
