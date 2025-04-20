import express, { json, urlencoded } from 'express';
import Keycloak from 'keycloak-connect';
import csurf from 'csurf';
import cors from 'cors';

import { config } from './config.mjs';

const app = express();

const keycloak = new Keycloak(
  {},
  {
    bearerOnly: true,
    clientId: config.keycloak.clientId,
    serverUrl: config.keycloak.url,
    realm: config.keycloak.realm,
  }
);

const csrfProtection = csurf({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
});

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

// Применяем защиту от CSRF к маршрутам, требующим аутентификации (например, POST, PUT, DELETE)
app.use((req, res, next) => {
  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE'
  ) {
    return csrfProtection(req, res, next);
  }

  next();
});
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(keycloak.middleware());
app.get('/reports', keycloak.protect('prothetic_user'), (request, response) => {
  response.json(request.user);
});
app.use((_, response, __) => {
  response.status(404).send("Sorry, that resource wasn't found.");
});
app.use((error, _, response, __) => {
  console.error(error);
  response.status(500).send('Something broke!');
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
