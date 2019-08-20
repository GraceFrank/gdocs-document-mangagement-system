const request = require('supertest');
let server;
const Role = require('../../server/models/role');
const User = require('../../server/models/user');
const Document = require('../../server/models/document');

let regular;
describe('documents/post', () => {
  beforeEach(async () => {
    //start server
    server = await require('../../server/index')();
    await Role.insertMany([{ title: 'regular' }]);
    regular = await Role.findOne({ title: 'regular' });
  });
  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
    await Document.deleteMany({});
  });

  test('that only logged in user can create doc', async () => {
    const res = await request(server)
      .post('/api/documents')
      .send({
        name: { first: 'nnamdi', last: 'lawal' },
        email: '66nnamdi@mail.com',
        userName: '66nnamdi',
        password: 'sweetlove',
        roleId: regular._id
      });
    expect(res.status).toBe(401);
  }); //test end

  test('new document created has a published date defined.', async () => {
    const user = new User({ role: regular._id });
    const token = user.generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: 'Document1',
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.createdAt).toBeDefined();
  }); //test end

  test('new user document created has a default access set to public ', async () => {
    const user = new User({ role: regular._id });
    const token = user.generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: 'Document1',
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.body.data.access).toBe('public');
  }); //test end

  test('new user document created has owner ', async () => {
    const user = new User({ role: regular._id });
    const token = user.generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: 'Document1',
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.body.data.ownerId).toBeDefined();
    expect(res.body.data.ownerId).toBe(user._id.toHexString());
  }); //test end

  test('new user document created has title unique to the user', async () => {
    const user = new User({ role: regular._id });
    const existingDoc = await Document.create({
      access: 'role',
      ownerId: user._id,
      title: 'Document1',
      content: 'Document',
      role: regular._id,
      createdAt: '2019-04-27T18:24:46.228Z',
      modifiedAt: '2019-04-27T18:24:46.228Z',
      __v: 0
    });
    const token = user.generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: existingDoc.title,
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.status).toBe(409);
  }); //test end

  test('that it saves to database', async () => {
    const token = new User({ role: regular._id }).generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: 'Document1',
        content: 'Document1   kfklflkgnklllk'
      });

    const doc = await Document.findById(res.body.data._id);
    expect(doc).toBeDefined();
    expect(doc.title).toBe(res.body.data.title);
    expect(doc._id.toHexString()).toBe(res.body.data._id);
  });

  test('that invalid payload content returns a status of 400', async () => {
    const user = new User({ role: regular._id });
    const token = user.generateToken();

    const res = await request(server)
      .post('/api/documents')
      .set('x-auth-token', token)
      .send({
        title: '',
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.status).toBe(400);
  });
});
