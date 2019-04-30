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
  let premiumUser;
  let regularUser;

  beforeEach(async () => {
    server; //start server
    //roles
    const regular = await Role.create({ title: 'regular' });
    const admin = await Role.create({ title: 'admin' });
    const premium = await Role.create({ title: 'premium' });

    //users
    author = await User.create({
      name: { first: 'nnamdi', last: 'lawal' },
      email: '66nnamdi@mail.com',
      userName: '66nnamdi',
      password: 'sweetlove',
      role: regular._id
    });

    premiumUser = await User.create({
      name: { first: 'premium', last: 'user' },
      email: 'premiumUser@mail.com',
      userName: 'premiumUser',
      password: 'sweetlove',
      role: premium._id
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
    await Document.insertMany([
      {
        access: 'role',
        ownerId: author._id,
        title: 'role access document',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'public',
        ownerId: author._id,
        title: 'public document',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'private',
        ownerId: author._id,
        title: 'private document',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'role',
        ownerId: author._id,
        title: 'role access document1',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'public',
        ownerId: author._id,
        title: 'public document1',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'private',
        ownerId: author._id,
        title: 'private document1',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'role',
        ownerId: author._id,
        title: 'role access document2',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'public',
        ownerId: author._id,
        title: 'public document2',
        content: 'Document',
        role: regular._id
      },
      {
        access: 'private',
        ownerId: author._id,
        title: 'private document2',
        content: 'Document',
        role: regular._id
      }
    ]);
    //old document that is created  by author to already in db before test
  });

  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
    await Document.deleteMany({});
  });

  test('that a non-author of a private doc can a private doc', async () => {
    const token = regularUser.generateToken();
    const res = await request(server)
      .get(`/api/documents/all`)
      .set('x-auth-token', token);

    const privateDocs = res.body.find(doc => doc.access === 'private');
    expect(res.status).toBe(200);
    expect(privateDocs).not.ToBeTruthy();
  });

  test('that  the  author of a private doc can retrieve a private doc', async () => {
    const token = author.generateToken();
    const res = await request(server)
      .get(`/api/documents/all`)
      .set('x-auth-token', token);

    const privateDocs = res.body.find(doc => doc.access === 'private');
    expect(res.status).toBe(200);
    expect(privateDocs).ToBeTruthy();
  });

  test('that  the  author of a private doc can retrieve a private doc', async () => {
    const token = author.generateToken();
    const res = await request(server)
      .get(`/api/documents/all`)
      .set('x-auth-token', token);

    const privateDocs = res.body.find(doc => doc.access === 'private');
    expect(res.status).toBe(200);
    expect(privateDocs).ToBeTruthy();
  });
});

/**
 * Write a test that validates ONLY the creator of a document can retrieve a file with “access” set as “private” 
Write a test that validates ONLY user’s with the same role as the creator, can access documents with property “access” set to “role”.
Write a test that validates that all documents are returned, limited by a specified number, when Documents.all is called with a query parameter limit. All documents should only include:
Documents marked as public
Documents that have role level access i.e created by a user with the same role level
Documents created by the logged in user
If user is admin, then all available documents
Write a test that also employs the limit above with an offset as well (pagination). So documents could be fetched in chunks e.g 1st 10 document, next 10 documents (skipping the 1st 10) and so on.
Write a test that validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called.
Create a test suite called `Search`.
Write a test that validates that all documents returned, given a search criteria, can be limited by a specified number, ordered by published date and were created by a specified role.
Write a test that validates that all documents returned, can be limited by a specified number and were published on a certain date.
Write code to make all tests pass and publish the project as a Github repository.

 */
