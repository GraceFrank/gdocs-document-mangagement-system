const express = require('express');
const connectToDb = require('./startup/db');
const { connectToRedis } = require('./startup/cache');
const routes = require('./startup/routes');
const logger = require('./startup/logger');
const prodDevs = require('./startup/prod');

const app = express();

if (!process.env.API_PRIVATE_KEY) {
  logger.error(`API Private Key not defined. Exiting process...`);
  process.exit(1);
}
//defining routes
routes(app);
prodDevs(app);

const port = process.env.API_PORT || 4400;

async function startApp(port) {
  connectToRedis();
  //connecting to database
  await connectToDb();
  let server = app.listen(port, () => logger.info(`listening on port ${port}`));
  return server;
}
// start server
startApp(port);
module.exports = startApp;
