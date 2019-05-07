import faker from 'faker';
import User from '../models/user';
import bcrypt from 'bcrypt';
import Document from '../models/document';
import Role from '../models/role';

class Seeder {
  async fakeRoles() {
    const roles = await Role.find();
    if (roles.length > 0) {
      return;
    }
    await Role.insertMany([{ title: 'admin' }, { title: 'regular' }]);
  }

  async fakeUsers(quantity) {
    const users = await User.find();
    if (users.length >= 1) return;

    let roles = await Role.find();

    for (let i = 1; i <= quantity; i++) {
      const user = {
        name: {
          first: faker.fake('{{name.firstName}}'),
          last: faker.fake('{{name.lastName}}')
        },
        email: faker.fake('{{internet.email}}'),
        userName: faker.fake('{{internet.userName}}'),
        password: await bcrypt.hash('sweetlove', 10),
        role: roles[Math.floor(Math.random() * roles.length)]._id
      };
      await User.create(user);
    }
  } //seedUsers method

  async fakeDocuments(quantity) {
    const docs = await Document.find();
    if (docs.length >= 1) return;

    const users = await User.find();
    for (let i = 1; i <= quantity; i++) {
      const access = ['public', 'private', 'role'];
      const user = users[Math.floor(Math.random() * users.length)];
      await Document.create({
        ownerId: user._id,
        title: faker.fake('{{lorem.words}}'),
        content: faker.fake('{{lorem.sentences}}'),
        role: user.role,
        access: access[Math.floor(Math.random() * 3)]
      });
    }
  } //fakeDocuments Method
} //seeder class

export default new Seeder();
