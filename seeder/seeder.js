import faker from 'faker';
import User from '../models/user';
import bcrypt from 'bcrypt';
import Document from '../models/document';
import Role from '../models/role';

class Seeder {
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
} //seeder class

export default new Seeder();
