'use strict';

var swaggerUi = require('swagger-ui-express');

var jsDocs = require('swagger-jsdoc');

var express = require('express');

var router = express.Router();
var options = {
  swaggerDefinition: {
    info: {
      title: 'Gdocs Document Management Systems',
      version: '1.1.0',
      description: 'An online document management system where users can c',
      contact: {
        email: 'frank.grace7@yahoo.com',
        phone: '+2348137038977'
      }
    },
    tags: [
      {
        name: 'doc',
        description: 'Everything about the users'
      },
      {
        name: 'User',
        description: 'Everything about the users'
      },
      {
        name: 'Role',
        description: 'Everything about roles'
      },
      {
        name: 'Description',
        description: 'everything about documentsgfgfh'
      }
    ]
  },
  apis: ['./documentation/*.yaml']
};
var spec = jsDocs(options);
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec)); // export default function(app) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
//

module.exports = router;
