const mongoose = require('mongoose');

const docSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    title: {
      type: String,
      required: true,
      maxlength: 1000,
      unique: true
    },
    content: {
      type: String,
      maxlength: 100000
    },
    access: {
      type: String,
      enum: ['public', 'private', 'role'],
      default: 'public'
    },
    role: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'roles'
    }
  },
  { timestamps: true }
);

const Doc = mongoose.model('documents', docSchema);

class Documents {
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
   * @param {string} documentId
   * @return {object} updated document
   */
  async findByIdAndUpdate(documentId, updateObject) {
    return await this.model.findByIdAndUpdate(documentId, updateObject, {
      new: true
    });
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} documentId
   * @return {object} deleted document
   */
  async findByIdAndDelete(documentId) {
    return await this.model.findByIdAndDelete(documentId);
  }

  /**
   * Method to delete a document from database by using the document Id
   * @param {string} documentId
   * @return {object} deleted document
   */
  async findById(documentId) {
    return await this.model.findById(documentId);
  }
}

module.exports = new Documents(Doc);
