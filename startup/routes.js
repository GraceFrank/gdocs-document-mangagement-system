const express = require('express');
import roles from '../routes/roles';

function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
}

export default routes;
