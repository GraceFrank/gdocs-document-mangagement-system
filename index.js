import express from 'express';
import { connectToDb } from './startup/db';

import routes from './startup/routes';
//logger for logging errors and info
import logger from './startup/logger';

const app = express();

//connecting to database
connectToDb();
//defining routes
routes(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

export default server;
