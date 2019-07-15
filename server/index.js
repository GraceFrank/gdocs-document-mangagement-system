import express from 'express';
import { connectToDb } from './startup/db';
import { connectToRedis } from './startup/cache';
import routes from './startup/routes';
import logger from './startup/logger';
import prodDevs from './startup/prod';

const app = express();

//connect to redis cache
connectToRedis();

//connecting to database
connectToDb();
//defining routes

routes(app);
prodDevs(app);

const port = process.env.API_PORT || 4000;
const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

export default server;
