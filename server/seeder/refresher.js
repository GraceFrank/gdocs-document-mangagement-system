const User = require('../models/user');
const Document = require('../models/document');
const Role = require('../models/role');

class refresher {
  async dropUsers() {
    await User.deleteMany({});
  }

  async dropDocuments() {
    await Document.deleteMany({});
  }
}
