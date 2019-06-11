import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';

let regular;
let admin;

describe('login', () => {
  describe('post/', () => {
    beforeEach(async () => {
      server; //start server
      await Role.insertMany([{ title: 'regular' }, { title: 'admin' }]);
      regular = await Role.findOne({ title: 'regular' });
      admin = await Role.findOne({ title: 'admin' });

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
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'user1@mail.com', password: 'sweetlove' });
      expect(res.status).toBe(200);
    }); //test end

    it('should return a status of 400 when user provides incorrect login credentials', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'user1@mail.com', password: 'sweetlover' });
      expect(res.status).toBe(400);
    }); //test end

    it('should return a status of 400 when client sends invalid payload contennt', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'user1mail.com', password: 'sweetlover' });
      expect(res.status).toBe(400);
    }); //test end

    it('should return a status of 400 if the email provided does not exist in db', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'random@mail.com', password: 'sweetlover' });
      expect(res.status).toBe(400);
    }); //test end

    it('should send a token ', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'user1@mail.com', password: 'sweetlove' });

      expect(res.body).toHaveProperty('x-auth-token');
    }); //test end

    test('token sent in the body is valid', async () => {
      const res = await request(server)
        .post('/api/login')
        .send({ email: 'user1@mail.com', password: 'sweetlove' });

      //decoding the header set in response
      const decoded = jwt.decode(
        res.body['x-auth-token'],
        config.get('jwtPrivateKey')
      );

      expect(decoded).toHaveProperty('_id');
      expect(decoded).toHaveProperty('role');
    }); //test end
  });
});
