import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = 'dev-km58judy.us.auth0.com';
  const clientId = 'TaB8NRez1Kz04sZnvxQNHZTsjA01mHpI';

  const onRedirectCallback = appState => {
    window.history.replaceState(
      appState,
      window.document.title,
      appState?.returnTo || window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
