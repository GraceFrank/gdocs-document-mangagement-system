const express = require('express');
import roles from '../routes/roles';
import users from '../routes/users';

function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
  app.use('/api/users', users);
}

export default routes;
