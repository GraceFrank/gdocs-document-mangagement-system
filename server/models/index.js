const documentModel = require('./document');
const userModel = require('./user');
const roleModel = require('./role');

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
    return await this.model.create(doc);
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
    return await this.model.findByIdAndUpdate(id, updateObject, {
      new: true
    });
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} id
   * @return {object} deleted document
   */
  async findByIdAndDelete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} id
   * @return {object} deleted document
   */
  async findById(id) {
    return await this.model.findById(id);
  }
}

const Role = new Model(roleModel);
const User = new Model(userModel);
const Document = new Model(documentModel);

module.exports = { Role, User, Document };
//Todo: add caching for find one role
