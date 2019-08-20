const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let server;
const Role = require('../../server/models/role');
const User = require('../../server/models/user');
const config = require('../../config/default');

async function sendRequest(reqBody) {
  return await request(server)
    .post('/api/login')
    .send(reqBody);
}

let regular;
let admin;

describe('login', () => {
  describe('post/', () => {
    beforeEach(async () => {
      //start server
      server = await require('../../server/index')();

      regular = await Role.create({ title: 'regular' });
      admin = await Role.create({ title: 'admin' });

      await User.insertMany([
        {
          name: { first: 'user1', last: 'solomon' },
          email: 'user1@mail.com',
          userName: 'user1',
          password: await bcrypt.hash('sweetlove', 10),
          role: regular._id
        },
        {
          name: { first: 'user2', last: 'solomon' },
          email: 'user2@mail.com',
          userName: 'user2',
          password: await bcrypt.hash('sweetlove', 10),
          role: admin._id
        }
      ]);
    });
    afterEach(async () => {
      await server.close(); //close server
      await User.deleteMany({});
      await Role.deleteMany({});
    });

    test('that user can login with correct credentials', async () => {
      const res = await sendRequest({
        email: 'user1@mail.com',
        password: 'sweetlove'
      });
      expect(res.status).toBe(200);
    }); //test end

    it('should return a status of 400 when user provides incorrect login credentials', async () => {
      const res = await sendRequest({
        email: 'user1@mail.com',
        password: 'sweetlover'
      });
      expect(res.status).toBe(400);
    }); //test end

    it('should return a status of 400 when client sends invalid payload contennt', async () => {
      const res = await sendRequest({
        email: 'user1mail.com',
        password: 'sweetlover'
      });
      expect(res.status).toBe(400);
    }); //test end

    it('should return a status of 400 if the email provided does not exist in db', async () => {
      const res = await sendRequest({
        email: 'random@mail.com',
        password: 'sweetlover'
      });
      expect(res.status).toBe(400);
    }); //test end

    it('should send a token ', async () => {
      const res = await sendRequest({
        email: 'user1@mail.com',
        password: 'sweetlove'
      });

      expect(res.body).toHaveProperty('x-auth-token');
    }); //test end

    test('token sent in the body is valid', async () => {
      const res = await sendRequest({
        email: 'user1@mail.com',
        password: 'sweetlove'
      });

      //decoding the header set in response
      const decoded = jwt.decode(res.body['x-auth-token'], config.privateKey);

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('roleId');
    }); //test end
  });
});
