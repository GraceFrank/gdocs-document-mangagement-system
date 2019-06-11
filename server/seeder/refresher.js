import User from '../models/user';
import Document from '../models/document';
import Role from '../models/role';

class refresher {
  async dropUsers() {
    await User.deleteMany({});
  }

  async dropDocuments() {
    await Document.deleteMany({});
  }
}
