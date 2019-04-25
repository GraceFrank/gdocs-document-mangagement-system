import express from 'express';
const app = express();

//logger for logging errors and info
import logger from './startup/logger';

//connecting to database
import connectToDb from './startup/db';
connectToDb();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

export default server;
