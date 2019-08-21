//module dependencies
const mongoose = require('mongoose');
const config = require('../../config/default');
const logger = require('./logger');

function connectToDb() {
  //get db from config module, depending on the node environment
  const db = config.db;

  //connect to the database
  return mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      logger.info(`connected to database`);
    })
    .catch(err => {
      logger.error(err);
      process.exit(1);
    });
}

module.exports = connectToDb;
