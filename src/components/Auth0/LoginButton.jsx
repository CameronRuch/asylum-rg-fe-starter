import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <a style={{ color: '#E2F0F7' }} onClick={() => loginWithRedirect()}>
        Log In
      </a>
    )
  );
};

export default LoginButton;
