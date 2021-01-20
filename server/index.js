const express = require("express");
const cookieParser = require("cookie-parser");
var cors = require("cors");

const connectToDb = require("./startup/db");
const { connectToRedis } = require("./startup/cache");
const routes = require("./startup/routes");
const logger = require("./startup/logger");
const prodDevs = require("./startup/prod");

const app = express();
app.use(cors());
app.use(cookieParser());

if (!process.env.API_PRIVATE_KEY) {
  logger.error(`API Private Key not defined. Exiting process...`);
  process.exit(1);
}
//defining routes
routes(app);
prodDevs(app);

const port = process.env.API_PORT;

connectToRedis();
//connecting to database
connectToDb().then(() => {
  app.listen(port, () => logger.info(`listening on port ${port}`));
});

module.exports = app;
