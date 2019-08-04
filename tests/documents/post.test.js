const request = require ('supertest');
const server = require( '../../index');
const User = require ('../../models/user');
const Role = require ('../../models/role');
const Document = require ('../../models/document');

let regular;
describe('documents/post', () => {
  beforeEach(async () => {
    server; //start server
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

  test('new user document created has a published date defined.', async () => {
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
    expect(res.body.createdAt).toBeDefined();
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
    expect(res.body.access).toBe('public');
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
    expect(res.body.ownerId).toBeDefined();
    expect(res.body.ownerId).toBe(user._id.toHexString());
  }); //test end

  test('new user document created has unique title ', async () => {
    const user = new User({ role: regular._id });
    const existingDoc = await Document.create({
      access: 'role',
      ownerId: '5cc33f7e04fc5f18a52d8354',
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
        title: 'Document1',
        content: 'Document1   kfklflkgnklllk'
      });
    expect(res.status).toBe(400);
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

    const doc = await Document.findById(res.body._id);
    expect(doc).toBeDefined();
    expect(doc.title).toBe(res.body.title);
    expect(doc._id.toHexString()).toBe(res.body._id);
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
