export const config = {
  port: process.env.PORT || 8000,
  appUrl: process.env.REACT_APP_URL || 'http://localhost:3000',
  keycloak: {
    url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'reports-realm',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'reports-frontend',
  },
};
