const faker = require('faker');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Document = require('../models/document');
const Role = require('../models/role');
const connectToDb = require('../startup/db');

process.env.NODE_ENV = 'development';
console.log(process.env.NODE_ENV);

connectToDb();
class Seeder {
  //method to insert default roles to the role collection in database
  async insertDefaultRoles() {
    const roles = await Role.find();
    //only insert roles if none exist in the database
    if (!roles.length > 0) {
      return await Role.insertMany([{ title: 'admin' }, { title: 'regular' }]);
    }
  }

  //method to seed the users collection in database
  async insertUsers(quantity) {
    //get all roles in the db since all users must have a role
    let roles = await Role.find();
    console.log(roles);
    for (let i = 1; i <= quantity; i++) {
      await User.create({
        name: {
          first: faker.fake('{{name.firstName}}'),
          last: faker.fake('{{name.lastName}}')
        },
        email: faker.fake('{{internet.email}}'),
        userName: faker.fake('{{internet.userName}}'),
        password: await bcrypt.hash('sweetlove', 10),
        //random role from the existing roles is assigned to user
        role: roles[Math.floor(Math.random() * roles.length)]._id
      });
    }
  } //seedUsers method

  //method to seed the documents collection in database
  async insertDocuments(quantity) {
    const users = await User.find();
    const access = ['public', 'private', 'role'];
    for (let i = 1; i <= quantity; i++) {
      //any user is drawn randomly from the fetched users as the document owner
      const user = users[Math.floor(Math.random() * users.length)];
      await Document.create({
        ownerId: user._id,
        title: faker.fake('{{lorem.words}}'),
        content: faker.fake('{{lorem.sentences}}'),
        role: user.role,
        //access type is assigned randomly to documents
        access: access[Math.floor(Math.random() * 3)]
      });
    }
  } //fakeDocuments Method
} //seeder class

async function seedAllDbCollections() {
  await connectToDb();
  const seeder = new Seeder();
  await seeder.insertDefaultRoles();

  await seeder.insertUsers(5);
  await seeder.insertDocuments(20);
}

seedAllDbCollections();
