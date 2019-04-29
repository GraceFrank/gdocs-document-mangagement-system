import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';
import Document from '../../models/document';
import mongoose from 'mongoose';

describe('documents/put', () => {
  let roleAccessDoc;
  let publicDoc;
  let privateDoc;
  let author;
  let adminUser;
  let regularUser;

  beforeEach(async () => {
    server; //start server
    //roles
    const regular = await Role.create({ title: 'regular' });
    const admin = await Role.create({ title: 'admin' });

    //users
    author = await User.create({
      name: { first: 'nnamdi', last: 'lawal' },
      email: '66nnamdi@mail.com',
      userName: '66nnamdi',
      password: 'sweetlove',
      role: regular._id
    });

    regularUser = await User.create({
      name: { first: 'regularUser', last: 'lawal' },
      email: 'regularUser@mail.com',
      userName: 'regularUser',
      password: 'sweetlove',
      role: regular._id
    });
    adminUser = await User.create({
      name: { first: 'admin', last: 'user' },
      email: 'adminUser@mail.com',
      userName: 'adminUser',
      password: 'sweetlove',
      role: regular._id
    });
    //documents
    roleAccessDoc = await Document.create({
      access: 'role',
      ownerId: author._id,
      title: 'role access document',
      content: 'Document',
      role: regular._id
    });

    publicDoc = await Document.create({
      access: 'public',
      ownerId: author._id,
      title: 'public document',
      content: 'Document',
      role: regular._id
    });

    privateDoc = await Document.create({
      access: 'private',
      ownerId: author._id,
      title: 'private document',
      content: 'Document',
      role: regular._id
    });

    //old document that is created  by author to already in db before test
  });

  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
    await Document.deleteMany({});
  });

  test('that 404 is returned if document is not in db', async () => {
    const res = await request(server).get(
      `/api/documents/${new mongoose.Types.ObjectId()}`
    );

    expect(res.status).toBe(404);
  }); //test end
}); //describe end
