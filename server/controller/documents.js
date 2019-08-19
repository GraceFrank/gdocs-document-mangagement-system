const validate = require('../api-validations/document');
const { Document, User, Role } = require('../models');
const logger = require('../startup/logger');
const response = require('../helpers/responses');

class Documents {
  /**
   * Method to create a document
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async post(req, res) {
    try {
      //validate the request body params
      const { error } = validate(req.body);
      if (error)
        return response.badRequest(res, { message: error.details[0].message });

      //search if role already exists
      const existingDoc = await Document.findOne({
        title: req.body.title,
        ownerId: req.user.userId
      });
      if (existingDoc)
        return response.alreadyExists(res, {
          message: 'document with title already exist'
        });

      //creating the new document
      const doc = await Document.create({
        ownerId: req.user.userId,
        title: req.body.title,
        content: req.body.content,
        access: req.body.access || 'public',
        role: req.user.roleId
      });

      return response.created(res, doc);
    } catch (error) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to fetch all documents a user has access to
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async get(req, res, next) {
    try {
      // convert query to number
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);

      //assign default values if query params are invalid
      page = page ? page : 1;
      limit = limit ? limit : 20;

      //determining which query should run from the users role
      let query;
      if (req.user) {
        //Queries to run based on the role of the user
        const roleQuery = {
          admin: {
            //this query will be run if user is an admin
            $or: [
              { access: 'private', ownerId: req.user.userId },
              { access: { $ne: 'private' } }
            ]
          },
          otherRoles: {
            //this query will be run for the other roles
            $or: [
              { access: 'private', ownerId: req.user.userId },
              { access: 'public' },
              { role: req.user.roleId, access: 'role' }
            ]
          }
        };

        //get the role of the user
        let userRole = await Role.findById(req.user.roleId);
        userRole = userRole.title;

        query = userRole === 'admin' ? roleQuery.admin : roleQuery.otherRoles;
      } else query = { access: 'public' }; //this query will run if user is not logged in

      const queryOptions = {
        skip: (page - 1) * limit,
        limit: limit,
        sort: { date: -1 }
      };
      const documents = await Document.find(query, queryOptions);

      const message =
        'Array of 0 or more documents has been fetched successfully';
      return response.success(res, { message, documents });
    } catch (error) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to update a users document
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async put(req, res) {
    try {
      //validate the request body params
      const { error } = validate(req.body);
      if (error)
        return response.badRequest(res, { message: error.details[0].message });

      //fetch the required
      const doc = await Document.findOne({
        _id: req.params.id,
        ownerId: req.user.userId
      });
      if (!doc)
        return response.notFound(res, { message: 'Document not found' });

      //check that new doc title is unique to the user
      const existingDoc = await Document.findOne({
        title: req.body.title,
        _id: { $ne: req.params.id },
        ownerId: req.userId
      });
      if (existingDoc)
        return response.badRequest(res, { message: 'document already exists' });

      //update the document in the db
      const update = await Document.findByIdAndUpdate(req.params.id, req.body);
      return response.success(res, update);
    } catch (error) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to delete a users document
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async delete(req, res) {
    try {
      //checking if document exist on db
      const doc = await Document.findOne({
        _id: req.params.id,
        ownerId: req.user.userId
      });
      if (!doc)
        return response.notFound(res, { message: 'document not found' });

      //delete the document
      const deleted = await Document.findByIdAndDelete(doc._id);
      return response.success(res, deleted);
    } catch (err) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to get a  document by Id
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async getById(req, res) {
    try {
      const doc = await Document.findById(req.params.id);
      if (!doc)
        return response.notFound(res, { message: 'document not found' });

      //method is called based on the access type of the document
      const grantAccess = {
        public: () => true,
        private: () => {
          if (doc.ownerId == req.user.userId) return true;
        },
        role: async () => {
          //check if user is an admin and grant access
          const roles = await Role.find();
          const adminRole = roles.find(role => role.title === 'admin');
          if (req.user.roleId == adminRole._id) return true;

          //check if the users role is same as the docOwner's role
          const docOwner = await User.findById(req.user.userId);
          if (docOwner.role == req.user.role) return true;
        }
      };

      if (grantAccess[doc.access]()) return response.success(res, doc);
      return response.unAuthorized(res, {
        message: 'you do not have access to this document'
      });
    } catch (error) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }

  /**
   * Method to get a  documents authored  by a given user
   * @param {object} req
   * @param {object} res
   * @return {object} JSON response
   */
  async getUserDocs(req, res) {
    try {
      // convert query to number
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);

      //assign default values if query params are invalid
      page = page ? page : 1;
      limit = limit ? limit : 20;

      const docOwner = await User.findById(req.params.userId);
      if (!docOwner)
        return response.notFound(res, { message: 'document not found' });

      const admin = await Role.findOne({
        title: 'admin'
      });
      const queryOptions = {
        skip: (page - 1) * limit,
        limit: limit,
        sort: { date: -1 }
      };
      //if the user is an admin send him all documents except private access docs
      if (req.user.roleId == admin._id.toHexString()) {
        let docs = await Document.find(
          {
            access: {
              $ne: 'private'
            },
            ownerId: req.params.userId
          },
          queryOptions
        );
        return response.success(res, docs);
      }

      //if user is logged in and not an admin send him public documents and documents the one that matches same role as the user
      const query = {
        $or: [
          {
            access: 'public',
            ownerId: req.params.userId
          }
        ]
      };
      if (docOwner.role == req.user.roleId)
        query.$or.push({
          access: 'role',
          ownerId: req.params.userId
        });

      let docs = await Document.find(query, queryOptions);
      return res.send(docs);
    } catch (error) {
      logger.error(error);
      return response.internalError(res, { error });
    }
  }
}

module.exports = new Documents();
