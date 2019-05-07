import express from 'express';
import { connectToDb } from './startup/db';
import routes from './startup/routes';
import logger from './startup/logger';
import prodDevs from './startup/prod';
import seeder from './seeder/seeder';

const app = express();

//connecting to database
connectToDb();
//defining routes

//seed database

seeder.fakeRoles().then(() => {
  seeder.fakeUsers(20).then(() => {
    seeder.fakeDocuments(200);
  });
});

routes(app);
prodDevs(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

export default server;
