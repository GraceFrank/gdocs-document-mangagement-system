import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';
import Document from '../../models/document';
import mongoose from 'mongoose';

describe('documents/Get all', () => {
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
      role: admin._id
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

  test('that a user not logged in can view only public documents', async () => {
    const res = await request(server).get(
      `/api/users/${author._id}/documents?page=1&limit=10`
    );
    const privateDocs = res.body.find(doc => doc.access === 'private');
    const publicDocs = res.body.find(doc => doc.access === 'public');

    expect(res.status).toBe(200);
    expect(privateDocs).not.toBeTruthy();
    expect(publicDocs).toBeTruthy();
  });

  test('that a an admin user  can view all documents except private', async () => {
    const token = adminUser.generateToken();
    const res = await request(server)
      .get(`/api/users/${author._id}/documents?page=1&limit=10`)
      .set('x-auth-token', token);
    const privateDocs = res.body.find(doc => doc.access === 'private');
    const publicDocs = res.body.find(doc => doc.access === 'public');
    const roleDocs = res.body.find(doc => doc.access === 'role');

    expect(res.status).toBe(200);
    expect(privateDocs).not.toBeTruthy();
    expect(publicDocs).toBeTruthy();
    expect(roleDocs).toBeTruthy();
  });

  test('that a an non-admin user  cannot view docs with access role from an author of different  role', async () => {
    const token = premiumUser.generateToken();
    const res = await request(server)
      .get(`/api/users/${author._id}/documents?page=1&limit=10`)
      .set('x-auth-token', token);
    const privateDocs = res.body.find(doc => doc.access === 'private');
    const publicDocs = res.body.find(doc => doc.access === 'public');
    const roleDocs = res.body.find(doc => doc.access === 'role');

    expect(res.status).toBe(200);
    expect(privateDocs).not.toBeTruthy();
    expect(publicDocs).toBeTruthy();
    expect(roleDocs).not.toBeTruthy();
  });

  test('that a status of 400 is returned when invalid queries are passed', async () => {
    const token = premiumUser.generateToken();
    const res = await request(server)
      .get(`/api/users/${author._id}/documents?page=a&limit=10`)
      .set('x-auth-token', token);

    expect(res.status).toBe(400);
  });
});
