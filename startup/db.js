//module dependencies
import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

export default function() {
  //get db from config module, depending on the node environment
  const db = config.get('db');

  //connect to the database
  mongoose
    .connect(db, {
      useNewUrlParser: true
    })
    .then(() => {
      logger.info(`connected to database ${db}`);
    });
}
