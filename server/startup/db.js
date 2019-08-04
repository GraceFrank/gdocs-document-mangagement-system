//module dependencies
const mongoose = require ('mongoose');
const config = require ('../../config/default');
const logger = require ('./logger');

function connectToDb() {
  //get db from config module, depending on the node environment
  const db = config.db

  //connect to the database
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      logger.info(`connected to database`);
    });
}

module.exports = { connectToDb };
