const documentModel = require('./document');
const userModel = require('./user');
const roleModel = require('./role');
const { redisClient } = require('../startup/cache');
const logger = require('../startup/logger');

class Model {
  constructor(model) {
    this.model = model;
  }

  /**
   * Method to create a document in database
   * @param {object} doc
   * @return {object} js object
   */
  async create(doc) {
    //create document in database
    const newDoc = await this.model.create(doc);
    return newDoc;
  }

  /**
   * Method to fetch a document from database
   * @param {object} queryObject
   * @return {object} js object
   */

  async findOne(queryObject) {
    return await this.model.findOne(queryObject);
  }

  /**
   * Method to fetch documents from database based on search/qyery params
   * @param {object} queryObject
   * @return {array} array of objects
   */
  async find(queryObject, options) {
    let query = this.model.find(queryObject);

    if (options) {
      for (const key in options) {
        query = query[key](options[key]);
      }
    }
    return await query.exec();
  }

  /**
   * Method to update a document in database by using the document Id
   * @param {string} id
   * @return {object} updated document
   */
  async findByIdAndUpdate(id, updateObject) {
    //update document in db
    const update = await this.model.findByIdAndUpdate(id, updateObject, {
      new: true
    });
    //after successful update, update value in redis cache
    if (update) {
      redisClient.set(
        JSON.stringify(update._id),
        JSON.stringify(update),
        (err, reply) => {
          if (err) logger.error(err);
        }
      );
    }
    return update;
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} id
   * @return {object} deleted document
   */
  async findByIdAndDelete(id) {
    //delete document
    const doc = await this.model.findByIdAndDelete(id);
    // if document was deleted successfully update cache
    if (doc) {
      redisClient.del(JSON.stringify(id), (err, reply) => {
        if (err) logger.error(err);
      });
    }
    //return the deleted document
    return doc;
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} id
   * @return {object} deleted document
   */
  async findById(id) {
    //first find document in cache
    let doc = await redisClient.get(JSON.stringify(id));
    if (doc) return JSON.parse(doc);

    //if not in cache fetch from mongodb
    doc = await this.model.findById(id);
    //update redis cache
    if (doc) {
      redisClient.set(
        JSON.stringify(doc._id),
        JSON.stringify(doc),
        (err, reply) => {
          if (err) logger.error(err);
        }
      );
    }
    //then return fetched doc
    return doc;
  }
}

const Role = new Model(roleModel);
const User = new Model(userModel);
const Document = new Model(documentModel);

module.exports = { Role, User, Document };
