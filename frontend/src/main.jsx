import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './assets/styles/global.css'

import { Auth0Provider } from '@auth0/auth0-react'
import { UserProvider } from './contexts/UserContext.jsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  console.error('Auth0 configuration is missing. Please check your environment variables.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/dashboard'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
