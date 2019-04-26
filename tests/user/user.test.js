import 'babel-polyfill';
import request from 'supertest';
import server from '../../index';
import User from '../../models/user';
import mongoose from 'mongoose';
import Role from '../../models/role';

/*TODO: 

Write a test that validates that a new user created has a role defined.
Write a test that validates that a new user created has both first and last names.
Write a test that validates that all users are returned only when requested by admin.

todo later
test that user actually saves to database
 */
let regular;
describe('users', () => {
  beforeEach(async () => {
    server; //start server
    await Role.insertMany([{ title: 'regular' }, { title: 'admin' }]);
    regular = await Role.findOne({ title: 'regular' });

    await User.insertMany([
      {
        name: { first: 'damilare', last: 'solomon' },
        email: 'dare@gmail',
        userName: 'darelawal',
        password: 'sweetlove',
        role: regular._id
      }
    ]);
  });
  afterEach(async () => {
    await server.close(); //close server
    await User.deleteMany({});
    await Role.deleteMany({});
  });
  describe('POST /', () => {
    // validates that a new user created is unique.

    test('that new user cannot use exsitig email', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'dare', last: 'lawal' },
          email: 'dare@gmail',
          userName: 'lawaldare',
          password: 'sweetlove'
        });
      expect(res.status).toBe(400);
    }); //test End

    test('that new user cannot use exsitig username', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: { first: 'dare', last: 'lawal' },
          email: 'darelawal@gmail',
          userName: 'darelawal',
          password: 'sweetlove'
        });
      expect(res.status).toBe(400);
    }); //test End
  }); //end of describe('POST')
}); //end of describe('users')
