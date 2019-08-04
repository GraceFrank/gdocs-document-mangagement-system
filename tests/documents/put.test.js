const request = require('supertest');
const server = require('../../index');
const User = require('../../models/user');
const Role = require('../../models/role');
const Document = require('../../models/document');
const mongoose = require('mongoose');

let doc1;
let user1;

describe('documents/put', () => {
  beforeEach(async () => {
    server; //start server
    const regular = await Role.create({ title: 'regular' });

    user1 = await User.create({
      name: { first: 'nnamdi', last: 'lawal' },
      email: '66nnamdi@mail.com',
      userName: '66nnamdi',
      password: 'sweetlove',
      role: regular._id
    });

    doc1 = await Document.create({
      access: 'role',
      ownerId: user1._id,
      title: 'Document1',
      content: 'Document',
      role: regular._id
    });

    //old document that is created  by user1 to already in db before test
  });

  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
    await Document.deleteMany({});
  });

  test('that a user not logged in cannot modify a document', async () => {
    const res = await request(server)
      .put(`/api/documents/${doc1._id}`)
      .send({ title: 'Document1' });
    expect(res.status).toBe(401);
  });
  //test that only user that created the document can modify it
  test('that only user that created the document can modify it', async () => {
    const token = new User().generateToken();
    const res = await request(server)
      .put(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token)
      .send({ title: 'Document1' });
    expect(res.status).toBe(404);
  });

  test('that invalid id returns a status of 400', async () => {
    const res = await request(server)
      .put(`/api/documents/090024ikjfj`)
      .send({ title: 'Document1' });
    expect(res.status).toBe(404);
  }); //test end

  test('that update are reflected in the database', async () => {
    const token = user1.generateToken();
    const res = await request(server)
      .put(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token)
      .send({ title: 'Document1111' });

    const dbVersion = await Document.findById(doc1._id);
    expect(res.status).toBe(200);
    expect(dbVersion.title).not.toBe(doc1.title);
    expect(dbVersion.title).toBe(res.body.title);
  }); //test end

  test('that a 400 is returned when invalid payload is provided', async () => {
    const token = user1.generateToken();
    const res = await request(server)
      .put(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token)
      .send({ title: '' });

    expect(res.status).toBe(400);
  }); //test end

  test('that if document doses not exist in db a 404 is returned', async () => {
    const token = user1.generateToken();
    const res = await request(server)
      .put(`/api/documents/${new mongoose.Types.ObjectId()}`)
      .set('x-auth-token', token)
      .send({ title: 'Document1111' });

    expect(res.status).toBe(404);
  }); //test end

  test('that updated doc title is still unique', async () => {
    await Document.create({
      access: 'role',
      ownerId: user1._id,
      title: 'sameTitle',
      content: 'Document',
      role: user1.role
    });

    const token = await user1.generateToken();
    const res = await request(server)
      .put(`/api/documents/${doc1._id}`)
      .set('x-auth-token', token)
      .send({ title: 'sameTitle' });

    expect(res.status).toBe(400);
  }); //test end
}); //end of describe
