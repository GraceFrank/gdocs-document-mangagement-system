import express from 'express';
import roles from '../routes/roles';
import users from '../routes/users';
import login from '../routes/login';
import documents from '../routes/document';

function routes(app) {
  app.use(express.json());

  app.use('/api/roles', roles);
  app.use('/api/users', users);
  app.use('/api/login', login);
  app.use('/api/documents', documents);
}

export default routes;
