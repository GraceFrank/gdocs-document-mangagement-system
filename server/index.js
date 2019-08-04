const express = require('express');
const { connectToDb } = require('./startup/db');
const { connectToRedis } = require('./startup/cache');
const routes = require('./startup/routes');
const logger = require('./startup/logger');
const prodDevs = require('./startup/prod');

const app = express();

//defining routes
routes(app);
prodDevs(app);

const port = process.env.API_PORT || 4000;

const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
  //connecting to database
  connectToDb();
  //connect to redis cache
  connectToRedis();
});

module.exports = server;
