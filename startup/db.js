//module dependencies
import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';
import Role from '../models/role';

function connectToDb() {
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

//create admin and regular  roles
const createDefaultRoles = async () => {
  let admin = await Role.findOne({ title: 'admin' });
  console.log(admin);
  if (!admin) admin = await Role.create({ title: 'admin' });
};

export { connectToDb, createDefaultRoles };
