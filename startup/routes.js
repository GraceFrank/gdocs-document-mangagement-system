const express = require('express');
import roles from '../routes/roles';
import users from '../routes/users';
import login from '../routes/login';
function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
  app.use('/api/users', users);
  app.use('/api/login', login);
}

export default routes;
