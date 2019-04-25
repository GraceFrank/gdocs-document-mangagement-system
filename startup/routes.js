const express = require('express');
import roles from '../routes/roles';
import createDefaultRoles from '../middleware/create-default-roles';

function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
}

export default routes;
