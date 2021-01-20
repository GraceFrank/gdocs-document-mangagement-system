const express = require('express');
const roles = require('../routes/roles');
const users = require('../routes/users');
const login = require('../routes/login');
const documents = require('../routes/document');
const swagger = require('../documentation/swagger');

function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
  app.use('/api/users', users);
  app.use('/api/login', login);
  app.use('/api/documents', documents);
  app.use('/api-docs', swagger);
}

module.exports = routes;
