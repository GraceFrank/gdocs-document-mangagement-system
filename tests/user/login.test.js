import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import Role from '../../models/role';

//Todo:
/*
  test that user can login in with correct credentials
  test that if wrong credentials are provided userr is not logged in
  test that the header is set with valid token
  test that header token contains 

 */
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
          password: 'sweetlove',
          role: regular._id
        },
        {
          name: { first: 'user2', last: 'solomon' },
          email: 'user2@mail.com',
          userName: 'user2',
          password: 'sweetlove',
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

      expect(res.header).toHaveProperty('x-auth-token');
    });
  });
});
